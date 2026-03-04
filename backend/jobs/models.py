from django.db import models
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from users.models import User, CompanyProfile

class JobOffer(models.Model):
    class ContractType(models.TextChoices):
        CDI = "CDI", _("CDI")
        CDD = "CDD", _("CDD")
        FREELANCE = "FREELANCE", _("Freelance")
        INTERIM = "INTERIM", _("Intérim")
        STAGE = "STAGE", _("Stage")
        ALTERNANCE = "ALTERNANCE", _("Alternance")

    class ExperienceLevel(models.TextChoices):
        STAGIAIRE = "STAGIAIRE", _("Stagiaire / Étudiant")
        JUNIOR = "JUNIOR", _("Junior (0-2 ans)")
        INTERMEDIATE = "INTERMEDIATE", _("Intermédiaire (2-5 ans)")
        SENIOR = "SENIOR", _("Sénior (5-10 ans)")
        EXPERT = "EXPERT", _("Expert (10+ ans)")

    class Sector(models.TextChoices):
        TECH = "TECH", _("Informatique / Tech")
        FINANCE = "FINANCE", _("Finance / Banque")
        HEALTH = "HEALTH", _("Santé / Médical")
        CONSTRUCTION = "CONSTRUCTION", _("BTP / Construction")
        AGRICULTURE = "AGRICULTURE", _("Agriculture")
        TURISM = "TURISM", _("Tourisme / Hôtellerie")
        EDUCATION = "EDUCATION", _("Éducation / Formation")
        TRANSPORT = "TRANSPORT", _("Transport / Logistique")
        COMMERCE = "COMMERCE", _("Commerce / Vente")
        SERVICES = "SERVICES", _("Services à la personne")
        INDUSTRY = "INDUSTRY", _("Industrie")
        ADMIN = "ADMIN", _("Administration / RH")

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    company = models.ForeignKey(CompanyProfile, on_delete=models.CASCADE, related_name="job_offers")
    
    sector = models.CharField(max_length=50, choices=Sector.choices, default=Sector.TECH)
    description = models.TextField()
    missions = models.TextField()
    requirements = models.TextField()
    
    contract_type = models.CharField(max_length=20, choices=ContractType.choices, default=ContractType.CDI)
    experience_level = models.CharField(max_length=20, choices=ExperienceLevel.choices, default=ExperienceLevel.INTERMEDIATE)
    
    location = models.CharField(max_length=255)
    salary_range = models.CharField(max_length=100, null=True, blank=True)
    
    # AI Matching Metadata
    required_skills = models.JSONField(default=list, blank=True)
    is_ia_boosted = models.BooleanField(default=False)
    is_boosted = models.BooleanField(default=False)
    
    is_active = models.BooleanField(default=True)
    views_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} @ {self.company.name}"

class Application(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", _("En attente")
        AI_REVIEW = "AI_REVIEW", _("Analyse IA")
        SHORTLISTED = "SHORTLISTED", _("Retenu")
        REJECTED = "REJECTED", _("Refusé")
        PLACED = "PLACED", _("Placé")

    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name="applications")
    candidate = models.ForeignKey("users.CandidateProfile", on_delete=models.CASCADE, related_name="applications")
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
    # AI Scoring for this specific application
    matching_score = models.IntegerField(default=0)
    ai_feedback = models.TextField(null=True, blank=True)
    
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_matching_score(self):
        """
        Analyse IA simplifiée du matching entre l'offre et le candidat.
        """
        job_skills = set([s.lower() for s in self.job_offer.required_skills]) if self.job_offer.required_skills else set()
        candidate_skills = set([s.lower() for s in self.candidate.skills]) if self.candidate.skills else set()
        
        if not job_skills:
            self.matching_score = 100
        else:
            matches = job_skills.intersection(candidate_skills)
            self.matching_score = int((len(matches) / len(job_skills)) * 100)
            
        # Bonus based on experience level
        # Simplified: if candidate experience matches or exceeds requirement
        # (This is just a placeholder for more complex IA logic)
        
        return self.matching_score

    def save(self, *args, **kwargs):
        if not self.matching_score:
            self.calculate_matching_score()
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('job_offer', 'candidate')

    def __str__(self):
        return f"{self.candidate.user.email} -> {self.job_offer.title}"
