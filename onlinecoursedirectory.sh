#!/bin/bash

# Klasör yapısını oluştur
mkdir -p onlinecourse/onlinecourse
mkdir -p onlinecourse/templates/onlinecourse

# Django Root Files
cat << 'EOF' > onlinecourse/manage.py
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'onlinecourse.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
EOF

# Core App Configuration Files
touch onlinecourse/onlinecourse/__init__.py

cat << 'EOF' > onlinecourse/onlinecourse/apps.py
from django.apps import AppConfig

class OnlinecourseConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'onlinecourse'
EOF

cat << 'EOF' > onlinecourse/onlinecourse/models.py
from django.db import models
from django.conf import settings
from django.utils.timezone import now

class Course(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

class Lesson(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class Question(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    question_text = models.CharField(max_length=500)
    grade = models.IntegerField(default=1)

    def __str__(self):
        return self.question_text

    def is_get_score(self, selected_ids):
        all_answers = self.choice_set.all()
        correct_ids = set(all_answers.filter(is_correct=True).values_list('id', flat=True))
        selected_set = set(selected_ids)
        return correct_ids == selected_set

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.choice_text

class Submission(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    choices = models.ManyToManyField(Choice)
EOF

cat << 'EOF' > onlinecourse/onlinecourse/admin.py
from django.contrib import admin
from .models import Course, Lesson, Question, Choice, Submission

class LessonInline(admin.StackedInline):
    model = Lesson
    extra = 5

class ChoiceInline(admin.StackedInline):
    model = Choice
    extra = 4

class QuestionInline(admin.StackedInline):
    model = Question
    extra = 2

class CourseAdmin(admin.ModelAdmin):
    inlines = [LessonInline]
    list_display = ('name', 'description')

class LessonAdmin(admin.ModelAdmin):
    list_display = ['title']

class QuestionAdmin(admin.ModelAdmin):
    inlines = [ChoiceInline]
    list_display = ['question_text', 'course', 'grade']

admin.site.register(Course, CourseAdmin)
admin.site.register(Lesson, LessonAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Choice)
admin.site.register(Submission)
EOF

cat << 'EOF' > onlinecourse/onlinecourse/urls.py
from django.urls import path
from . import views

app_name = 'onlinecourse'

urlpatterns = [
    path('<int:pk>/', views.CourseDetailView.as_view(), name='course_details'),
    path('<int:course_id>/submit/', views.submit, name='submit'),
    path('submission/<int:submission_id>/result/', views.show_exam_result, name='show_exam_result'),
]
EOF

cat << 'EOF' > onlinecourse/onlinecourse/views.py
from django.shortcuts import render, get_object_or_404, redirect
from django.views import generic
from .models import Course, Question, Choice, Submission

class CourseDetailView(generic.DetailView):
    model = Course
    template_name = 'onlinecourse/course_details_bootstrap.html'

def submit(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    if request.method == 'POST':
        selected_choice_ids = [int(id) for id in request.POST.getlist('choice')]
        submission = Submission.objects.create(user=request.user)
        selected_choices = Choice.objects.filter(id__in=selected_choice_ids)
        submission.choices.set(selected_choices)
        submission.save()
        return redirect('onlinecourse:show_exam_result', submission_id=submission.id)
    return redirect('onlinecourse:course_details', pk=course_id)

def show_exam_result(request, submission_id):
    submission = get_object_or_404(Submission, pk=submission_id)
    selected_choices = submission.choices.all()
    selected_ids = [choice.id for choice in selected_choices]
    
    questions = Question.objects.filter(choice__in=selected_choices).distinct()
    if not questions.exists():
        questions = Question.objects.all()

    total_score = 0
    max_score = 0

    for question in questions:
        max_score += question.grade
        if question.is_get_score(selected_ids):
            total_score += question.grade

    grade = int((total_score / max_score) * 100) if max_score > 0 else 0

    context = {
        'submission': submission,
        'selected_ids': selected_ids,
        'total_score': total_score,
        'max_score': max_score,
        'grade': grade,
        'questions': questions
    }
    return render(request, 'onlinecourse/exam_result_bootstrap.html', context)
EOF

# HTML Templates
cat << 'EOF' > onlinecourse/templates/onlinecourse/course_details_bootstrap.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ course.name }}</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
<div class="container mt-4">
    <h2>{{ course.name }}</h2>
    <p>{{ course.description }}</p>

    <h3>Lessons</h3>
    <ul class="list-group mb-4">
        {% for lesson in course.lesson_set.all %}
            <li class="list-group-item">
                <h5>{{ lesson.title }}</h5>
                <p>{{ lesson.content }}</p>
            </li>
        {% endfor %}
    </ul>

    <h3>Exam</h3>
    <form action="{% url 'onlinecourse:submit' course.id %}" method="post">
        {% csrf_token %}
        {% for question in course.question_set.all %}
            <div class="card mb-3">
                <div class="card-header">
                    <strong>{{ question.question_text }}</strong> ({{ question.grade }} pts)
                </div>
                <div class="card-body">
                    {% for choice in question.choice_set.all %}
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="choice" value="{{ choice.id }}" id="choice_{{ choice.id }}">
                            <label class="form-check-label" for="choice_{{ choice.id }}">
                                {{ choice.choice_text }}
                            </label>
                        </div>
                    {% endfor %}
                </div>
            </div>
        {% endfor %}
        <button type="submit" class="btn btn-primary mb-5">Submit Exam</button>
    </form>
</div>
</body>
</html>
EOF

cat << 'EOF' > onlinecourse/templates/onlinecourse/exam_result_bootstrap.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Exam Result</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>
<div class="container mt-4">
    {% if grade >= 80 %}
        <div class="alert alert-success" role="alert">
            Congratulations! You passed the exam with a score of {{ grade }}% ({{ total_score }}/{{ max_score }} pts).
        </div>
    {% else %}
        <div class="alert alert-danger" role="alert">
            Failed. Your score is {{ grade }}% ({{ total_score }}/{{ max_score }} pts). Please try again.
        </div>
    {% endif %}

    <h3>Exam Results Details</h3>
    {% for question in questions %}
        <div class="card mb-3">
            <div class="card-header">
                <strong>{{ question.question_text }}</strong>
            </div>
            <div class="card-body">
                {% for choice in question.choice_set.all %}
                    <div class="p-2 mb-1 rounded {% if choice.is_correct %}bg-success text-white{% elif choice.id in selected_ids %}bg-danger text-white{% else %}bg-light{% endif %}">
                        {{ choice.choice_text }}
                        {% if choice.is_correct %}
                            <strong>(Correct Answer)</strong>
                        {% endif %}
                        {% if choice.id in selected_ids %}
                            <strong>(Your Choice)</strong>
                        {% endif %}
                    </div>
                {% endfor %}
            </div>
        </div>
    {% endfor %}
</div>
</body>
</html>
EOF

echo "Tüm klasör yapısı ve dosyalar başarıyla oluşturuldu."