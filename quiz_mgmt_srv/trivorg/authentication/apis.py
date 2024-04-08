from django.contrib.auth.models import User
from ninja_jwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .serializers import CustomRegistrationSerializer


class HomeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user_name = request.user.username  # Get the username of the logged-in user
        user_role = request.user.is_superuser
        content = {'message': f'Welcome, {user_name}'}

        return Response(content)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class CustomRegistrationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CustomRegistrationSerializer(data=request.data)

        if serializer.is_valid():
            # Perform registration logic here
            # Access the validated data using serializer.validated_data
            # For example: username = serializer.validated_data['username']
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            first_name = serializer.validated_data['firstName']
            last_name = serializer.validated_data['lastName']
            print(first_name + " " + last_name)

            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username is already taken'}, status=status.HTTP_400_BAD_REQUEST)

            User.objects.create_user(username=username,
                                     password=password,
                                     first_name=first_name,
                                     last_name=last_name)

            return Response({'message': 'Registration successful'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
