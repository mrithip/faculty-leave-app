from django.db import models
from django.contrib.auth import get_user_model
from leave.models import LeaveRequest

User = get_user_model()

class HODAction(models.Model):
    ACTION_TYPES = (
        ('APPROVE', 'Approve Leave'),
        ('REJECT', 'Reject Leave'),
        ('COMMENT', 'Add Comment'),
    )
    
    hod = models.ForeignKey(User, on_delete=models.CASCADE, related_name="actions")
    leave = models.ForeignKey(LeaveRequest, on_delete=models.CASCADE, related_name="hod_actions")
    action_type = models.CharField(max_length=10, choices=ACTION_TYPES)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.hod.username} - {self.action_type} - {self.leave.id}"