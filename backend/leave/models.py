from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta, date

User = get_user_model()

class LeaveRequest(models.Model):
    LEAVE_TYPES = (
        ('EARNED', 'Earned Leave'),
        ('CASUAL', 'Casual Leave'),
        ('MEDICAL', 'Medical Leave'),
        ('COMPENSATORY', 'Compensatory Leave'),
        ('MATERNITY', 'Maternity Leave'),
        ('PATERNITY', 'Paternity Leave'),
        ('ONDUTY', 'On Duty Leave'),
        ('CUSTOM', 'Custom Leave (1 Hour)'),
    )
    
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PENDING_PRINCIPAL', 'Pending Principal Approval'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('CANCELLED', 'Cancelled'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="leave_requests")
    leave_type = models.CharField(max_length=20, choices=LEAVE_TYPES)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    is_hourly = models.BooleanField(default=False)
    hours = models.PositiveIntegerField(default=0)  # For hourly leaves
    
    # Approval tracking
    hod_approval = models.BooleanField(default=False)
    principal_approval = models.BooleanField(default=False)
    hod_approval_date = models.DateTimeField(null=True, blank=True)
    principal_approval_date = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def clean(self):
        """Validate leave rules"""
        if self.start_date > self.end_date:
            raise ValidationError("End date cannot be before start date")
        
        # Gender-specific leave validation
        if self.leave_type == 'MATERNITY' and self.user.gender != 'F':
            raise ValidationError("Maternity leave is only for female staff")
        
        if self.leave_type == 'PATERNITY' and self.user.gender != 'M':
            raise ValidationError("Paternity leave is only for male staff")
        
        # Custom leave validation (1 hour, twice per month)
        if self.leave_type == 'CUSTOM':
            if not self.is_hourly or self.hours != 1:
                raise ValidationError("Custom leave must be exactly 1 hour")
            
            # Check if already took 2 custom leaves this month
            current_month = timezone.now().month
            current_year = timezone.now().year
            custom_leaves_this_month = LeaveRequest.objects.filter(
                user=self.user,
                leave_type='CUSTOM',
                start_date__month=current_month,
                start_date__year=current_year,
                status__in=['APPROVED', 'PENDING']
            ).count()
            
            if custom_leaves_this_month >= 2:
                raise ValidationError("Only 2 custom leaves allowed per month")
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.user.username} - {self.leave_type} - {self.status}"
    
    @property
    def duration(self):
        if self.is_hourly:
            return f"{self.hours} hour(s)"
        delta = self.end_date - self.start_date
        return f"{delta.days + 1} day(s)"  # Inclusive of both start and end dates

class LeaveBalance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="leave_balance")
    earned_leave = models.PositiveIntegerField(default=0)  # 2 days per month
    casual_leave = models.PositiveIntegerField(default=12)  # Example: 12 days per year
    medical_leave = models.PositiveIntegerField(default=12)  # Example: 12 days per year
    night_work_credits = models.PositiveIntegerField(default=0)  # Count of approved night work records (3 records = 1 earned leave)
    compensatory_leave = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - Leave Balance"
    
    def update_earned_leave(self):
        """Auto-update earned leave (2 days per month)"""
        today = timezone.now().date()
        months_worked = (today.year - self.user.date_joined.year) * 12 + today.month - self.user.date_joined.month
        self.earned_leave = months_worked * 2
        self.save()

    @classmethod
    def recalculate_night_work_balance(cls, user):
        """
        Recalculates night_work_credits and earned_leave for a specific user
        based on all approved NightWorkRecords.
        """
        balance, created = cls.objects.get_or_create(user=user)

        old_earned_leaves_from_night_work = balance.night_work_credits // 3

        # Count all approved NightWorkRecord instances for the user
        approved_night_works_count = NightWorkRecord.objects.filter(
            user=user, approved=True
        ).count()
        balance.night_work_credits = approved_night_works_count

        new_earned_leaves_from_night_work = balance.night_work_credits // 3

        balance.earned_leave += (new_earned_leaves_from_night_work - old_earned_leaves_from_night_work)
        balance.earned_leave = max(0, balance.earned_leave) # Ensure earned_leave doesn't go below zero
        balance.save()

class NightWorkRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="night_works")
    date = models.DateField()
    hours = models.PositiveIntegerField()
    reason = models.TextField()
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs) # Save the instance first

        # Always trigger recalculation after a NightWorkRecord is saved
        LeaveBalance.recalculate_night_work_balance(user=self.user)

    def __str__(self):
        return f"{self.user.username} - Night Work - {self.date}"

class CompensatoryWork(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="compensatory_works")
    date = models.DateField()
    hours = models.PositiveIntegerField()
    reason = models.TextField()
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.approved:
            # Grant compensatory leave
            balance, created = LeaveBalance.objects.get_or_create(user=self.user)
            balance.compensatory_leave += self.hours // 8  # 8 hours = 1 day
            balance.save()
    
    def __str__(self):
        return f"{self.user.username} - Compensatory Work - {self.date}"
