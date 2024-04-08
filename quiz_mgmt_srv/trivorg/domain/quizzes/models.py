from django.db import models
from django.contrib.auth.models import User


class Quiz(models.Model):
    quiz_name = models.CharField(max_length=100)
    description = models.TextField()
    category = models.ForeignKey('categories.Category', on_delete=models.CASCADE)
    team_limit = models.IntegerField()
    quiz_date = models.DateField()
    is_completed = models.BooleanField(default=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.quiz_name
