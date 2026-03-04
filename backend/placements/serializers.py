from rest_framework import serializers
from .models import PlacementRequest
from users.serializers import CandidateProfileSerializer

class PlacementRequestSerializer(serializers.ModelSerializer):
    matches_detail = CandidateProfileSerializer(source='matches', many=True, read_only=True)
    
    class Meta:
        model = PlacementRequest
        fields = '__all__'
        read_only_fields = ('company', 'progress', 'status', 'matches')
