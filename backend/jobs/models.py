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
        Algorithme de Scoring IA v2.1 : Analyse multidimensionnelle du fit.
        Compare les compétences, le secteur, et le niveau d'expérience.
        """
        score = 0
        
        # 1. Analyse des Compétences (Poids: 50)
        job_skills = set([s.lower() for s in self.job_offer.required_skills]) if self.job_offer.required_skills else set()
        candidate_skills = set([s.lower() for s in self.candidate.skills]) if self.candidate.skills else set()
        
        if not job_skills:
            score += 50 # Base si pas de compétences requises spécifiées
        else:
            matches = job_skills.intersection(candidate_skills)
            skill_ratio = len(matches) / len(job_skills)
            score += int(skill_ratio * 50)
            
        # 2. Fit Sectoriel (Poids: 20)
        # Si le candidat a déjà travaillé dans ce secteur (titre ou bio)
        if self.job_offer.sector.lower() in (self.candidate.title or "").lower() or \
           self.job_offer.sector.lower() in (self.candidate.bio or "").lower():
            score += 20
        elif self.job_offer.sector == "TECH" and ("développeur" in (self.candidate.title or "").lower()):
            score += 15 # Bonus tech spécifique

        # 3. Niveau d'Expérience (Poids: 20)
        # Mapping simple des années d'expérience visées
        exp_map = {
            "STAGIAIRE": 0,
            "JUNIOR": 2,
            "INTERMEDIATE": 5,
            "SENIOR": 10,
            "EXPERT": 15
        }
        required_years = exp_map.get(self.job_offer.experience_level, 0)
        if self.candidate.experience_years >= required_years:
            score += 20
        elif self.candidate.experience_years >= (required_years * 0.7):
            score += 10 # Presque là

        # 4. Bonus de Qualité de Dossier (Poids: 10)
        # Utilise le score de placabilité calculé par le système
        score += int((self.candidate.placability_score / 100) * 10)

        self.matching_score = min(score, 100)
        return self.matching_score

    def save(self, *args, **kwargs):
        if not self.matching_score:
            self.calculate_matching_score()
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('job_offer', 'candidate')

    def __str__(self):
        return f"{self.candidate.user.email} -> {self.job_offer.title}"
