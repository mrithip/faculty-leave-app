from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeaveRequestViewSet, LeaveBalanceViewSet, NightWorkRecordViewSet, CompensatoryWorkViewSet

router = DefaultRouter()
router.register(r'requests', LeaveRequestViewSet, basename='leaverequest')
router.register(r'balance', LeaveBalanceViewSet, basename='leavebalance')
router.register(r'night-works', NightWorkRecordViewSet, basename='nightwork')
router.register(r'compensatory-works', CompensatoryWorkViewSet, basename='compensatorywork')

urlpatterns = [
    path('', include(router.urls)),
]