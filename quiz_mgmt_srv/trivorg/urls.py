from django.urls import path
from .views import QuestionCategoryAPIView, QuestionAPIView, QuizAPIView

urlpatterns = [
    path('api/question-categories/', QuestionCategoryAPIView.as_view(), name='question-category-list'),
    path('api/questions/', QuestionAPIView.as_view(), name='question-list'),
    path('api/quizzes/', QuizAPIView.as_view(), name='quiz_list'),
]