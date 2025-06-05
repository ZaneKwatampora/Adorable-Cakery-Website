from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .kopokopo_handler import KopoKopoHandler
import requests
from rest_framework import status
from django.utils.timezone import now
import json
import logging

class InitiatePaymentView(APIView):
    def post(self, request):
        data = request.data
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        phone_number = data.get('phone_number')
        amount = data.get('amount')
        email = data.get('email')
        metadata = data.get('metadata', {})

        if not all([first_name, last_name, phone_number, amount]):
            return Response({'error': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            kopokopo = KopoKopoHandler()
            response = kopokopo.initiate_stk_push(first_name, last_name, phone_number, amount, email, metadata)
            return Response(response, status=status.HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

logger = logging.getLogger(__name__)

class KopoKopoWebhookView(APIView):
    authentication_classes = []  # Disable authentication for webhooks
    permission_classes = []

    def post(self, request):
        try:
            payload = json.loads(request.body)

            logger.info(f"Received Kopo Kopo webhook: {payload}")

            event_type = payload.get("event", "")
            resource = payload.get("resource", {})

            if event_type in ["buygoods_transaction_received", "stk_payment_received"]:
                reference = resource.get("reference")
                amount = resource.get("amount", {}).get("value")
                phone = resource.get("sender_phone_number")
                status_msg = resource.get("status")
                transaction_time = resource.get("timestamp")

                return Response({"message": "Webhook processed"}, status=status.HTTP_200_OK)
            else:
                logger.warning(f"Unhandled Kopo Kopo event: {event_type}")
                return Response({"message": "Unhandled event"}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error processing Kopo Kopo webhook: {str(e)}")
            return Response({"error": "Webhook error"}, status=status.HTTP_400_BAD_REQUEST)

