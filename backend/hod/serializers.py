from rest_framework import serializers
from leave.models import LeaveRequest, LeaveBalance
from leave.serializers import LeaveRequestSerializer, LeaveBalanceSerializer
from django.contrib.auth import get_user_model
from .models import HODAction

User = get_user_model()

class HODActionSerializer(serializers.ModelSerializer):
    hod_name = serializers.CharField(source='hod.username', read_only=True)
    leave_details = LeaveRequestSerializer(source='leave', read_only=True)
    
    class Meta:
        model = HODAction
        fields = '__all__'

class StaffLeaveSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='user.username', read_only=True)
    staff_department = serializers.CharField(source='user.department', read_only=True)
    staff_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = '__all__'
        read_only_fields = ('user', 'status', 'hod_approval', 'principal_approval', 
                          'hod_approval_date', 'principal_approval_date', 'created_at', 'updated_at')