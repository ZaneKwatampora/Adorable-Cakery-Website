# views.py
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, filters, generics, permissions, status
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework.exceptions import ValidationError

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'category__name', 'flavour__name']
    ordering_fields = ['price', 'created_at', 'kg']
    
    def get_queryset(self):
        queryset = Product.objects.all().order_by('-created_at')

        category = self.request.query_params.get('category')
        flavour = self.request.query_params.get('flavour')
        is_special = self.request.query_params.get('is_special')

        if category and category.lower() != 'all':
            queryset = queryset.filter(category__name__iexact=category)

        if flavour and flavour.lower() != 'all':
            queryset = queryset.filter(flavour__name__iexact=flavour)

        if is_special is not None:
            # Convert string to boolean
            is_special_bool = is_special.lower() == 'true'
            queryset = queryset.filter(is_special=is_special_bool)

        return queryset
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticatedOrReadOnly()]

class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def get_queryset(self):
        queryset = ProductVariant.objects.all()
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product__id=product_id)
        return queryset



class ReviewListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return Review.objects.filter(product_id=product_id)

    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']
        product = get_object_or_404(Product, id=product_id)
        serializer.save(user=self.request.user, product=product)


class ReviewDetailAPIView(generics.RetrieveUpdateDestroyAPIView): 
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def perform_update(self, serializer):
        if self.request.user != self.get_object().user:
            raise permissions.PermissionDenied("You can only update your own review.")
        serializer.save()

class FlavourViewSet(viewsets.ModelViewSet):
    queryset = Flavour.objects.all()
    serializer_class = FlavourSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]