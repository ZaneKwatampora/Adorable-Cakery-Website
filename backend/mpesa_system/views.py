from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .utils import MpesaHandler
from order_system.models import Order

class STKPushView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        """
        Initiate M-Pesa payment for a specific order
        Requires:
        - order_id in URL
        - Authenticated user
        Automatically uses the order's total price
        """
        try:
            # Get the order and verify ownership
            order = Order.objects.get(id=order_id, user=request.user)
            
            # Initialize M-Pesa handler
            mpesa = MpesaHandler()
            
            # Initiate payment with order's total price
            response = mpesa.make_stk_push(order)
            
            return Response(response, status=status.HTTP_200_OK)
            
        except Order.DoesNotExist:
            return Response(
                {'error': 'Order not found or does not belong to you'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Payment failed: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )