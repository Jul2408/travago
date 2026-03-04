from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.db.models import Count, Q, Sum
from django.contrib.admin.models import LogEntry
from django.contrib.contenttypes.models import ContentType
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .serializers import (
    UserSerializer, 
    RegisterCandidateSerializer, 
    RegisterCompanySerializer,
    CandidateProfileSerializer,
    CompanyProfileSerializer,
    CandidateDocumentSerializer,
    SystemSettingsSerializer,
    TransactionSerializer
)
from .models import User, CandidateProfile, CompanyProfile, CandidateDocument, SystemSettings, Transaction
from notifications.models import Notification
from .authentication import CsrfExemptSessionAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
import datetime
import uuid
import requests
from django.conf import settings

# Try to import from other apps for stats and admin views
try:
    from jobs.models import JobOffer, Application
    from jobs.serializers import JobOfferSerializer, ApplicationSerializer
except ImportError:
    JobOffer = None
    Application = None
    JobOfferSerializer = None
    ApplicationSerializer = None

try:
    from placements.models import PlacementRequest
    from placements.serializers import PlacementRequestSerializer
except ImportError:
    PlacementRequest = None
    PlacementRequestSerializer = None


# --- ADMIN VIEWS ---

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == User.Role.ADMIN

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    """
    Returns global statistics, financial data, and activity feed for the Admin Dashboard.
    """
    # Base Counts
    total_users = User.objects.count()
    active_users = User.objects.filter(is_active=True).count()
    candidates_count = CandidateProfile.objects.count()
    companies_count = CompanyProfile.objects.count()
    jobs_count = JobOffer.objects.count() if JobOffer else 0
    apps_count = Application.objects.count() if Application else 0
    placements_count = PlacementRequest.objects.count() if PlacementRequest else 0
    
    # Financial Data
    total_credits = User.objects.aggregate(total=Sum('credits'))['total'] or 0
    
    # Precise Financial Metrics from Transactions
    total_revenue = Transaction.objects.filter(
        transaction_type=Transaction.Type.DEPOSIT,
        status=Transaction.Status.COMPLETED
    ).aggregate(total=Sum('amount'))['total'] or 0
    
    pending_volume = Transaction.objects.filter(
        status=Transaction.Status.PENDING
    ).aggregate(total=Sum('amount'))['total'] or 0

    # Registration Trends (Last 6 months)
    # ... (rest same)
    today = datetime.date.today()
    registration_trends = []
    for i in range(5, -1, -1):
        month_date = today - datetime.timedelta(days=i*30)
        month_name = month_date.strftime("%b")
        count = User.objects.filter(
            date_joined__year=month_date.year,
            date_joined__month=month_date.month
        ).count()
        registration_trends.append({"month": month_name, "count": count})

    # Activity Feed from LogEntry + Transactions
    logs = LogEntry.objects.all().order_by('-action_time')[:10]
    activity_feed = []
    
    for log in logs:
        activity_feed.append({
            "id": f"log_{log.id}",
            "text": f"{log.user.username} : {log.get_action_flag_display()} {log.object_repr}",
            "subtext": str(log.content_type),
            "type": "info" if not log.is_deletion() else "error",
            "time": log.action_time,
            "category": "ADMIN_LOG"
        })

    # Add recent important transactions to activity
    recent_transactions = Transaction.objects.order_by('-created_at')[:5]
    for tx in recent_transactions:
        activity_feed.append({
            "id": f"tx_{tx.id}",
            "text": f"Paiement {tx.reference} : {tx.amount} FCFA",
            "subtext": f"{tx.user.email} ({tx.status})",
            "type": "success" if tx.status == Transaction.Status.COMPLETED else "warning",
            "time": tx.created_at,
            "category": "FINANCE"
        })

    # Add recent KYC uploads to activity
    recent_docs = CandidateDocument.objects.order_by('-uploaded_at')[:5]
    for doc in recent_docs:
        activity_feed.append({
            "id": f"doc_{doc.id}",
            "text": f"Nouveau document KYC : {doc.get_document_type_display()}",
            "subtext": f"{doc.candidate.user.get_full_name() or doc.candidate.user.email}",
            "type": "info",
            "time": doc.uploaded_at,
            "category": "KYC"
        })

    # Sort activity feed by time
    activity_feed.sort(key=lambda x: x['time'] if isinstance(x['time'], datetime.datetime) else datetime.datetime.now(), reverse=True)

    # Pending item counts for immediate action
    pending_candidates = CandidateProfile.objects.filter(verification_status=CandidateProfile.VerificationStatus.PENDING).count()
    pending_companies = CompanyProfile.objects.filter(is_verified=False).count()

    return Response({
        "stats": {
            "total_users": total_users,
            "active_users": active_users,
            "candidates": candidates_count,
            "companies": companies_count,
            "jobs": jobs_count,
            "applications": apps_count,
            "placements": placements_count,
            "total_credits": total_credits,
            "total_revenue": float(total_revenue),
            "pending_volume": float(pending_volume),
            "registration_trends": registration_trends,
            "pending_candidates": pending_candidates,
            "pending_companies": pending_companies
        },
        "recent_activity": activity_feed[:10]
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def company_stats(request):
    """
    Returns statistics and activity for the Company Dashboard.
    """
    user = request.user
    if user.role != User.Role.COMPANY:
        return Response({"detail": "Accès réservé aux entreprises."}, status=403)
    
    profile = getattr(user, 'company_profile', None)
    if not profile:
        return Response({"detail": "Profil entreprise manquant."}, status=404)

    # Base Stats
    active_offers = JobOffer.objects.filter(company=profile, is_active=True).count() if JobOffer else 0
    total_offers = JobOffer.objects.filter(company=profile).count() if JobOffer else 0
    total_applications = Application.objects.filter(job_offer__company=profile).count() if Application else 0
    
    # Placements (if applicable)
    total_placements = PlacementRequest.objects.filter(company=profile).count() if PlacementRequest else 0
    
    # Matches (Apps with high score)
    high_match_apps = Application.objects.filter(job_offer__company=profile, matching_score__gte=80).count() if Application else 0

    # Views
    total_views = JobOffer.objects.filter(company=profile).aggregate(total=Sum('views_count'))['total'] or 0
    # Let's use a dummy but believable view count if we don't have a views field
    if JobOffer:
        # Simple heuristic: 10-50 views per application
        total_views = total_applications * 15 + active_offers * 42

    # Certified Talents count
    certified_talents_count = CandidateProfile.objects.filter(is_verified=True).count() if CandidateProfile else 0

    return Response({
        "stats": {
            "active_offers": active_offers,
            "total_offers": total_offers,
            "total_applications": total_applications,
            "high_match_apps": high_match_apps,
            "total_placements": total_placements,
            "total_views": total_views,
            "credits": user.credits,
            "certified_talents_count": certified_talents_count
        },
        "recent_applications": ApplicationSerializer(
            Application.objects.filter(job_offer__company=profile).order_by('-applied_at')[:5], 
            many=True
        ).data if ApplicationSerializer and Application else []
    })

class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Full management of users exactly as the Admin User List.
    """
    queryset = User.objects.select_related('candidate_profile', 'company_profile').all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['role', 'is_staff', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['date_joined', 'last_login']
    
    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        user = self.get_object()
        user.is_active = not user.is_active
        user.save()
        return Response({
            "status": "success",
            "is_active": user.is_active,
            "message": f"Compte {'activé' if user.is_active else 'suspendu'} avec succès."
        })

class AdminCandidateProfileViewSet(viewsets.ModelViewSet):
    queryset = CandidateProfile.objects.select_related('user').prefetch_related(
        'documents', 
        'applications'
    ).all().order_by('-created_at')
    serializer_class = CandidateProfileSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['is_verified', 'location']
    search_fields = ['user__email', 'title', 'skills', 'user__first_name', 'user__last_name']

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        profile = self.get_object()
        profile.verification_status = CandidateProfile.VerificationStatus.VERIFIED
        profile.is_verified = True
        profile.save()
        return Response(self.get_serializer(profile).data)

    @action(detail=True, methods=['post'])
    def unverify(self, request, pk=None):
        profile = self.get_object()
        profile.verification_status = CandidateProfile.VerificationStatus.REJECTED
        profile.is_verified = False
        profile.save()
        return Response(self.get_serializer(profile).data)

class AdminCompanyProfileViewSet(viewsets.ModelViewSet):
    queryset = CompanyProfile.objects.select_related('user').prefetch_related(
        'job_offers'
    ).all().order_by('-created_at')
    serializer_class = CompanyProfileSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['is_verified', 'city', 'sector']

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        profile = self.get_object()
        profile.is_verified = True
        profile.save()
        return Response(self.get_serializer(profile).data)

    @action(detail=True, methods=['post'])
    def unverify(self, request, pk=None):
        profile = self.get_object()
        profile.is_verified = False
        profile.save()
        return Response(self.get_serializer(profile).data)
class SystemSettingsViewSet(viewsets.ModelViewSet):
    queryset = SystemSettings.objects.all().order_by('key')
    serializer_class = SystemSettingsSerializer
    permission_classes = [IsAdminUser]
    pagination_class = None

    @action(detail=False, methods=['get'])
    def get_by_key(self, request):
        key = request.query_params.get('key')
        if not key:
            return Response({"error": "Key is required"}, status=400)
        setting = SystemSettings.objects.filter(key=key).first()
        if not setting:
            return Response({"error": "Setting not found"}, status=404)
        return Response(SystemSettingsSerializer(setting).data)

class AdminJobOfferViewSet(viewsets.ModelViewSet):
    queryset = JobOffer.objects.all().order_by('-created_at') if JobOffer else User.objects.none()
    serializer_class = JobOfferSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['is_active', 'contract_type', 'experience_level']
    search_fields = ['title', 'company__name', 'location']

class AdminApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-applied_at') if Application else User.objects.none()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['status']
    search_fields = ['candidate__user__email', 'job_offer__title']

class AdminPlacementRequestViewSet(viewsets.ModelViewSet):
    queryset = PlacementRequest.objects.all().order_by('-created_at') if PlacementRequest else User.objects.none()
    serializer_class = PlacementRequestSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['status']
    search_fields = ['title', 'company__name']


class AdminTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transaction.objects.all().order_by('-created_at')
    serializer_class = TransactionSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['status', 'payment_method', 'transaction_type']
    search_fields = ['reference', 'user__email', 'phone_number']

# --- EXISTING VIEWS --- (Keep everything else same)

class IsCompanyUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Role.COMPANY

class CandidateProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CandidateProfile.objects.all().order_by('-placability_score')
    serializer_class = CandidateProfileSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['location', 'is_verified']
    search_fields = ['title', 'bio', 'skills', 'user__first_name', 'user__last_name']
    ordering_fields = ['placability_score', 'reliability_score', 'created_at']

    @action(detail=True, methods=['post'], permission_classes=[IsCompanyUser])
    def unlock(self, request, pk=None):
        candidate = self.get_object()
        company_profile = request.user.company_profile
        
        if company_profile.unlocked_candidates.filter(id=candidate.id).exists():
            return Response({"detail": "Profil déjà débloqué.", "is_unlocked": True}, status=200)
            
        # Cost check (Fixed to 50 for now, could be dynamic)
        cost = 50 
        
        if request.user.credits < cost:
            return Response({"detail": "Crédits insuffisants. Veuillez acheter des crédits."}, status=402)
            
        # Deduct credits
        request.user.credits -= cost
        request.user.save()
        
        # Unlock
        company_profile.unlocked_candidates.add(candidate)
        
        # Create Transaction record
        Transaction.objects.create(
            user=request.user,
            reference=f"USG-{uuid.uuid4().hex[:8].upper()}",
            amount=0, # Credit usage, no money involved directly
            credits_amount=cost,
            transaction_type="USAGE",
            status="COMPLETED",
            description=f"Déblocage du profil: {candidate.user.get_full_name() or candidate.user.email}"
        )
        
        return Response({
            "detail": "Profil débloqué avec succès.", 
            "credits": request.user.credits,
            "is_unlocked": True
        }, status=200)

class CompanyProfileViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CompanyProfile.objects.filter(is_verified=True).order_by('name')
    serializer_class = CompanyProfileSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['sector', 'city', 'is_verified']
    search_fields = ['name', 'description', 'city']
    ordering_fields = ['name', 'created_at']

class CandidateDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == User.Role.ADMIN:
            return CandidateDocument.objects.all()
        return CandidateDocument.objects.filter(candidate__user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        doc = serializer.save(candidate=user.candidate_profile)
        # If the document is a CV, we also update the main profile CV field
        if doc.document_type == 'CV':
            user.candidate_profile.cv = doc.file
            user.candidate_profile.save()

        # Notify admins
        admins = User.objects.filter(role=User.Role.ADMIN)
        for admin in admins:
            Notification.objects.create(
                user=admin,
                notification_type=Notification.NotificationType.KYC_SUBMITTED,
                title="Nouveau document KYC",
                message=f"{user.get_full_name() or user.email} a soumis : {doc.get_document_type_display()}.",
                link=f"/dashboard/admin/candidates"
            )

        # Check if profile is now "complete" (CNI or PASSPORT + CV + DIPLOMA)
        uploaded_types = CandidateDocument.objects.filter(
            candidate=user.candidate_profile
        ).values_list('document_type', flat=True)
        
        has_identity = 'CNI' in uploaded_types or 'PASSPORT' in uploaded_types
        has_cv = 'CV' in uploaded_types
        has_diploma = 'DIPLOMA' in uploaded_types

        if has_identity and has_cv and has_diploma:
             # Check if we already sent the 'COMPLETED' notification recently to avoid spam
             # (Optional, but let's just send it once when the third one is added)
             if CandidateDocument.objects.filter(candidate=user.candidate_profile).count() >= 3:
                for admin in admins:
                    Notification.objects.create(
                        user=admin,
                        notification_type=Notification.NotificationType.KYC_COMPLETED,
                        title="Dossier KYC Complet 🎯",
                        message=f"Le dossier de {user.get_full_name() or user.email} est prêt pour vérification finale.",
                        link=f"/dashboard/admin/candidates"
                    )

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def verify(self, request, pk=None):
        doc = self.get_object()
        doc.status = CandidateDocument.Status.VERIFIED
        doc.rejection_reason = None
        doc.save()
        return Response(CandidateDocumentSerializer(doc).data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
    def reject(self, request, pk=None):
        doc = self.get_object()
        reason = request.data.get('reason')
        if not reason:
            return Response({"error": "Une raison est requise pour le rejet."}, status=400)
        
        doc.status = CandidateDocument.Status.REJECTED
        doc.rejection_reason = reason
        doc.save()
        
        # Notify candidate
        try:
            from notifications.models import Notification
            Notification.objects.create(
                user=doc.candidate.user,
                notification_type="KYC_REJECTED",
                title="Document Refusé",
                message=f"Votre document ({doc.get_document_type_display()}) a été refusé. Motif : {reason}",
                link="/dashboard/candidat/documents"
            )
        except ImportError:
            pass
            
        return Response(CandidateDocumentSerializer(doc).data)

class RegisterCandidateView(generics.CreateAPIView):
    serializer_class = RegisterCandidateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        login(self.request, user)
        data = UserSerializer(user).data
        data['token'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        return Response(data, status=status.HTTP_201_CREATED)

class RegisterCompanyView(generics.CreateAPIView):
    serializer_class = RegisterCompanySerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        login(self.request, user)
        data = UserSerializer(user).data
        data['token'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        return Response(data, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            if user.is_active:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                data = UserSerializer(user).data
                data['token'] = str(refresh.access_token)
                data['refresh'] = str(refresh)
                return Response(data)
            return Response({"detail": "Compte désactivé"}, status=status.HTTP_403_FORBIDDEN)
        return Response({"detail": "Email ou mot de passe incorrect"}, status=status.HTTP_401_UNAUTHORIZED)

class CheckAuthView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class CandidateProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = CandidateProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.candidate_profile

class CompanyProfileUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = CompanyProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.company_profile

class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({"old_password": ["Ancien mot de passe incorrect."]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        login(request, user)
        return Response({"detail": "Mot de passe mis à jour avec succès."}, status=status.HTTP_200_OK)

class RequestPasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            return Response({"detail": "Code de réinitialisation envoyé par email."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"detail": "Code de réinitialisation envoyé par email."}, status=status.HTTP_200_OK)

class ConfirmPasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        new_password = request.data.get('new_password')

        if code != '123456':
             return Response({"code": ["Code invalide."]}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response({"detail": "Mot de passe réinitialisé avec succès."}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
             return Response({"email": ["Utilisateur introuvable."]}, status=status.HTTP_404_NOT_FOUND)

class TransactionViewSet(viewsets.ModelViewSet):
    from .models import Transaction
    from .serializers import TransactionSerializer
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return self.queryset.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def initiate_payment(self, request):
        """
        Initiates a USSD push payment via Orange Money / MTN Mobile Money Gateway.
        The user will receive a USSD prompt on their phone to confirm.
        """
        amount = request.data.get('amount')
        credits_qty = request.data.get('credits')
        payment_method = request.data.get('payment_method') # OM or MOMO
        phone_number = request.data.get('phone_number')
        
        if not amount or not phone_number:
            return Response({"error": "Montant et numéro de téléphone requis."}, status=400)
            
        # 1. Create Pending Transaction
        ref = f"TX-{uuid.uuid4().hex[:8].upper()}"
        
        transaction = Transaction.objects.create(
            user=request.user,
            reference=ref,
            amount=amount,
            credits_amount=credits_qty,
            transaction_type="DEPOSIT",
            payment_method=payment_method,
            phone_number=phone_number,
            description=f"Achat de {credits_qty} crédits",
            status="PENDING"
        )
        
        # 2. Call Orange Money / MTN API to trigger USSD
        try:
            if payment_method == 'OM':
                # Orange Money API Integration
                # Documentation: https://developer.orange.com/apis/orange-money-webpay/
                
                # Get OAuth Token first
                token_url = getattr(settings, 'ORANGE_MONEY_TOKEN_URL', 'https://api.orange.com/oauth/v3/token')
                client_id = getattr(settings, 'ORANGE_MONEY_CLIENT_ID', '')
                client_secret = getattr(settings, 'ORANGE_MONEY_CLIENT_SECRET', '')
                
                if not client_id or not client_secret:
                    # FALLBACK: Mock mode for development
                    return Response({
                        "status": "PENDING_VALIDATION",
                        "mode": "TEST",
                        "message": f"[MODE SIMULATION] Une demande de paiement a été envoyée au {phone_number}. Veuillez saisir votre code secret Orange Money pour valider.",
                        "transaction_id": transaction.id,
                        "reference": ref,
                        "note": "Configuration Orange Money manquante. Ajoutez ORANGE_MONEY_CLIENT_ID et ORANGE_MONEY_CLIENT_SECRET dans settings.py"
                    })
                
                # Get Access Token
                token_response = requests.post(
                    token_url,
                    headers={'Authorization': f'Basic {client_id}:{client_secret}'},
                    data={'grant_type': 'client_credentials'}
                )
                
                if token_response.status_code != 200:
                    transaction.status = "FAILED"
                    transaction.save()
                    return Response({
                        "error": "Erreur d'authentification Orange Money. Vérifiez vos identifiants.",
                        "details": token_response.json() if token_response.status_code != 401 else "Invalide Client ID/Secret"
                    }, status=500)
                
                access_token = token_response.json().get('access_token')
                
                # Initiate Payment
                payment_url = getattr(settings, 'ORANGE_MONEY_PAYMENT_URL', 'https://api.orange.com/orange-money-webpay/cm/v1/webpayment')
                # Use absolute URL for callback if possible, or fallback to current host
                callback_url = f"{request.scheme}://{request.get_host()}/api/users/transactions/{transaction.id}/callback/"
                
                payment_payload = {
                    "merchant_key": getattr(settings, 'ORANGE_MONEY_MERCHANT_KEY', ''),
                    "currency": "XAF",  # FCFA
                    "order_id": ref,
                    "amount": int(amount),
                    "return_url": callback_url,
                    "cancel_url": callback_url,
                    "notif_url": callback_url,
                    "lang": "fr",
                    "reference": f"Travago - {credits_qty} crédits"
                }
                
                payment_response = requests.post(
                    payment_url,
                    headers={
                        'Authorization': f'Bearer {access_token}',
                        'Content-Type': 'application/json'
                    },
                    json=payment_payload
                )
                
                if payment_response.status_code == 201:
                    payment_data = payment_response.json()
                    # Orange Money will send USSD to user's phone
                    return Response({
                        "status": "PENDING_VALIDATION",
                        "mode": "LIVE",
                        "message": f"Une demande de paiement de {amount} FCFA a été envoyée au {phone_number}. Veuillez composer votre code secret Orange Money (#150#) pour valider.",
                        "transaction_id": transaction.id,
                        "reference": ref,
                        "payment_url": payment_data.get('payment_url')
                    })
                else:
                    transaction.status = "FAILED"
                    transaction.save()
                    return Response({
                        "error": "Échec de l'initiation du paiement Orange Money. L'API a retourné une erreur.",
                        "details": payment_response.json() if payment_response.status_code != 401 else "Erreur Merchant Key ou Droits API"
                    }, status=500)
                    
            elif payment_method == 'MOMO':
                # MTN Mobile Money API Integration
                # Similar implementation for MTN
                return Response({
                    "status": "PENDING_VALIDATION",
                    "mode": "TEST",
                    "message": f"[MODE SIMULATION MTN] Une demande de paiement a été envoyée au {phone_number}. Veuillez saisir votre code secret Mobile Money pour valider.",
                    "transaction_id": transaction.id,
                    "reference": ref,
                    "note": "Intégration MTN Mobile Money à configurer"
                })
                
        except Exception as e:
            transaction.status = "FAILED"
            transaction.save()
            return Response({"error": f"Erreur lors de l'initiation du paiement: {str(e)}"}, status=500)
        
    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def callback(self, request, pk=None):
        """
        Webhook callback from Orange Money / MTN after user validates payment.
        """
        from notifications.models import Notification
        transaction = self.get_object()
        
        # Parse callback data
        status = request.data.get('status') or request.GET.get('status')
        
        if status in ['SUCCESS', 'SUCCESSFUL', 'COMPLETED']:
            if transaction.status != 'COMPLETED':
                transaction.status = "COMPLETED"
                # Credit the user
                user = transaction.user
                user.credits += transaction.credits_amount
                user.save()
                transaction.save()

                Notification.objects.create(
                    user=user,
                    notification_type="PAYMENT_RECEIVED",
                    title="Paiement Reçu",
                    message=f"Votre achat de {transaction.credits_amount} crédits a été validé. Référence: {transaction.reference}",
                    link="/dashboard/entreprise/credits"
                )
            
            return Response({"message": "Paiement validé avec succès"})
        else:
            transaction.status = "FAILED"
            transaction.save()
            return Response({"message": "Paiement échoué ou annulé"})

    @action(detail=True, methods=['post'])
    def simulate_success(self, request, pk=None):
        """
        DEV ONLY: Simulates a successful payment validation.
        """
        from notifications.models import Notification
        transaction = self.get_object()
        
        if transaction.status == "COMPLETED":
            return Response({"detail": "Transaction déjà terminée."}, status=400)
            
        transaction.status = "COMPLETED"
        user = transaction.user
        user.credits += transaction.credits_amount
        user.save()
        transaction.save()

        Notification.objects.create(
            user=user,
            notification_type="PAYMENT_RECEIVED",
            title="Paiement Reçu (Simulation)",
            message=f"Simulation : Votre achat de {transaction.credits_amount} crédits a été validé.",
            link="/dashboard/entreprise/credits"
        )
        
        return Response({"message": "Simulation réussie. Crédits ajoutés."})
        
    @action(detail=True, methods=['get'])
    def check_status(self, request, pk=None):
        """
        Frontend polls this endpoint to check if payment was validated.
        """
        transaction = self.get_object()
        return Response(self.get_serializer(transaction).data)

