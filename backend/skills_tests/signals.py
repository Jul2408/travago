from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import TestResult
from notifications.models import Notification

@receiver(post_save, sender=TestResult)
def create_test_result_notification(sender, instance, created, **kwargs):
    if created:
        user = instance.user
        test_title = instance.test.title
        score = instance.score
        
        Notification.objects.create(
            user=user,
            notification_type=Notification.NotificationType.TEST_RESULT,
            title="Résultat de test disponible",
            message=f"Vous avez obtenu un score de {score}% pour le test : {test_title}",
            link="/dashboard/candidat/tests"
        )
