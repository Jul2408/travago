from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CandidateProfile, CompanyProfile, CandidateDocument, SystemSettings, Transaction

User = get_user_model()

class CandidateDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateDocument
        fields = '__all__'
        read_only_fields = ('candidate', 'status')

class UserMicroSerializer(serializers.ModelSerializer):
    """Deepest level user serializer to break all recursions"""
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'photo')

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'photo')

class CandidateProfileMiniSerializer(serializers.ModelSerializer):
    """Simplified profile for nested relations to avoid recursion"""
    user_detail = UserMicroSerializer(source='user', read_only=True)
    
    class Meta:
        model = CandidateProfile
        fields = ('id', 'title', 'location', 'is_verified', 'placability_score', 'reliability_score', 'user_detail', 'photo')

class CompanyProfileMiniSerializer(serializers.ModelSerializer):
    """Simplified profile for nested relations to avoid recursion"""
    class Meta:
        model = CompanyProfile
        fields = ('id', 'name', 'sector', 'city', 'is_verified', 'logo')

class CandidateProfileSerializer(serializers.ModelSerializer):
    documents = CandidateDocumentSerializer(many=True, read_only=True)
    user_detail = serializers.SerializerMethodField()
    applications = serializers.SerializerMethodField()
    is_unlocked = serializers.SerializerMethodField()
    
    class Meta:
        model = CandidateProfile
        fields = '__all__'
        read_only_fields = ('user', 'placability_score', 'reliability_score', 'is_verified')

    def get_is_unlocked(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        if request.user.role == 'ADMIN':
            return True
        if request.user.role == 'COMPANY':
            return request.user.company_profile.unlocked_candidates.filter(id=obj.id).exists()
        if request.user == obj.user:
            return True
        return False

    def get_user_detail(self, obj):
        is_unlocked = self.get_is_unlocked(obj)
        data = UserMiniSerializer(obj.user).data
        if not is_unlocked:
            # Hide sensitive details if not unlocked
            data['email'] = "••••@••••.•••"
            data['first_name'] = data['first_name'][0] + "..." if data['first_name'] else ""
            data['last_name'] = "Candidat Travago"
        return data

    def get_applications(self, obj):
        from jobs.serializers import ApplicationSerializer
        apps = obj.applications.all()
        return ApplicationSerializer(apps, many=True).data

class CompanyProfileSerializer(serializers.ModelSerializer):
    user_detail = UserMiniSerializer(source='user', read_only=True)
    job_offers = serializers.SerializerMethodField()

    class Meta:
        model = CompanyProfile
        fields = '__all__'
        read_only_fields = ('user', 'is_verified')

    def get_job_offers(self, obj):
        from jobs.serializers import JobOfferSerializer
        offers = obj.job_offers.all()
        return JobOfferSerializer(offers, many=True).data

class UserSerializer(serializers.ModelSerializer):
    candidate_profile = CandidateProfileSerializer(read_only=True)
    company_profile = CompanyProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'role', 'is_candidate', 'is_company', 'is_active', 'candidate_profile', 'company_profile', 'credits', 'date_joined', 'photo')
        read_only_fields = ('is_candidate', 'is_company', 'credits')

class RegisterCandidateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone = serializers.CharField(required=False)
    location = serializers.CharField(required=False)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Un utilisateur avec cette adresse email existe déjà.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà pris.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            role=User.Role.CANDIDATE
        )
        # Check if profile already exists (shouldn't happen but just in case)
        CandidateProfile.objects.get_or_create(
            user=user, 
            defaults={
                'phone': validated_data.get('phone'),
                'location': validated_data.get('location')
            }
        )
        return user

class RegisterCompanySerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    company_name = serializers.CharField()
    phone = serializers.CharField(required=False)
    city = serializers.CharField(required=False)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Un utilisateur avec cette adresse email existe déjà.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà pris.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            role=User.Role.COMPANY
        )
        CompanyProfile.objects.get_or_create(
            user=user, 
            defaults={
                'name': validated_data['company_name'],
                'phone': validated_data.get('phone'),
                'city': validated_data.get('city')
            }
        )
        return user

class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'status', 'reference')
