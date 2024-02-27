from django.contrib.auth.models import User
from django.db import models


class Question(models.Model):
    question = models.TextField()
    answer = models.TextField()
    difficulty = models.IntegerField()
    points = models.IntegerField()
    category = models.ForeignKey('categories.Category', on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.question
