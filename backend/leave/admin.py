from django.contrib import admin
from .models import LeaveRequest, LeaveBalance, NightWorkRecord, CompensatoryWork

@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = ['user', 'leave_type', 'start_date', 'end_date', 'status', 'hod_approval', 'principal_approval']
    list_filter = ['leave_type', 'status', 'hod_approval', 'principal_approval']
    search_fields = ['user__username', 'reason']

@admin.register(LeaveBalance)
class LeaveBalanceAdmin(admin.ModelAdmin):
    list_display = ['user', 'earned_leave', 'casual_leave', 'medical_leave', 'night_work_credits', 'compensatory_leave']
    search_fields = ['user__username']

@admin.register(NightWorkRecord)
class NightWorkRecordAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'hours', 'approved']
    list_filter = ['approved', 'date']

@admin.register(CompensatoryWork)
class CompensatoryWorkAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'hours', 'approved']
    list_filter = ['approved', 'date']
