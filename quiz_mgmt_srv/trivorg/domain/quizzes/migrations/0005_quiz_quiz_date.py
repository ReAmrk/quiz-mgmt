# Generated by Django 5.0.1 on 2024-04-08 06:46

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('quizzes', '0004_quiz_team_limit'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='quiz_date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
