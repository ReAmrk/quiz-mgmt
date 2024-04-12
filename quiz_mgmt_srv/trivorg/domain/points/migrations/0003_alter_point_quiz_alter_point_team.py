# Generated by Django 5.0.1 on 2024-04-08 13:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('points', '0002_point_created_by'),
        ('quizzes', '0006_quiz_is_completed'),
        ('teams', '0002_alter_team_created_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='point',
            name='quiz',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='quizzes.quiz'),
        ),
        migrations.AlterField(
            model_name='point',
            name='team',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='teams.team'),
        ),
    ]
