from django.contrib import admin
from .models import Substitution

@admin.register(Substitution)
class SubstitutionAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'requested_by', 'requested_to', 'date', 'period', 'time',
        'class_label', 'status', 'created_at'
    ]
    list_filter = ['status', 'date', 'period', 'created_at']
    search_fields = [
        'requested_by__username', 'requested_to__username',
        'class_label', 'message'
    ]
    ordering = ['-created_at']

    fieldsets = (
        ('Request Details', {
            'fields': ('requested_by', 'requested_to', 'date', 'period', 'time', 'class_label')
        }),
        ('Status & Response', {
            'fields': ('status', 'message')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']
