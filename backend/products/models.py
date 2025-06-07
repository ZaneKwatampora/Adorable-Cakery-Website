from django.db import models
from decimal import Decimal
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='product_images/')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    flavour = models.ForeignKey('Flavour', on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    is_special = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class ProductVariant(models.Model):
    KG_CHOICES = [
        (Decimal(0.5), '0.5 kg'),
        (Decimal(1.0), '1 kg'),
        (Decimal(1.5), '1.5 kg'),
        (Decimal(2.0), '2 kg'),
        (Decimal(2.5), '2.5 kg'),
        (Decimal(3.0), '3 kg'),
        (Decimal(3.5), '3.5 kg'),
        (Decimal(4.0), '4 kg'),
        (Decimal(4.5), '4.5 kg'),
        (Decimal(5.0), '5 kg'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    kg = models.DecimalField(max_digits=3, decimal_places=1, choices=KG_CHOICES)
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} - {self.kg} kg"
    
class Review(models.Model):
    product = models.ForeignKey('Product', related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('product', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.product} ({self.rating}⭐)"

class Flavour(models.Model):
    FLAVOUR_CHOICES = [
        ('classic', 'Classics'),
        ('chocolate', 'Chocolates'),
        ('fruity', 'Fruity'),
    ]
    
    name = models.CharField(max_length=20, choices=FLAVOUR_CHOICES, unique=True)

    def __str__(self):
        return self.get_name_display()
