from django.urls import path
from . import views

urlpatterns = [
    path('generate-pdf/<int:leave_id>/', views.generate_leave_pdf, name='generate_leave_pdf'),
]
