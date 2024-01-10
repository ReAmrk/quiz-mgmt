from django.contrib.auth.models import User
from django.db import models


class QuestionCategory(models.Model):
    category_name = models.CharField(max_length=200)
    category_description = models.CharField(max_length=200)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    question_answer = models.CharField(max_length=200)
    question_points = models.IntegerField(default=0)
    question_difficulty = models.IntegerField(default=0)
    question_category = models.ForeignKey(QuestionCategory, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)


class Quiz(models.Model):
    quiz_name = models.CharField(max_length=200)
    quiz_description = models.CharField(max_length=200)
    quiz_category = models.ForeignKey(QuestionCategory, on_delete=models.CASCADE)
    quiz_questions = models.ManyToManyField(Question)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)