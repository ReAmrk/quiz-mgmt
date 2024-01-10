from django.db.models import Q
from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .forms import QuizForm
from .models import QuestionCategory, Question, Quiz
from .serializers import QuestionCategorySerializer, QuestionSerializer, QuizSerializer
from rest_framework.permissions import IsAuthenticated

class QuestionCategoryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_is_superuser = request.user.is_superuser
        if user_is_superuser:
            categories = QuestionCategory.objects.all()
        else:
            categories = QuestionCategory.objects.filter(created_by=request.user)
        serializer = QuestionCategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = QuestionCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuestionAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_is_superuser = request.user.is_superuser
        if user_is_superuser:
            questions = Question.objects.all()
        else:
            questions = Question.objects.filter(created_by=request.user)
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuizAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_is_superuser = request.user.is_superuser
        if user_is_superuser:
            quizzes = Quiz.objects.all().select_related('quiz_category')  # Eagerly load the category
        else:
            quizzes = Quiz.objects.filter(created_by=request.user).select_related('quiz_category')

        # Use prefetch_related to load the questions related to each quiz
        serializer = QuizSerializer(quizzes.prefetch_related('quiz_questions'), many=True)

        return Response(serializer.data)

    def post(self, request):
        serializer = QuizSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
