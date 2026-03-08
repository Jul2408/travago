from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from users.authentication import CsrfExemptSessionAuthentication

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.conversations.all()

    def perform_create(self, serializer):
        # When creating a conversation, the current user is automatically a participant
        participants = self.request.data.get('participants', [])
        if self.request.user.id not in participants:
            participants.append(self.request.user.id)
        serializer.save(participants=participants)

    @action(detail=False, methods=['post'])
    def start_conversation(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({"detail": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if conversation already exists between these two
        conversation = Conversation.objects.filter(participants=request.user).filter(participants__id=user_id).first()
        
        if not conversation:
            conversation = Conversation.objects.create()
            conversation.participants.add(request.user.id, user_id)
            conversation.save()
            
        serializer = self.get_serializer(conversation)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        conversation = self.get_object()
        msgs = conversation.messages.all()
        serializer = MessageSerializer(msgs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        conversation = self.get_object()
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(sender=request.user, conversation=conversation)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    @action(detail=False, methods=['get'])
    def unread_total(self, request):
        """Returns the total number of unread messages for the current user across all conversations."""
        count = Message.objects.filter(
            conversation__participants=request.user,
            is_read=False
        ).exclude(sender=request.user).count()
        return Response({"unread_count": count})
