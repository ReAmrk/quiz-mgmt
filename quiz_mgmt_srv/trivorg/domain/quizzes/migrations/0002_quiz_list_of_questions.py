# Generated by Django 5.0.1 on 2024-02-28 07:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0001_initial'),
        ('questions_in_quizzes', '0001_initial'),
        ('quizzes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='list_of_questions',
            field=models.ManyToManyField(through='questions_in_quizzes.QuestionInQuiz', to='questions.question'),
        ),
    ]
