from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Message
from notifications.models import Notification

@receiver(post_save, sender=Message)
def create_message_notification(sender, instance, created, **kwargs):
    if created:
        conversation = instance.conversation
        sender_user = instance.sender
        
        # Notify all other participants in the conversation
        other_participants = conversation.participants.exclude(id=sender_user.id)
        
        for user in other_participants:
            Notification.objects.create(
                user=user,
                notification_type=Notification.NotificationType.NEW_MESSAGE,
                title=f"Nouveau message de {sender_user.username or sender_user.email}",
                message=instance.content[:100] + ("..." if len(instance.content) > 100 else ""),
                link=f"/dashboard/{'entreprise' if user.role == 'COMPANY' else 'candidat'}/messages"
            )
