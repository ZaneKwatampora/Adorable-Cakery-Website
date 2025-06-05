# notifications/utils.py
from django.core.mail import send_mail
from django.conf import settings
from notifications.models import Notification

def create_order_status_notification(order):
    user = order.user
    email = user.email

    # Get product summary
    products = ", ".join([f"{item.product.name} x{item.quantity}" for item in order.order_items.all()])

    # Create in-app notification
    Notification.objects.create(
        user=user,
        title="Order Status Updated",
        message=f"Your order for {products} is now '{order.status}'.",
        type='order'
    )

    # Send email notification
    if email:
        subject = f"Order #{order.id} Update – Now '{order.status}'"
        message = (
            f"Hi {user.full_name},\n\n"
            f"Your order #{order.id} for {products} has been updated to: {order.status}.\n\n"
            "Thank you for ordering with Adorable Cakery!\n\n"
            "Best,\n"
            "Adorable Cakery Team"
        )

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=True,
        )
