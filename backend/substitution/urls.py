from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SubstitutionViewSet

router = DefaultRouter()
router.register(r'substitution', SubstitutionViewSet, basename='substitution')

urlpatterns = [
    path('', include(router.urls)),
]
