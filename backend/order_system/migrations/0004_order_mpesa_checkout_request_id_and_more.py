# Generated by Django 5.2.1 on 2025-05-25 20:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order_system', '0003_order_total_price'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='mpesa_checkout_request_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='mpesa_merchant_request_id',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='mpesa_receipt_number',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='payment_status',
            field=models.CharField(choices=[('pending', 'Pending'), ('paid', 'Paid'), ('failed', 'Failed')], default='pending', max_length=20),
        ),
    ]
