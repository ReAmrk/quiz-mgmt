from django.db import models
from django.contrib.auth.models import User


class Participant(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    team = models.ForeignKey('teams.Team', on_delete=models.PROTECT)
    def __str__(self):
        return self.first_name + ' ' + self.last_name
