from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HODLeaveViewSet, HODActionViewSet

router = DefaultRouter()
router.register(r'leaves', HODLeaveViewSet, basename='hod-leave')
router.register(r'actions', HODActionViewSet, basename='hod-action')

urlpatterns = [
    path('', include(router.urls)),
]