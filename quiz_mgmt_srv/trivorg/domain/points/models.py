from django.db import models


class Point(models.Model):
    points = models.IntegerField()
    team = models.ForeignKey('teams.Team', on_delete=models.CASCADE)
    quiz = models.ForeignKey('quizzes.Quiz', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.points
