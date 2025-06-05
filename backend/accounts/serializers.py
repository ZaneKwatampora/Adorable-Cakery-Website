from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'phone', 'full_name', 'email', 'address', 'spending_total', 'is_admin']

    def get_is_admin(self, obj):
        return obj.is_staff         