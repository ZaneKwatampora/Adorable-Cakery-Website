from django.urls import path
from .views import InitiatePaymentView, KopoKopoWebhookView

urlpatterns = [
    path('kopokopo/initiate/', InitiatePaymentView.as_view(), name='initiate-kopokopo-payment'),
    path('kopokopo/webhook/', KopoKopoWebhookView.as_view(), name='kopokopo-webhook'),
]
