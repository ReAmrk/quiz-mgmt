from rest_framework import serializers


class CustomRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    firstName = serializers.CharField()
    lastName = serializers.CharField()