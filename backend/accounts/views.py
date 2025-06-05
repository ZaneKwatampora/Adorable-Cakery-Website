from django.utils.text import slugify
import random, string
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.urls import reverse
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from .models import User
from .serializers import UserSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class SpendingSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({"spending_total": request.user.spending_total})

class RegisterView(APIView):
    """
    Registers a user WITHOUT asking for an explicit username.
    A unique username is auto-generated from full_name.
    """

    def post(self, request):
        data = request.data
        full_name = (data.get('full_name') or '').strip()

        if not full_name:
            return Response({'error': 'Full name is required'}, status=400)

        # ---------- E-MAIL checks ----------
        email = data.get('email', '').strip()
        try:
            validate_email(email)
        except ValidationError:
            return Response({'error': 'Invalid email address'}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already in use'}, status=400)

        # ---------- PHONE checks ----------
        phone = data.get('phone', '').strip()
        if User.objects.filter(phone=phone).exists():
            return Response({'error': 'Phone number already in use'}, status=400)

        # ---------- AUTO-GENERATE USERNAME ----------
        base_slug = slugify(full_name) or "user"
        username = base_slug
        while User.objects.filter(username=username).exists():
            suffix = ''.join(random.choices(string.digits, k=3))
            username = f"{base_slug}{suffix}"

        # ---------- CREATE inactive USER ----------
        user = User.objects.create_user(
            username=username,
            password=data.get('password'),
            email=email,
            phone=phone,
            full_name=full_name,
            is_active=False
        )

        # ---------- E-MAIL VERIFICATION ----------
        token = default_token_generator.make_token(user)
        verification_url = request.build_absolute_uri(
            reverse('verify-email', kwargs={'uid': user.pk, 'token': token})
        )
        send_mail(
            subject='Verify your email address',
            message=f'Please verify your email by clicking the link: {verification_url}',
            from_email='no-reply@yourdomain.com',
            recipient_list=[email],
            fail_silently=False,
        )

        return Response(
            {'message': 'User created successfully. Please verify your email.'},
            status=status.HTTP_201_CREATED
        )

class VerifyEmailView(APIView):
    def get(self, request, uid, token):
        user = get_object_or_404(User, pk=uid)

        if user.is_active:
            return Response({'message': 'Account already activated.'}, status=200)

        if default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'message': 'Email verified successfully! You can now log in.'}, status=200)

        return Response({'error': 'Invalid or expired token.'}, status=400)

class UserListView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
