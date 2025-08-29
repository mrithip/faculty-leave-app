from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from .models import HODAction
from leave.models import LeaveRequest, LeaveBalance
from leave.serializers import LeaveRequestSerializer, LeaveBalanceSerializer
from .serializers import HODActionSerializer, StaffLeaveSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class HODLeaveViewSet(viewsets.ModelViewSet):
    serializer_class = StaffLeaveSerializer  # Use the corrected serializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # HOD can see all leaves from staff in their department
        if self.request.user.role == 'HOD':
            staff_in_dept = User.objects.filter(department=self.request.user.department, role='STAFF')
            return LeaveRequest.objects.filter(user__in=staff_in_dept).order_by('-created_at')
        return LeaveRequest.objects.none()
    # Add this to your HODLeaveViewSet
    @action(detail=False, methods=['get'])
    def my_balance(self, request):
        """Get HOD's own leave balance"""
        if request.user.role != 'HOD':
            return Response({'error': 'Only HOD can access this'}, status=403)
        
        try:
            balance, created = LeaveBalance.objects.get_or_create(user=request.user)
            serializer = LeaveBalanceSerializer(balance)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=False, methods=['get'])
    def my_leaves(self, request):
        """Get HOD's own leave requests"""
        if request.user.role != 'HOD':
            return Response({'error': 'Only HOD can access this'}, status=403)
        
        leaves = LeaveRequest.objects.filter(user=request.user).order_by('-created_at')
        serializer = LeaveRequestSerializer(leaves, many=True)
        return Response(serializer.data)
        
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a leave request"""
        if request.user.role != 'HOD':
            return Response({'error': 'Only HOD can approve leaves'}, status=status.HTTP_403_FORBIDDEN)
        
        leave = self.get_object()
        
        # Check if the leave belongs to staff in HOD's department
        if leave.user.department != request.user.department:
            return Response({'error': 'You can only approve leaves of your department staff'}, 
                           status=status.HTTP_403_FORBIDDEN)
        
        leave.hod_approval = True
        leave.hod_approval_date = timezone.now()
        
        leave.status = 'PENDING_PRINCIPAL'
        
        leave.save()
        
        # Record HOD action
        HODAction.objects.create(
            hod=request.user,
            leave=leave,
            action_type='APPROVE',
            comment=request.data.get('comment', '')
        )
        
        return Response({'status': 'Leave approved by HOD'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a leave request"""
        if request.user.role != 'HOD':
            return Response({'error': 'Only HOD can reject leaves'}, status=status.HTTP_403_FORBIDDEN)
        
        leave = self.get_object()
        
        # Check if the leave belongs to staff in HOD's department
        if leave.user.department != request.user.department:
            return Response({'error': 'You can only reject leaves of your department staff'}, 
                           status=status.HTTP_403_FORBIDDEN)
        
        leave.status = 'REJECTED'
        leave.save()
        
        # Record HOD action
        HODAction.objects.create(
            hod=request.user,
            leave=leave,
            action_type='REJECT',
            comment=request.data.get('comment', '')
        )
        
        return Response({'status': 'Leave rejected by HOD'})
    
    @action(detail=False, methods=['get'])
    def department_stats(self, request):
        """Get leave statistics for the department"""
        if request.user.role != 'HOD':
            return Response({'error': 'Only HOD can view department stats'}, status=status.HTTP_403_FORBIDDEN)
        
        staff_in_dept = User.objects.filter(department=request.user.department, role='STAFF')
        leaves = LeaveRequest.objects.filter(user__in=staff_in_dept)
        
        total_leaves = leaves.count()
        approved_leaves = leaves.filter(status='APPROVED').count()
        pending_leaves = leaves.filter(status='PENDING').count()
        rejected_leaves = leaves.filter(status='REJECTED').count()
        
        # Staff count by department
        staff_count = staff_in_dept.count()
        
        return Response({
            'total_leaves': total_leaves,
            'approved_leaves': approved_leaves,
            'pending_leaves': pending_leaves,
            'rejected_leaves': rejected_leaves,
            'staff_count': staff_count
        })
    
    @action(detail=False, methods=['get'])
    def department_calendar(self, request):
        """Get leave events for calendar view for the department"""
        if request.user.role != 'HOD':
            return Response({'error': 'Only HOD can view department calendar'}, status=status.HTTP_403_FORBIDDEN)
        
        staff_in_dept = User.objects.filter(department=request.user.department, role='STAFF')
        hod = request.user
        
        # Combine staff and HOD for filtering leaves
        users_in_dept = list(staff_in_dept) + [hod]
        leaves = LeaveRequest.objects.filter(user__in=users_in_dept)
        
        events = []
        for leave in leaves:
            events.append({
                'id': leave.id,
                'title': f"{leave.user.username} - {leave.get_leave_type_display()}",
                'start': leave.start_date.isoformat(),
                'end': leave.end_date.isoformat(),
                'type': leave.leave_type,
                'status': leave.status,
                'reason': leave.reason,
                'staff_name': leave.user.username,
                'backgroundColor': self.get_event_color(leave.status),
                'textColor': '#ffffff'
            })
        
        return Response(events)
    
    def get_event_color(self, status):
        color_map = {
            'APPROVED': '#10B981',  # Green
            'PENDING': '#F59E0B',   # Amber
            'REJECTED': '#EF4444',  # Red
            'CANCELLED': '#6B7280', # Gray
        }
        return color_map.get(status, '#6B7280')
    
    @action(detail=False, methods=['get'])
    def staff_list(self, request):
        """Get list of all staff in HOD's department"""
        if request.user.role != 'HOD':
            return Response({'error': 'Only HOD can view staff list'}, status=status.HTTP_403_FORBIDDEN)
        
        staff_in_dept = User.objects.filter(department=request.user.department, role='STAFF')
        
        staff_data = []
        for staff in staff_in_dept:
            # Get leave balance for each staff
            balance, created = LeaveBalance.objects.get_or_create(user=staff)
            
            staff_data.append({
                'id': staff.id,
                'username': staff.username,
                'email': staff.email,
                    'leave_balance': {
                        'earned_leave': balance.earned_leave,
                        'casual_leave': balance.casual_leave,
                        'medical_leave': balance.medical_leave,
                        'night_work_credits': balance.night_work_credits,
                        'compensatory_leave': balance.compensatory_leave,
                    }
                })
        
        return Response(staff_data)

class HODActionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = HODActionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'HOD':
            return HODAction.objects.filter(hod=self.request.user).order_by('-created_at')
        return HODAction.objects.none()
