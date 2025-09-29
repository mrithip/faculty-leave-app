from django.contrib import admin
from .models import LeaveRequest, LeaveBalance, NightWorkRecord, CompensatoryWork

@admin.register(LeaveRequest)
class LeaveRequestAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'leave_type', 'start_date', 'end_date', 'status',
        'hod_approval', 'principal_approval', 'get_substitute_username'
    ]
    list_filter = [
        'leave_type', 'status', 'hod_approval', 'principal_approval',
        'start_date', 'end_date'
    ]
    search_fields = ['user__username', 'reason', 'substitution__requested_to__username']

    def get_substitute_username(self, obj):
        if obj.substitution and obj.substitution.status == 'ACCEPTED':
            return obj.substitution.requested_to.username
        return 'None'
    get_substitute_username.short_description = 'Substitute'
    get_substitute_username.admin_order_field = 'substitution__requested_to__username'

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
