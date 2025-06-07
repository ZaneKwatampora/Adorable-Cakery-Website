from rest_framework import serializers
from .models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'kg', 'price']

class FlavourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flavour
        fields = ['id', 'name']

class ProductSerializer(serializers.ModelSerializer):
    # Read-only nested display serializers:
    category = CategorySerializer(read_only=True)
    flavour = FlavourSerializer(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    flavour_display = serializers.SerializerMethodField()

    # Write-only fields for creating/updating by name:
    category_name = serializers.CharField(write_only=True)
    flavour_name = serializers.CharField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'image',
            'category', 'category_name',
            'flavour', 'flavour_name', 'flavour_display',
            'is_special', 'created_at', 'variants'
        ]

    def get_flavour_display(self, obj):
        return obj.flavour.name if obj.flavour else None

    def validate_category_name(self, value):
        try:
            category = Category.objects.get(name=value)
        except Category.DoesNotExist:
            raise serializers.ValidationError(f"Category with name '{value}' does not exist.")
        return category

    def validate_flavour_name(self, value):
        if value is None:
            return None
        try:
            flavour = Flavour.objects.get(name=value)
        except Flavour.DoesNotExist:
            raise serializers.ValidationError(f"Flavour with name '{value}' does not exist.")
        return flavour

    def create(self, validated_data):
        category = validated_data.pop('category_name')
        flavour = validated_data.pop('flavour_name', None)
        product = Product.objects.create(
            category=category,
            flavour=flavour,
            **validated_data
        )
        return product

    def update(self, instance, validated_data):
        category = validated_data.pop('category_name', None)
        flavour = validated_data.pop('flavour_name', None)
        if category:
            instance.category = category
        if flavour is not None:
            instance.flavour = flavour
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class ReviewSerializer(serializers.ModelSerializer):
    user_full_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'user_full_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'product', 'user', 'created_at', 'user_full_name']

