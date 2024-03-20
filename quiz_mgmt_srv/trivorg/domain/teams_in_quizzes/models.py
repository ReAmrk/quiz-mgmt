from django.contrib.auth.models import User
from django.db import models


class TeamInQuiz(models.Model):
    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE)
    quiz = models.ForeignKey('quizzes.Quiz', on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.team.team_name + ' in ' + self.quiz.quiz_name