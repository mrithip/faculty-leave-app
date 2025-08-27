from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrincipalLeaveViewSet

router = DefaultRouter()
router.register(r'leaves', PrincipalLeaveViewSet, basename='principal-leave')

urlpatterns = [
    path('', include(router.urls)),
]