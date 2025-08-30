from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import LeaveRequest, LeaveBalance, NightWorkRecord, CompensatoryWork
from .serializers import (
    LeaveRequestSerializer, LeaveBalanceSerializer,
    NightWorkRecordSerializer, CompensatoryWorkSerializer
)
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class LeaveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'STAFF':
            return LeaveRequest.objects.filter(user=user)
        elif user.role == 'HOD':
            # Get leaves from staff in same department
            staff_in_dept = User.objects.filter(department=user.department, role='STAFF')
            return LeaveRequest.objects.filter(user__in=staff_in_dept)
        elif user.role == 'PRINCIPAL':
            return LeaveRequest.objects.all()
        return LeaveRequest.objects.none()
    
    def perform_create(self, serializer):
        if self.request.user.role == 'HOD':
            serializer.save(user=self.request.user, status='PENDING_PRINCIPAL')
        else:
            serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def approve_hod(self, request, pk=None):
        if request.user.role != 'HOD':
            return Response({'error': 'Only HOD can approve'}, status=403)
        
        leave = self.get_object()
        if leave.user.department != request.user.department:
            return Response({'error': 'Not in your department'}, status=403)
        
        leave.hod_approval = True
        leave.hod_approval_date = timezone.now()
        
        if leave.leave_type in ['EARNED', 'CASUAL', 'MEDICAL']:
            # Check leave balance
            balance, created = LeaveBalance.objects.get_or_create(user=leave.user)
            if leave.leave_type == 'EARNED' and balance.earned_leave <= 0:
                return Response({'error': 'Insufficient earned leave balance'}, status=400)
            elif leave.leave_type == 'CASUAL' and balance.casual_leave <= 0:
                return Response({'error': 'Insufficient casual leave balance'}, status=400)
            elif leave.leave_type == 'MEDICAL' and balance.medical_leave <= 0:
                return Response({'error': 'Insufficient medical leave balance'}, status=400)
        
        leave.save()
        return Response({'status': 'HOD approved'})
    
    @action(detail=True, methods=['post'])
    def approve_principal(self, request, pk=None):
        if request.user.role != 'PRINCIPAL':
            return Response({'error': 'Only Principal can approve'}, status=403)
        
        leave = self.get_object()
        leave.principal_approval = True
        leave.principal_approval_date = timezone.now()
        leave.status = 'APPROVED'
        
        # Deduct from leave balance
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
        return Response({'status': 'Principal approved'})
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = 'REJECTED'
        leave.save()
        return Response({'status': 'Leave rejected'})

class LeaveBalanceViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = LeaveBalanceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'STAFF':
            return LeaveBalance.objects.filter(user=self.request.user)
        elif self.request.user.role == 'HOD':
            staff_in_dept = User.objects.filter(department=self.request.user.department, role='STAFF')
            return LeaveBalance.objects.filter(user__in=staff_in_dept)
        elif self.request.user.role == 'PRINCIPAL':
            queryset = LeaveBalance.objects.all()
            logger.info(f"LeaveBalanceViewSet: Principal fetching all balances. Count: {queryset.count()}")
            for balance in queryset:
                logger.info(f"Balance for user {balance.user.username}: Role={balance.user.role}, Dept={balance.user.department}")
            return queryset
        return LeaveBalance.objects.none()

class NightWorkRecordViewSet(viewsets.ModelViewSet):
    serializer_class = NightWorkRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'STAFF':
            return NightWorkRecord.objects.filter(user=self.request.user)
        return NightWorkRecord.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CompensatoryWorkViewSet(viewsets.ModelViewSet):
    serializer_class = CompensatoryWorkSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'STAFF':
            return CompensatoryWork.objects.filter(user=self.request.user)
        return CompensatoryWork.objects.none()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
