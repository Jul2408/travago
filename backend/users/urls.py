from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterCandidateView,
    RegisterCompanyView,
    UserDetailView,
    CandidateProfileUpdateView,
    CompanyProfileUpdateView,
    CandidateDocumentViewSet,
    LoginView,
    LogoutView,
    CheckAuthView,
    CandidateProfileViewSet,
    CompanyProfileViewSet,
    ChangePasswordView,
    RequestPasswordResetView,
    ConfirmPasswordResetView,
    admin_stats,
    company_stats,
    AdminUserViewSet,
    AdminCandidateProfileViewSet,
    AdminCompanyProfileViewSet,
    AdminJobOfferViewSet,
    AdminApplicationViewSet,
    AdminPlacementRequestViewSet,
    SystemSettingsViewSet,
    TransactionViewSet,
    AdminTransactionViewSet,
    CVParsingView
)

router = DefaultRouter()
router.register(r'documents', CandidateDocumentViewSet, basename='candidate-documents')
router.register(r'candidates', CandidateProfileViewSet, basename='candidate-profiles')
router.register(r'company-profiles', CompanyProfileViewSet, basename='company-profiles')
# Admin Routes
router.register(r'admin/users', AdminUserViewSet, basename='admin-users')
router.register(r'admin/candidate-profiles', AdminCandidateProfileViewSet, basename='admin-candidate-profiles')
router.register(r'admin/company-profiles', AdminCompanyProfileViewSet, basename='admin-company-profiles')
router.register(r'admin/jobs', AdminJobOfferViewSet, basename='admin-jobs')
router.register(r'admin/applications', AdminApplicationViewSet, basename='admin-applications')
router.register(r'admin/placements', AdminPlacementRequestViewSet, basename='admin-placements')
router.register(r'admin/settings', SystemSettingsViewSet, basename='admin-settings')
router.register(r'admin/transactions', AdminTransactionViewSet, basename='admin-transactions')
router.register(r'transactions', TransactionViewSet, basename='transactions')

urlpatterns = [
    # Auth
    path('register/candidate/', RegisterCandidateView.as_view(), name='register_candidate'),
    path('register/company/', RegisterCompanyView.as_view(), name='register_company'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-auth/', CheckAuthView.as_view(), name='check_auth'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('profile/candidate/', CandidateProfileUpdateView.as_view(), name='candidate_profile'),
    path('profile/company/', CompanyProfileUpdateView.as_view(), name='company_profile'),
    path('parse-cv/', CVParsingView.as_view(), name='parse_cv'),
    
    # Password Management
    path('password/change/', ChangePasswordView.as_view(), name='change_password'),
    path('password/reset/request/', RequestPasswordResetView.as_view(), name='request_password_reset'),
    path('password/reset/confirm/', ConfirmPasswordResetView.as_view(), name='confirm_password_reset'),

    # Admin Exclusive
    path('admin/stats/', admin_stats, name='admin_stats'),
    path('company/stats/', company_stats, name='company_stats'),

    # Documents & ViewSets
    path('', include(router.urls)),
]
