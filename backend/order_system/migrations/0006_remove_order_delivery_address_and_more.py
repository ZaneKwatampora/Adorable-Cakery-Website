# Generated by Django 5.2.1 on 2025-05-31 16:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('order_system', '0005_order_delivery_address_order_delivery_distance_km_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='delivery_address',
        ),
        migrations.RemoveField(
            model_name='order',
            name='delivery_distance_km',
        ),
        migrations.RemoveField(
            model_name='order',
            name='delivery_duration',
        ),
        migrations.RemoveField(
            model_name='order',
            name='delivery_fee',
        ),
        migrations.RemoveField(
            model_name='order',
            name='delivery_method',
        ),
    ]
