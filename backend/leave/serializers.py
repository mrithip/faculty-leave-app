from rest_framework import serializers
from .models import LeaveRequest, LeaveBalance, NightWorkRecord, CompensatoryWork
from django.contrib.auth import get_user_model

User = get_user_model()

class LeaveRequestSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_department = serializers.CharField(source='user.department', read_only=True)
    user_role = serializers.CharField(source='user.role', read_only=True)
    duration = serializers.CharField(read_only=True)
    
    class Meta:
        model = LeaveRequest
        fields = '__all__'
        read_only_fields = ('user', 'status', 'hod_approval', 'principal_approval', 
                          'hod_approval_date', 'principal_approval_date', 'created_at', 'updated_at')

class LeaveBalanceSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = LeaveBalance
        fields = '__all__'
        read_only_fields = ('user', 'last_updated')

class NightWorkRecordSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = NightWorkRecord
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

class CompensatoryWorkSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = CompensatoryWork
        fields = '__all__'
        read_only_fields = ('user', 'created_at')