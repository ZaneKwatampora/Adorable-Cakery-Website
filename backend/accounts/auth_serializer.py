# accounts/auth_serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import User

class FullNameTokenObtainPairSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        'no_active_account': 'Invalid full name or password'
    }

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['full_name'] = user.full_name
        token['is_admin'] = user.is_superuser  # or user.is_superuser depending on your logic
        return token

    def validate(self, attrs):
        full_name = attrs.get('username') or attrs.get('full_name')
        password  = attrs.get('password')

        # look up the actual user by full_name
        try:
            user_obj = User.objects.get(full_name=full_name)
            username_for_auth = user_obj.username
        except User.DoesNotExist:
            raise self.fail('no_active_account')

        # authenticate as usual (username + password)
        authenticated_user = authenticate(username=username_for_auth, password=password)

        if not authenticated_user:
            raise self.fail('no_active_account')

        return super().validate({'username': username_for_auth, 'password': password})
