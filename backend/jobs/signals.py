from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Application
from notifications.models import Notification

@receiver(post_save, sender=Application)
def create_application_notification(sender, instance, created, **kwargs):
    if created:
        job = instance.job_offer
        company_user = job.company.user
        candidate_name = f"{instance.candidate.user.first_name} {instance.candidate.user.last_name}" or instance.candidate.user.username
        
        Notification.objects.create(
            user=company_user,
            notification_type=Notification.NotificationType.APPLICATION_STATUS,
            title="Nouvelle candidature reçue",
            message=f"{candidate_name} a postulé pour le poste : {job.title}",
            link=f"/dashboard/entreprise/offres/{job.slug}"
        )
