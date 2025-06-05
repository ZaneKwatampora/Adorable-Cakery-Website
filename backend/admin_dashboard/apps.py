from django.apps import AppConfig


class AdminDashboardConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'admin_dashboard'

from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.utils.timezone import now

@receiver(user_logged_in)
def update_login_status(sender, user, request, **kwargs):
    user.has_logged_in = True
    user.last_login = now()
    user.save(update_fields=['has_logged_in', 'last_login'])