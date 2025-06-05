from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

class MarkAsReadView(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        notif_ids = request.data.get("ids", [])
        if notif_ids == "all":
            Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        else:
            Notification.objects.filter(user=request.user, id__in=notif_ids).update(is_read=True)
        return Response({"detail": "Notifications marked as read."}, status=status.HTTP_200_OK)

class NotificationDeleteView(generics.DestroyAPIView):
    queryset = Notification.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
