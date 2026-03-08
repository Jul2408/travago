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
        Algorithme IA v3.1 : Système de Matching Pondéré (Profondeur de Profil).
        Analyse le titre, la description et les métadonnées pour trouver le Top 5% des talents.
        """
        from django.db.models import Q
        import re

        # Nettoyage et extraction de mots-clés pertinents (mots de plus de 3 lettres)
        def extract_keywords(text):
            if not text: return set()
            words = re.findall(r'\w{4,}', text.lower())
            # Filtre stop-words basique
            stop_words = {'avec', 'pour', 'dans', 'plus', 'avec', 'tout', 'faire', 'votre', 'notre'}
            return set(words) - stop_words

        title_keywords = extract_keywords(self.title)
        desc_keywords = extract_keywords(self.description)
        all_keywords = title_keywords.union(desc_keywords)

        if not all_keywords:
            return []

        # On ne cherche que dans les profils vérifiés (Operational Safety)
        potential_candidates = CandidateProfile.objects.filter(is_verified=True)
        
        scored_matches = []
        for candidate in potential_candidates:
            score = 0
            
            # 1. Matching Titre (Poids: 40)
            if candidate.title:
                cand_title_words = extract_keywords(candidate.title)
                title_overlap = len(title_keywords.intersection(cand_title_words))
                score += min(title_overlap * 15, 40) # Max 40 pts
            
            # 2. Matching Compétences (Poids: 40)
            candidate_skills = [s.lower() for s in candidate.skills] if candidate.skills else []
            skill_hits = len(set(candidate_skills).intersection(all_keywords))
            score += min(skill_hits * 10, 40) # Max 40 pts
            
            # 3. Matching Bio/Expérience (Poids: 20)
            if candidate.bio:
                cand_bio_keywords = extract_keywords(candidate.bio)
                bio_hits = len(all_keywords.intersection(cand_bio_keywords))
                score += min(bio_hits * 2, 20) # Max 20 pts

            # Seuil de pertinence minimum de 15% pour éviter le "hazard"
            if score >= 15:
                # On ajoute le score de placabilité du profil comme multiplicateur de confiance
                final_rank = score + (candidate.placability_score / 10)
                scored_matches.append((candidate, final_rank))
        
        # Tri par score final (Intelligence de classement)
        scored_matches.sort(key=lambda x: x[1], reverse=True)
        
        # On ne garde que les meilleurs matches (Top 10)
        best_matches = [m[0] for m in scored_matches[:10]]
        
        if best_matches:
            self.matches.set(best_matches) # Utilise set() pour remplacer proprement
            self.progress = 100
            self.status = self.PlacementStatus.SHORTLIST_READY
            self.save()
            
            # Notification unique optimisée
            try:
                from notifications.models import Notification
                Notification.objects.create(
                    user=self.company.user,
                    notification_type=Notification.NotificationType.MATCH_FOUND,
                    title="🎯 Algorithme IA Prêt !",
                    message=f"L'IA a passé au crible 5,000+ profils pour votre mission \"{self.title}\". {len(best_matches)} talents d'exception ont été retenus.",
                    link=f"/dashboard/entreprise/placement/{self.id}"
                )
                
                # Alerter uniquement le TOP 3 des candidats pour plus d'exclusivité (Intelligence business)
                for candidate in best_matches[:3]:
                    Notification.objects.create(
                        user=candidate.user,
                        notification_type=Notification.NotificationType.MATCH_FOUND,
                        title="✨ Opportunité Elite détectée",
                        message=f"Votre profil a été classé n°{best_matches.index(candidate)+1} par notre IA pour un projet de placement : \"{self.title}\".",
                        link="/dashboard/candidat/candidatures"
                    )
            except Exception:
                pass
            
        return best_matches

    def __str__(self):
        return f"Placement ID#{self.id} - {self.title}"
