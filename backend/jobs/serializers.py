from rest_framework import serializers
from .models import JobOffer, Application
from users.serializers import CompanyProfileMiniSerializer, CandidateProfileMiniSerializer

class JobOfferSerializer(serializers.ModelSerializer):
    company_detail = CompanyProfileMiniSerializer(source='company', read_only=True)
    
    applications_count = serializers.IntegerField(source='applications.count', read_only=True)

    class Meta:
        model = JobOffer
        fields = '__all__'
        read_only_fields = ('slug', 'company', 'views_count')

class ApplicationSerializer(serializers.ModelSerializer):
    candidate_detail = CandidateProfileMiniSerializer(source='candidate', read_only=True)
    job_offer_detail = JobOfferSerializer(source='job_offer', read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('candidate', 'matching_score', 'ai_feedback')
