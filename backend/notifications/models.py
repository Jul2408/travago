from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        APPLICATION_STATUS = "APPLICATION_STATUS", _("Changement de statut")
        NEW_MESSAGE = "NEW_MESSAGE", _("Nouveau Message")
        JOB_ALERT = "JOB_ALERT", _("Alerte Emploi")
        SYSTEM = "SYSTEM", _("Système")
        MATCH_FOUND = "MATCH_FOUND", _("Match IA Trouvé")
        KYC_REJECTED = "KYC_REJECTED", _("Document Rejeté")
        KYC_SUBMITTED = "KYC_SUBMITTED", _("Document Soumis")
        KYC_COMPLETED = "KYC_COMPLETED", _("Dossier KYC Complet")
        PAYMENT_RECEIVED = "PAYMENT_RECEIVED", _("Paiement Reçu")

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    notification_type = models.CharField(max_length=20, choices=NotificationType.choices, default=NotificationType.SYSTEM)
    
    title = models.CharField(max_length=255)
    message = models.TextField()
    link = models.CharField(max_length=255, null=True, blank=True)
    
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type} - {self.user.email} - {self.title}"
