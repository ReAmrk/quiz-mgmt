from django.contrib.auth.models import AbstractUser
from django.db import models


class Question(models.Model):
    question_text = models.CharField(max_length=256)
    question_answer = models.CharField(max_length=256)


