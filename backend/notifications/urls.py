from django.urls import path
from .views import NotificationListView, MarkAsReadView, NotificationDeleteView

urlpatterns = [
    path('notifcations/', NotificationListView.as_view(), name='notifications'),
    path('notifications/<int:pk>/mark-read/', MarkAsReadView.as_view(), name='mark-read'),
    path('notifications/<int:pk>/delete/', NotificationDeleteView.as_view(), name='notification-delete'),
]
