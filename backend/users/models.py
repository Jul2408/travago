from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        CANDIDATE = "CANDIDATE", _("Candidat")
        COMPANY = "COMPANY", _("Entreprise")
        ADMIN = "ADMIN", _("Administrateur")

    email = models.EmailField(_("email address"), unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CANDIDATE)
    
    # Flags for convenience
    is_candidate = models.BooleanField(default=False)
    is_company = models.BooleanField(default=False)
    
    # Wallet for monetization
    credits = models.IntegerField(default=0)
    photo = models.ImageField(upload_to="profiles/", null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if self.role == self.Role.CANDIDATE:
            self.is_candidate = True
        elif self.role == self.Role.COMPANY:
            self.is_company = True
        super().save(*args, **kwargs)

class CandidateProfile(models.Model):
    class VerificationStatus(models.TextChoices):
        UNVERIFIED = "UNVERIFIED", _("Non Vérifié")
        PENDING = "PENDING", _("En attente de validation")
        VERIFIED = "VERIFIED", _("Vérifié / Certifié")
        REJECTED = "REJECTED", _("Rejeté")

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="candidate_profile")
    photo = models.ImageField(upload_to="candidates/photos/", null=True, blank=True)
    title = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    cv = models.FileField(upload_to="candidates/cvs/", null=True, blank=True)
    video_pitch = models.URLField(null=True, blank=True, help_text="Lien vers la vidéo de présentation")
    
    # Placability (Smart Filtering) vs Reliability (Vérification)
    placability_score = models.IntegerField(default=0)
    reliability_score = models.IntegerField(default=0)
    
    # Manual Verification
    verification_status = models.CharField(max_length=20, choices=VerificationStatus.choices, default=VerificationStatus.UNVERIFIED)
    is_verified = models.BooleanField(default=False) # Auto-updated based on status
    is_boosted = models.BooleanField(default=False)

    # Experience & Skills
    experience_years = models.IntegerField(default=0)
    experience = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    
    # KYC Documents (Physical files for AI OCR)
    id_document = models.FileField(upload_to="candidates/kyc/", null=True, blank=True)
    id_card_verified = models.BooleanField(default=False)
    diploma_verified = models.BooleanField(default=False)
    
    location = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def calculate_placability_score(self):
        """
        Calcule le score de placabilité (0-100) basé sur la QUALITÉ du dossier (Smart Filtering).
        L'IA privilégie les dossiers complets et vérifiés.
        """
        score = 0
        
        # 1. Complétude du profil (Base: 50 points)
        if self.photo: score += 10
        if self.title: score += 5
        if self.bio and len(self.bio) > 50: score += 10
        if self.cv: score += 15 # CV est crucial
        if self.skills and len(self.skills) > 0: score += 5
        if self.location: score += 2.5
        if self.phone: score += 2.5
        
        # 2. Expérience (Bonus: 20 points)
        # Plus on a d'années, mieux c'est (plafonné)
        score += min(self.experience_years * 2, 20)
        
        # 3. Vérification & Fiabilité (Bonus: 30 points)
        # Un profil certifié par l'admin remonte automatiquement
        if self.is_verified:
            score += 30
        elif self.verification_status == self.VerificationStatus.PENDING:
            score += 10

        self.placability_score = min(score, 100)
        
        return self.placability_score

    def save(self, *args, **kwargs):
        # Auto-update is_verified based on manual status
        self.is_verified = (self.verification_status == self.VerificationStatus.VERIFIED)
        self.calculate_placability_score()
        
        # Sync photo to user model if present
        if self.photo and self.user.photo != self.photo:
            self.user.photo = self.photo
            self.user.save(update_fields=['photo'])
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Profil de {self.user.email}"

class CandidateDocument(models.Model):
    class DocType(models.TextChoices):
        CNI = "CNI", _("Carte Nationale d'Identité")
        PASSPORT = "PASSPORT", _("Passeport")
        DIPLOMA = "DIPLOMA", _("Diplôme")
        CERTIFICATE = "CERTIFICATE", _("Certificat de Travail / Stage")
        CV = "CV", _("Curriculum Vitae")
        OTHER = "OTHER", _("Autre Document")

    class Status(models.TextChoices):
        PENDING = "PENDING", _("En attente")
        VERIFIED = "VERIFIED", _("Vérifié")
        REJECTED = "REJECTED", _("Rejeté")

    candidate = models.ForeignKey(CandidateProfile, on_delete=models.CASCADE, related_name="documents")
    document_type = models.CharField(max_length=20, choices=DocType.choices)
    file = models.FileField(upload_to="candidates/kyc/")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    rejection_reason = models.TextField(null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.document_type} - {self.candidate.user.email}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # On save of a document, we trigger the profile score update
        self.candidate.save()

class CompanyProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="company_profile")
    name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to="companies/logos/", null=True, blank=True)
    sector = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    
    # Monetization: tracking which candidates this company has paid for
    unlocked_candidates = models.ManyToManyField(CandidateProfile, related_name="unlocked_by_companies", blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Sync logo to user photo
        if self.logo and self.user.photo != self.logo:
            self.user.photo = self.logo
            self.user.save(update_fields=['photo'])
        super().save(*args, **kwargs)

class SystemSettings(models.Model):
    key = models.CharField(max_length=100, unique=True, verbose_name=_("Clé"))
    value = models.JSONField(verbose_name=_("Valeur"))
    description = models.TextField(null=True, blank=True, verbose_name=_("Description"))
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("Paramètre Système")
        verbose_name_plural = _("Paramètres Système")

    def __str__(self):
        return self.key

    @classmethod
    def get_setting(cls, key, default=None):
        try:
            return cls.objects.get(key=key).value
        except cls.DoesNotExist:
            return default

class Transaction(models.Model):
    class Type(models.TextChoices):
        DEPOSIT = "DEPOSIT", "Dépôt (Achat Crédits)"
        USAGE = "USAGE", "Utilisation Crédits"

    class Status(models.TextChoices):
        PENDING = "PENDING", "En attente"
        COMPLETED = "COMPLETED", "Terminé"
        FAILED = "FAILED", "Échoué"
        CANCELLED = "CANCELLED", "Annulé"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    reference = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2) # In currency (FCFA)
    credits_amount = models.IntegerField(default=0) # Number of credits bought or used
    
    transaction_type = models.CharField(max_length=20, choices=Type.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
    payment_method = models.CharField(max_length=50, null=True, blank=True) # OM, MOMO
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reference} - {self.user.email} ({self.status})"
