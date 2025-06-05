from django.db import models
from django.conf import settings
from products.models import Product
from django.db.models import Sum, F
from django.core.validators import MinValueValidator
from django.utils import timezone
from decimal import Decimal

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('paid', 'Paid'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]

    PAYMENT_METHODS = [
        ('mpesa', 'M-Pesa'),
        ('paypal', 'PayPal'),
        ('cod', 'Cash on Delivery'),
    ]
    
    DELIVERY_CHOICES = [
        ('UBER', 'Uber'),
        ('PICKUP', 'Pickup'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='OrderProduct')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(null=True, blank=True)
    mpesa_checkout_request_id = models.CharField(max_length=100, blank=True, null=True)
    mpesa_merchant_request_id = models.CharField(max_length=100, blank=True, null=True)
    mpesa_receipt_number = models.CharField(max_length=100, blank=True, null=True)
    payment_status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('failed', 'Failed')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    address = models.CharField(max_length=255, blank=True)
    delivery_method = models.CharField(
        max_length=10,
        choices=DELIVERY_CHOICES,
        default='UBER'
    )

    def __str__(self):
        return f"Order #{self.pk} by {self.user}"

    def calculate_total(self):
        if self.pk:
            self.total_price = self.order_items.aggregate(
                total=Sum(F('quantity') * F('price_at_purchase'))
            )['total'] or 0
            self.save(update_fields=['total_price'])

    def save(self, *args, **kwargs):
        creating = not self.pk

        if self.status == 'paid':
            self.is_paid = True
            if not self.paid_at:
                self.paid_at = timezone.now()
        else:
            self.is_paid = False
            self.paid_at = None

        super().save(*args, **kwargs)

        if creating:
            self.calculate_total()

    def add_product(self, product, kg=1.0, quantity=1):
        price_per_kg = product.price / product.kg
        actual_price = round(price_per_kg * Decimal(kg), 2)

        OrderProduct.objects.create(
            order=self,
            product=product,
            quantity=quantity,
            kg=kg,
            price_at_purchase=actual_price
        )
        self.calculate_total()

class OrderProduct(models.Model):
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

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    kg = models.DecimalField(max_digits=3, decimal_places=1, choices=KG_CHOICES)
    price_at_purchase = models.DecimalField(max_digits=8, decimal_places=2)

    class Meta:
        unique_together = ('order', 'product', 'kg')
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'

    def __str__(self):
        return f"{self.quantity} x {self.product.name} ({self.kg}kg) @ {self.price_at_purchase}"

    def save(self, *args, **kwargs):
        if not self.pk and not self.price_at_purchase:
            price_per_kg = self.product.price / self.product.kg
            self.price_at_purchase = round(price_per_kg * self.kg, 2)
        super().save(*args, **kwargs)
        self.order.calculate_total()

    @property
    def item_total(self):
        return self.quantity * self.price_at_purchase
