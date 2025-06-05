from django.urls import path
from .views import STKPushView

urlpatterns = [
    path('orders/<int:order_id>/pay/', STKPushView.as_view(), name='initiate-payment'),
]