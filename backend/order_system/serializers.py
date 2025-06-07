from rest_framework import serializers
from .models import Order, OrderProduct
from products.models import Product, ProductVariant
from decimal import Decimal


class OrderProductSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=8, decimal_places=2, read_only=True)
    price_at_purchase = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)
    item_total = serializers.SerializerMethodField()
    kg = serializers.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        model = OrderProduct
        fields = [
            'product', 'product_name', 'product_price',
            'kg', 'quantity', 'price_at_purchase', 'item_total'
        ]
        read_only_fields = [
            'product_name', 'product_price',
            'price_at_purchase', 'item_total'
        ]

    def get_item_total(self, obj):
        return obj.quantity * obj.price_at_purchase

    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError("Quantity must be at least 1.")
        return value

    def validate(self, data):
        product = data['product']
        kg = data.get('kg')

        if not ProductVariant.objects.filter(product=product, kg=kg).exists():
            raise serializers.ValidationError(f"{kg}kg variant for {product.name} is not available.")
        return data


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderProductSerializer(many=True)
    address = serializers.CharField(required=True)
    delivery_method = serializers.ChoiceField(choices=[('UBER', 'Uber'), ('PICKUP', 'Pickup')], required=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'user', 'order_items', 'total_price', 'status',
            'payment_method', 'delivery_method', 'is_paid',
            'paid_at', 'created_at', 'address'
        ]
        read_only_fields = [
            'id', 'order_id', 'user', 'status', 'is_paid',
            'paid_at', 'created_at', 'total_price'
        ]

    def validate(self, data):
        delivery_method = data.get('delivery_method')
        address = data.get('address')
        order_items = data.get('order_items')

        if not order_items:
            raise serializers.ValidationError("Order must contain at least one item.")

        if delivery_method == 'UBER':
            if not address:
                raise serializers.ValidationError("Address is required for Uber delivery.")
        elif delivery_method == 'PICKUP':
            data['address'] = ''
        else:
            raise serializers.ValidationError("Invalid delivery method.")

        return data


    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items')
        user = validated_data.pop('user')
        order = Order.objects.create(user=user, **validated_data)

        total = Decimal('0.00')
        for item in order_items_data:
            product = item['product']
            kg = item['kg']
            quantity = item['quantity']
            try:
                variant = ProductVariant.objects.get(product=product, kg=kg)
            except ProductVariant.DoesNotExist:
                raise serializers.ValidationError(f"{kg}kg variant for {product.name} not found.")

            price = variant.price

            OrderProduct.objects.create(
                order=order,
                product=product,
                kg=kg,
                quantity=quantity,
                price_at_purchase=price
            )

            total += quantity * price

        order.total_price = total
        order.save()
        return order
