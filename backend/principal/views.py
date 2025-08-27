from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Q
from leave.models import LeaveRequest, LeaveBalance
from leave.serializers import LeaveRequestSerializer, LeaveBalanceSerializer
from .serializers import PrincipalLeaveSerializer, UserStatsSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class PrincipalLeaveViewSet(viewsets.ModelViewSet):
    serializer_class = PrincipalLeaveSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Principal can see all leaves from all users
        if self.request.user.role == 'PRINCIPAL':
            return LeaveRequest.objects.all().order_by('-created_at')
        return LeaveRequest.objects.none()
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a leave request (both staff and HOD)"""
        if request.user.role != 'PRINCIPAL':
            return Response({'error': 'Only Principal can approve leaves'}, status=status.HTTP_403_FORBIDDEN)
        
        leave = self.get_object()
        
        # For staff leaves, check if HOD has approved first
        if leave.user.role == 'STAFF' and not leave.hod_approval:
            return Response({'error': 'HOD approval required before principal approval'}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        leave.principal_approval = True
        leave.principal_approval_date = timezone.now()
        leave.status = 'APPROVED'
        
        # Deduct from leave balance for approved leaves
        if leave.leave_type in ['EARNED', 'CASUAL', 'MEDICAL']:
            balance, created = LeaveBalance.objects.get_or_create(user=leave.user)
            if leave.leave_type == 'EARNED':
                balance.earned_leave -= 1
            elif leave.leave_type == 'CASUAL':
                balance.casual_leave -= 1
            elif leave.leave_type == 'MEDICAL':
                balance.medical_leave -= 1
            balance.save()
        
        leave.save()
        return Response({'status': 'Leave approved by Principal'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a leave request"""
        if request.user.role != 'PRINCIPAL':
            return Response({'error': 'Only Principal can reject leaves'}, status=status.HTTP_403_FORBIDDEN)
        
        leave = self.get_object()
        leave.status = 'REJECTED'
        leave.save()
        
        return Response({'status': 'Leave rejected by Principal'})
    
    @action(detail=False, methods=['get'])
    def overview_stats(self, request):
        """Get comprehensive statistics for the entire institution"""
        if request.user.role != 'PRINCIPAL':
            return Response({'error': 'Only Principal can view overview stats'}, status=status.HTTP_403_FORBIDDEN)
        
        # Total statistics
        total_leaves = LeaveRequest.objects.count()
        approved_leaves = LeaveRequest.objects.filter(status='APPROVED').count()
        pending_leaves = LeaveRequest.objects.filter(status='PENDING').count()
        rejected_leaves = LeaveRequest.objects.filter(status='REJECTED').count()
        
        # Department-wise statistics
        department_stats = LeaveRequest.objects.values('user__department').annotate(
            total=Count('id'),
            approved=Count('id', filter=Q(status='APPROVED')),
            pending=Count('id', filter=Q(status='PENDING')),
            rejected=Count('id', filter=Q(status='REJECTED'))
        )
        
        # Role-wise statistics
        role_stats = LeaveRequest.objects.values('user__role').annotate(
            total=Count('id'),
            approved=Count('id', filter=Q(status='APPROVED')),
            pending=Count('id', filter=Q(status='PENDING')),
            rejected=Count('id', filter=Q(status='REJECTED'))
        )
        
        # Recent activity
        recent_approvals = LeaveRequest.objects.filter(
            principal_approval_date__isnull=False
        ).order_by('-principal_approval_date')[:10]
        
        return Response({
            'total_stats': {
                'total_leaves': total_leaves,
                'approved_leaves': approved_leaves,
                'pending_leaves': pending_leaves,
                'rejected_leaves': rejected_leaves,
                'approval_rate': (approved_leaves / total_leaves * 100) if total_leaves > 0 else 0
            },
            'department_stats': list(department_stats),
            'role_stats': list(role_stats),
            'recent_activity': PrincipalLeaveSerializer(recent_approvals, many=True).data
        })
    
    @action(detail=False, methods=['get'])
    def user_stats(self, request):
        """Get leave statistics for all users"""
        if request.user.role != 'PRINCIPAL':
            return Response({'error': 'Only Principal can view user stats'}, status=status.HTTP_403_FORBIDDEN)
        
        users = User.objects.all()
        user_stats = []
        
        for user in users:
            leaves = LeaveRequest.objects.filter(user=user)
            user_stats.append({
                'user_id': user.id,
                'username': user.username,
                'department': user.department,
                'role': user.role,
                'total_leaves': leaves.count(),
                'approved_leaves': leaves.filter(status='APPROVED').count(),
                'pending_leaves': leaves.filter(status='PENDING').count(),
                'rejected_leaves': leaves.filter(status='REJECTED').count()
            })
        
        return Response(user_stats)
    
    @action(detail=False, methods=['get'])
    def pending_approvals(self, request):
        """Get all leaves pending principal approval"""
        if request.user.role != 'PRINCIPAL':
            return Response({'error': 'Only Principal can view pending approvals'}, status=status.HTTP_403_FORBIDDEN)
        
        # For staff: need HOD approval first, for HOD: directly to principal
        pending_leaves = LeaveRequest.objects.filter(
            Q(status='PENDING_PRINCIPAL') |
            (Q(status='PENDING') & Q(user__role='HOD'))
        ).order_by('-created_at')
        
        serializer = self.get_serializer(pending_leaves, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def department_summary(self, request):
        """Get department-wise summary"""
        if request.user.role != 'PRINCIPAL':
            return Response({'error': 'Only Principal can view department summary'}, status=status.HTTP_403_FORBIDDEN)
        
        departments = User.objects.values_list('department', flat=True).distinct()
        department_summary = []
        
        for dept in departments:
            if dept:  # Skip empty departments
                staff_count = User.objects.filter(department=dept, role='STAFF').count()
                hod_count = User.objects.filter(department=dept, role='HOD').count()
                leaves = LeaveRequest.objects.filter(user__department=dept)
                
                department_summary.append({
                    'department': dept,
                    'staff_count': staff_count,
                    'hod_count': hod_count,
                    'total_leaves': leaves.count(),
                    'approved_leaves': leaves.filter(status='APPROVED').count(),
                    'pending_leaves': leaves.filter(status='PENDING').count(),
                    'rejected_leaves': leaves.filter(status='REJECTED').count()
                })
        
        return Response(department_summary)
