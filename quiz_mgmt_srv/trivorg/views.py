from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def home(request):
    return Response({'message': 'This is the main page of TrivOrg, the best Trivia Management Site'})
# Create your views here.
