from rest_framework import viewsets, serializers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.contrib import messages # For notifications
from django.db.models import Q
from .models import Substitution
from .serializers import SubstitutionSerializer, SubstitutionCreateSerializer
from leave.models import LeaveRequest

User = get_user_model()

class SubstitutionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SubstitutionSerializer

    def get_queryset(self):
        user = self.request.user
        # Staff can see their sent and received requests
        return Substitution.objects.filter(
            Q(requested_by=user) | Q(requested_to=user)
        ).order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return SubstitutionCreateSerializer
        return SubstitutionSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        # TODO: Add notification system (e.g., email or custom notification model)
        # messages.info(
        #     instance.requested_to,
        #     f"You have a new substitution request from {instance.requested_by.username} for {instance.date}."
        # )

    @action(detail=False, methods=['get'])
    def search_users(self, request):
        """Search users by username or email for substitution requests (within same department)"""
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'error': 'Query parameter required'}, status=400)

        # Only search within the requesting user's department and for STAFF role
        users = User.objects.filter(
            Q(username__icontains=query) | Q(email__icontains=query),
            department=request.user.department,
            role='STAFF'
        ).exclude(pk=request.user.pk)[:10]  # Exclude self

        data = [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'department': user.department,
        } for user in users]

        return Response(data)

    @action(detail=False, methods=['get'])
    def received_requests(self, request):
        """Get pending requests received by the user"""
        requests = Substitution.objects.filter(
            requested_to=request.user,
            status=Substitution.PENDING
        ).order_by('-created_at')
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def sent_requests(self, request):
        """Get requests sent by the user"""
        requests = Substitution.objects.filter(
            requested_by=request.user
        ).order_by('-created_at')
        serializer = self.get_serializer(requests, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Accept a substitution request"""
        instance = self.get_object()
        if instance.requested_to != request.user:
            return Response({'error': 'Not authorized'}, status=403)
        if instance.status != Substitution.PENDING:
            return Response({'error': 'Request is not pending'}, status=400)

        instance.status = Substitution.ACCEPTED
        instance.save()

        # TODO: Notify the requester (implement notification system)
        # messages.info(
        #     instance.requested_by,
        #     f"Your substitution request to {instance.requested_to.username} has been accepted."
        # )

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a substitution request"""
        instance = self.get_object()
        if instance.requested_to != request.user:
            return Response({'error': 'Not authorized'}, status=403)
        if instance.status != Substitution.PENDING:
            return Response({'error': 'Request is not pending'}, status=400)

        instance.status = Substitution.REJECTED
        instance.save()

        # TODO: Notify the requester (implement notification system)
        # messages.info(
        #     instance.requested_by,
        #     f"Your substitution request to {instance.requested_to.username} has been rejected."
        # )

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def has_accepted_substitution(self, request):
        """Check if user has any accepted substitution for today"""
        user = request.user
        date = request.query_params.get('date')
        period = request.query_params.get('period')

        if not date:
            return Response({'error': 'Date required'}, status=400)

        has_accepted = Substitution.objects.filter(
            requested_by=user,
            date=date,
            period=period or '',  # Empty string if period not provided
            status=Substitution.ACCEPTED
        ).exists()

        return Response({'has_accepted_substitution': has_accepted})
