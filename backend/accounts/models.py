from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    phone = models.CharField(max_length=20, unique=True)
    full_name = models.CharField(max_length=100)
    address = models.TextField()
    spending_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['phone', 'full_name', 'email', 'address']
