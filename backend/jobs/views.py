from django.http import Http404
from rest_framework import viewsets, permissions, status, filters, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import JobOffer, Application
from .serializers import JobOfferSerializer, ApplicationSerializer
from users.authentication import CsrfExemptSessionAuthentication
from notifications.models import Notification

class JobOfferViewSet(viewsets.ModelViewSet):
    queryset = JobOffer.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = JobOfferSerializer
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['contract_type', 'experience_level', 'location']
    search_fields = ['title', 'description', 'company__name']
    ordering_fields = ['created_at', 'salary_range']

    def get_queryset(self):
        user = self.request.user
        queryset = JobOffer.objects.filter(is_active=True).order_by('-created_at')
        if not user.is_authenticated:
            return queryset
            
        role = getattr(user, 'role', None)
        if role == 'COMPANY':
            try:
                profile = getattr(user, 'company_profile', None)
                if profile:
                    return JobOffer.objects.filter(company=profile).order_by('-created_at')
                return JobOffer.objects.none()
            except Exception:
                return JobOffer.objects.none()
        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        profile = getattr(self.request.user, 'company_profile', None)
        if profile:
            serializer.save(company=profile)
        else:
            raise serializers.ValidationError("Profile entreprise manquant.")

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def apply(self, request, slug=None):
        try:
            job = self.get_object()
            candidate = getattr(request.user, 'candidate_profile', None)
            
            if not candidate:
                return Response({"detail": "Profil candidat manquant. Veuillez compléter votre profil."}, status=status.HTTP_400_BAD_REQUEST)

            if Application.objects.filter(job_offer=job, candidate=candidate).exists():
                return Response({"detail": "Vous avez déjà postulé à cette offre."}, status=status.HTTP_400_BAD_REQUEST)
            
            application = Application.objects.create(job_offer=job, candidate=candidate)
            
            # Notify Company about the new application
            try:
                Notification.objects.create(
                    user=job.company.user,
                    notification_type=Notification.NotificationType.JOB_ALERT,
                    title="Nouvelle candidature reçue",
                    message=f"{request.user.get_full_name() or request.user.username} a postulé à votre offre : {job.title}",
                    link=f"/dashboard/entreprise/offres/{job.slug}"
                )
            except Exception:
                pass  # Don't break application creation if notification fails

            serializer = ApplicationSerializer(application)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
        except Http404:
            raise
        except Exception as e:
            import traceback
            return Response({
                "error": "Error in get_object",
                "detail": str(e),
                "traceback": traceback.format_exc()
            }, status=500)

        try:
            serializer = self.get_serializer(instance)
            data = serializer.data
            
            if request.user.is_authenticated and getattr(request.user, 'is_candidate', False):
                try:
                    profile = getattr(request.user, 'candidate_profile', None)
                    if profile:
                        data['ai_match_score'] = self.calculate_match(profile, instance)
                except Exception as match_err:
                    data['match_error'] = str(match_err)
            return Response(data)
        except Exception as e:
            import traceback
            return Response({
                "error": "Error in serialization or match calculation",
                "detail": str(e),
                "traceback": traceback.format_exc(),
                "path": request.path,
                "user": str(request.user)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def calculate_match(self, profile, job):
        try:
            p_skills = profile.skills if isinstance(profile.skills, list) else []
            j_skills = job.required_skills if isinstance(job.required_skills, list) else []
            
            candidate_skills = [str(s).lower() for s in p_skills if s]
            job_skills = [str(s).lower() for s in j_skills if s]
            
            if not job_skills: return 50
            matches = set(candidate_skills) & set(job_skills)
            score = int((len(matches) / len(job_skills)) * 100) if job_skills else 50
            if profile.title and job.title and (profile.title.lower() in job.title.lower()):
                score += 20
            return min(score, 100)
        except Exception:
            return 0

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            data = serializer.data
            if request.user.is_authenticated and getattr(request.user, 'is_candidate', False):
                profile = getattr(request.user, 'candidate_profile', None)
                if profile:
                    for item in data:
                        try:
                            job = JobOffer.objects.get(id=item['id'])
                            item['ai_match_score'] = self.calculate_match(profile, job)
                        except Exception:
                            item['ai_match_score'] = 0
            return self.get_paginated_response(data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ApplicationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['job_offer__slug', 'status']
    ordering_fields = ['created_at', 'matching_score']

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_candidate', False):
            profile = getattr(user, 'candidate_profile', None)
            return Application.objects.filter(candidate=profile) if profile else Application.objects.none()
        elif getattr(user, 'is_company', False):
            profile = getattr(user, 'company_profile', None)
            return Application.objects.filter(job_offer__company=profile) if profile else Application.objects.none()
        return Application.objects.none()

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def update_status(self, request, pk=None):
        """Let company update the status of an application (PENDING, SHORTLISTED, REJECTED)."""
        application = self.get_object()
        new_status = request.data.get('status')
        allowed = ['PENDING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED']
        if new_status not in allowed:
            return Response({"detail": f"Statut invalide. Valeurs autorisées : {allowed}"}, status=400)
        application.status = new_status
        application.save()

        # Notify the candidate
        try:
            Notification.objects.create(
                user=application.candidate.user,
                notification_type=Notification.NotificationType.JOB_ALERT,
                title=f"Votre candidature a été mise à jour",
                message=f"Votre candidature pour \"{application.job_offer.title}\" est maintenant : {new_status}.",
                link="/dashboard/candidat/candidatures"
            )
        except Exception:
            pass

        return Response(ApplicationSerializer(application).data)
