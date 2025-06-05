# accounts/auth_views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from .auth_serializer import FullNameTokenObtainPairSerializer

class FullNameTokenObtainPairView(TokenObtainPairView):
    serializer_class = FullNameTokenObtainPairSerializer