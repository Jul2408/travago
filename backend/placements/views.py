from rest_framework import viewsets, permissions
from .models import PlacementRequest
from .serializers import PlacementRequestSerializer

class PlacementRequestViewSet(viewsets.ModelViewSet):
    serializer_class = PlacementRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_company:
            return PlacementRequest.objects.filter(company=user.company_profile)
        return PlacementRequest.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        budget = int(self.request.data.get('budget_credits', 250))
        
        if user.credits < budget:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"error": "Crédits insuffisants pour lancer cette mission IA."})
            
        try:
            company_profile = user.company_profile
        except Exception:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"error": "Profil entreprise introuvable."})

        instance = serializer.save(company=company_profile, budget_credits=budget)
        
        # Deduct credits
        user.credits -= budget
        user.save()
        
        # Trigger IA Hunt (Simulation/Algorithm)
        instance.find_matches()
