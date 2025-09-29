from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Substitution(models.Model):
    PENDING = 'PENDING'
    ACCEPTED = 'ACCEPTED'
    REJECTED = 'REJECTED'

    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
    ]

    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_substitution_requests')
    requested_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_substitution_requests')
    date = models.DateField()
    period = models.CharField(max_length=50, help_text="Period/Session (e.g., Morning, Afternoon, Slot 1)")
    time = models.TimeField(help_text="Time of the session")
    class_label = models.CharField(max_length=100, help_text="Class/Subject/Period name (e.g., CS101, Database Lecture)", blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=PENDING)
    message = models.TextField(blank=True, null=True, help_text="Optional message from requester")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.requested_by.username} -> {self.requested_to.username} on {self.date} ({self.get_status_display()})"
