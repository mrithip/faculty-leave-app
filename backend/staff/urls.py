from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffLeaveViewSet

router = DefaultRouter()
router.register(r'leaves', StaffLeaveViewSet, basename='staff-leave')

urlpatterns = [
    path('', include(router.urls)),
]