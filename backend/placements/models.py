from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import CompanyProfile, CandidateProfile

class PlacementRequest(models.Model):
    class PlacementStatus(models.TextChoices):
        SOURCING = "SOURCING", _("Recherche de Talents")
        AI_ANALYSIS = "AI_ANALYSIS", _("Analyse IA v2.5")
        VALIDATION = "VALIDATION", _("Validation Humaine")
        SHORTLIST_READY = "SHORTLIST_READY", _("Shortlist Prête")
        COMPLETED = "COMPLETED", _("Terminé")

    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name="placement_requests")
    title = models.CharField(max_length=255, help_text="Titre du poste à pourvoir")
    
    # Needs description
    description = models.TextField()
    budget_credits = models.IntegerField(default=250)
    
    progress = models.IntegerField(default=0) # 0 to 100
    status = models.CharField(max_length=20, choices=PlacementStatus.choices, default=PlacementStatus.SOURCING)
    
    # Matches found by IA
    matches = models.ManyToManyField(CandidateProfile, related_name="placement_matches", blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def find_matches(self):
        """
        Algorithme IA v2.5 : Trouve les candidats correspondants au titre et à la description.
        (Version simplifiée pour le MVP)
        """
        # On recherche des candidats qui ont des compétences mentionnées dans le titre ou la description
        words = set(self.title.lower().split() + self.description.lower().split())
        
        # Filtre basique sur les compétences JSON
        from django.db.models import Q
        potential_candidates = CandidateProfile.objects.filter(is_verified=True)
        
        matches_found = []
        for candidate in potential_candidates:
            candidate_skills = [s.lower() for s in candidate.skills] if candidate.skills else []
            intersection = set(candidate_skills).intersection(words)
            if intersection:
                matches_found.append(candidate)
        
        if matches_found:
            self.matches.add(*matches_found)
            self.progress = 100
            self.status = self.PlacementStatus.SHORTLIST_READY
            self.save()
            
            # Notify the company that their shortlist is ready
            try:
                from notifications.models import Notification
                Notification.objects.create(
                    user=self.company.user,
                    notification_type=Notification.NotificationType.MATCH_FOUND,
                    title="🎯 Shortlist IA Prête !",
                    message=f"Votre mission \"{self.title}\" a trouvé {len(matches_found)} talent(s) certifié(s). Consultez votre shortlist.",
                    link=f"/dashboard/entreprise/placement/{self.id}"
                )
                # Notify each matched candidate
                for candidate in matches_found:
                    Notification.objects.create(
                        user=candidate.user,
                        notification_type=Notification.NotificationType.MATCH_FOUND,
                        title="✨ Vous avez été sélectionné !",
                        message=f"L'IA Travago vous a identifié comme talent compatible pour le poste : \"{self.title}\".",
                        link="/dashboard/candidat/candidatures"
                    )
            except Exception:
                pass
            
        return matches_found

    def __str__(self):
        return f"Placement ID#{self.id} - {self.title}"
