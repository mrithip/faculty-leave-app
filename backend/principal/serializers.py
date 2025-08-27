from rest_framework import serializers
from leave.models import LeaveRequest, LeaveBalance
from leave.serializers import LeaveRequestSerializer, LeaveBalanceSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class PrincipalLeaveSerializer(LeaveRequestSerializer):
    staff_name = serializers.CharField(source='user.username', read_only=True)
    staff_department = serializers.CharField(source='user.department', read_only=True)
    staff_email = serializers.CharField(source='user.email', read_only=True)
    staff_role = serializers.CharField(source='user.role', read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = '__all__'
        read_only_fields = ('user', 'status', 'hod_approval', 'principal_approval', 
                          'hod_approval_date', 'principal_approval_date', 'created_at', 'updated_at')

class UserStatsSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    username = serializers.CharField()
    department = serializers.CharField()
    role = serializers.CharField()
    total_leaves = serializers.IntegerField()
    approved_leaves = serializers.IntegerField()
    pending_leaves = serializers.IntegerField()
    rejected_leaves = serializers.IntegerField()