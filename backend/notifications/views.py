from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'notification marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({'status': 'all notifications marked as read'})

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def broadcast(self, request):
        title = request.data.get('title')
        message = request.data.get('message')
        notification_type = request.data.get('notification_type', Notification.NotificationType.SYSTEM)
        link = request.data.get('link')

        if not title or not message:
            return Response({'error': 'Title and message are required'}, status=status.HTTP_400_BAD_REQUEST)

        users = User.objects.filter(is_active=True)
        notifications = [
            Notification(
                user=user,
                title=title,
                message=message,
                notification_type=notification_type,
                link=link
            ) for user in users
        ]
        Notification.objects.bulk_create(notifications)
        
        return Response({'status': f'Broadcast sent to {len(notifications)} users'}, status=status.HTTP_201_CREATED)
