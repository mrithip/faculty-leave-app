from rest_framework import serializers
from .models import Substitution

class SubstitutionSerializer(serializers.ModelSerializer):
    requested_by_username = serializers.ReadOnlyField(source='requested_by.username')
    requested_to_username = serializers.ReadOnlyField(source='requested_to.username')

    class Meta:
        model = Substitution
        fields = [
            'id', 'requested_by', 'requested_to', 'date', 'period', 'time', 'class_label',
            'status', 'message', 'created_at', 'updated_at',
            'requested_by_username', 'requested_to_username'
        ]
        read_only_fields = ['status', 'created_at', 'updated_at']

class SubstitutionCreateSerializer(serializers.ModelSerializer):
    requested_by_username = serializers.ReadOnlyField(source='requested_by.username')
    requested_to_username = serializers.ReadOnlyField(source='requested_to.username')

    class Meta:
        model = Substitution
        fields = ['id', 'requested_by', 'requested_to', 'date', 'period', 'time', 'class_label',
                 'status', 'message', 'created_at', 'updated_at',
                 'requested_by_username', 'requested_to_username']
        read_only_fields = ['id', 'requested_by', 'status', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['requested_by'] = self.context['request'].user
        return super().create(validated_data)
