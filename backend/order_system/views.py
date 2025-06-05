from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from collections import defaultdict
from .models import Order
from .serializers import *
from notifications.models import Notification


def send_order_email(user, subject, message, notify_admin=False, admin_subject=None, admin_message=None):
    recipients = []

    # Send to user
    if user.email:
        recipients.append(user.email)

    # Send to admin if enabled
    if notify_admin and hasattr(settings, "ADMIN_EMAIL"):
        admin_email = settings.ADMIN_EMAIL
        if admin_email:
            recipients.append(admin_email)

    if recipients:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=False,
        )

    # Optional separate email for admin
    if notify_admin and admin_message and admin_subject:
        send_mail(
            subject=admin_subject,
            message=admin_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=False,
        )


def create_order_notification(user, title, message):
    Notification.objects.create(
        user=user,
        title=title,
        message=message,
        type='order'
    )


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Order.objects.all() if user.is_staff else Order.objects.filter(user=user)

    def perform_create(self, serializer):
        user = self.request.user
        address = self.request.data.get('address', '').strip()
        if not address:
            raise serializers.ValidationError({'address': 'Delivery address is required.'})

        order = serializer.save(user=user, address=address)

        product_lines = "\n".join([
            f"- {item.product.name} – {item.quantity} kg" for item in order.order_items.all()
        ])

        user_message = f"""
Hi {user.full_name},

Thank you for your order at Adorable Cakery! 🎂

Order ID: {order.id}
Date: {order.created_at.strftime('%Y-%m-%d %H:%M')}
Payment Method: {order.payment_method}
Status: {order.status}

Items:
{product_lines}

Order Total: KES {order.total_price:.2f}

You will receive updates as your order progresses.

With love,  
Adorable Cakery Team
        """.strip()

        admin_message = f"""
📦 A new order has been placed on Adorable Cakery!

Customer: {user.full_name}
Phone: {user.phone}
Email: {user.email}
Address: {order.address}

Order ID: {order.id}
Date: {order.created_at.strftime('%Y-%m-%d %H:%M')}
Payment Method: {order.payment_method}
Status: {order.status}

Items:
{product_lines}

Total: KES {order.total_price:.2f}
        """.strip()

        send_order_email(
            user=user,
            subject="Order Confirmation – Adorable Cakery",
            message=user_message,
            notify_admin=True,
            admin_subject="📦 New Order Placed – Adorable Cakery",
            admin_message=admin_message
        )


class OrderStatusUpdateView(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        new_status = request.data.get('status')

        if not new_status or new_status == order.status:
            return Response({"detail": "Invalid or unchanged status."}, status=status.HTTP_400_BAD_REQUEST)

        old_status = order.status
        order.status = new_status
        order.save()

        product_lines = "\n".join([
            f"- {item.product.name} – {item.quantity} kg" for item in order.order_items.all()
        ])

        message = f"""
Your order #{order.id} placed on {order.created_at.strftime('%Y-%m-%d %H:%M')} has been updated.

Items:
{product_lines}

Previous Status: {old_status}
New Status: {new_status}
        """.strip()

        create_order_notification(order.user, "Order Status Updated", message)

        email_message = f"""
Hi {order.user.full_name},

{message}

Thanks for shopping with Adorable Cakery! 🎂
        """.strip()

        send_order_email(order.user, "Order Status Updated – Adorable Cakery", email_message)

        return Response({"detail": f"Status updated to '{new_status}' and notification sent."})


class BulkOrderStatusUpdateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, *args, **kwargs):
        updates = request.data.get("updates", [])
        if not isinstance(updates, list) or not updates:
            return Response({"detail": "Provide a non-empty 'updates' list."}, status=status.HTTP_400_BAD_REQUEST)

        results = []
        user_notifications = defaultdict(list)

        for update in updates:
            order_id = update.get("order_id")
            new_status = update.get("status")

            if not order_id or not new_status:
                results.append({"order_id": order_id, "status": "Invalid data"})
                continue

            try:
                order = Order.objects.get(id=order_id)
            except Order.DoesNotExist:
                results.append({"order_id": order_id, "status": "Order not found"})
                continue

            if order.status == new_status:
                results.append({"order_id": order_id, "status": "Status unchanged"})
                continue

            old_status = order.status
            order.status = new_status
            order.save()

            product_lines = "\n".join([
                f"- {item.product.name} – {item.quantity} kg" for item in order.order_items.all()
            ])

            msg = f"""
Order #{order.id} ({order.created_at.strftime('%Y-%m-%d %H:%M')})
Items:
{product_lines}
Previous Status: {old_status}
New Status: {new_status}
            """.strip()

            user_notifications[order.user].append(msg)
            results.append({"order_id": order_id, "status": "Updated"})

        for user, messages in user_notifications.items():
            full_msg = "\n\n".join(messages)

            create_order_notification(user, "Order Status Updates", full_msg)

            email_message = f"""
Hi {user.full_name},

The status of your recent orders has changed:

{full_msg}

Thanks for shopping with Adorable Cakery! 🎂
            """.strip()

            send_order_email(user, "Multiple Order Updates – Adorable Cakery", email_message)

        return Response({"results": results}, status=status.HTTP_200_OK)
