from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from leave.models import LeaveRequest, LeaveBalance
from leave.serializers import LeaveRequestSerializer, LeaveBalanceSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class StaffLeaveViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Staff can only see their own leave requests
        return LeaveRequest.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        # Validate that substitution is provided and belongs to the user
        substitution_id = serializer.validated_data.get('substitution')
        if substitution_id:
            substitution = substitution_id
            # Verify the substitution belongs to this user
            if substitution.requested_by != self.request.user:
                raise serializers.ValidationError("You can only use your own substitution requests.")
            if substitution.status != 'ACCEPTED':
                raise serializers.ValidationError("You can only create leave requests with accepted substitutions.")
        else:
            raise serializers.ValidationError("Substitution is required to create a leave request.")

        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def balance(self, request):
        """Get staff's leave balance"""
        try:
            balance, created = LeaveBalance.objects.get_or_create(user=request.user)
            serializer = LeaveBalanceSerializer(balance)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get leave statistics for staff"""
        try:
            user = request.user
            leaves = LeaveRequest.objects.filter(user=user)
            balance, created = LeaveBalance.objects.get_or_create(user=user)
            
            total_leaves = leaves.count()
            approved_leaves = leaves.filter(status='APPROVED').count()
            pending_leaves = leaves.filter(status='PENDING').count()
            rejected_leaves = leaves.filter(status='REJECTED').count()
            
            # Calculate extra leaves taken (beyond balance)
            extra_leaves = {
                'earned': max(0, leaves.filter(leave_type='EARNED', status='APPROVED').count() - (balance.earned_leave or 0)),
                'casual': max(0, leaves.filter(leave_type='CASUAL', status='APPROVED').count() - (balance.casual_leave or 0)),
                'medical': max(0, leaves.filter(leave_type='MEDICAL', status='APPROVED').count() - (balance.medical_leave or 0)),
            }
            
            return Response({
                'total_leaves': total_leaves,
                'approved_leaves': approved_leaves,
                'pending_leaves': pending_leaves,
                'rejected_leaves': rejected_leaves,
                'extra_leaves': extra_leaves,
                'balance': LeaveBalanceSerializer(balance).data
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def calendar_events(self, request):
        """Get leave events for calendar view"""
        try:
            leaves = self.get_queryset()
            
            events = []
            for leave in leaves:
                events.append({
                    'id': leave.id,
                    'title': f"{leave.get_leave_type_display()} - {leave.get_status_display()}",
                    'start': leave.start_date.isoformat(),
                    'end': leave.end_date.isoformat(),
                    'type': leave.leave_type,
                    'status': leave.status,
                    'reason': leave.reason,
                    'backgroundColor': self.get_event_color(leave.status),
                    'textColor': '#ffffff'
                })
            
            return Response(events)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_event_color(self, status):
        color_map = {
            'APPROVED': '#10B981',  # Green
            'PENDING': '#F59E0B',   # Amber
            'REJECTED': '#EF4444',  # Red
            'CANCELLED': '#6B7280', # Gray
        }
        return color_map.get(status, '#6B7280')
