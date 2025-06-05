from django.urls import path
from .views import *

urlpatterns = [
    path('orders/', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>/update-status/', OrderStatusUpdateView.as_view(), name='order-status-update'),
    path('orders/bulk-update-status/', BulkOrderStatusUpdateView.as_view(), name='bulk-order-status-update'),
]
