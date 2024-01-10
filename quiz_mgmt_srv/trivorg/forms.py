# quiz/forms.py
from django import forms
from .models import Quiz

class QuizForm(forms.ModelForm):
    class Meta:
        model = Quiz
        fields = ['quiz_name', 'quiz_description', 'quiz_category', 'quiz_questions']