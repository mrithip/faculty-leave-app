from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import NightWorkRecord, LeaveBalance

@receiver(post_delete, sender=NightWorkRecord)
def recalculate_leave_balance_on_night_work_delete(sender, instance, **kwargs):
    """
    Recalculates the LeaveBalance for a user when a NightWorkRecord is deleted.
    """
    # Always recalculate for the user, regardless of the deleted record's approved status
    # as the recalculation method will count all currently approved records.
    try:
        LeaveBalance.recalculate_night_work_balance(user=instance.user)
    except LeaveBalance.DoesNotExist:
        pass # No leave balance for this user, nothing to update
