from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('categories', CategoryViewSet)
router.register('products', ProductViewSet)
router.register('variants', ProductVariantViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('products/<int:product_id>/reviews/', ReviewListCreateAPIView.as_view(), name='product-reviews'),
    path('reviews/<int:pk>/', ReviewDetailAPIView.as_view(), name='review-detail'),  # admin view/delete
]
