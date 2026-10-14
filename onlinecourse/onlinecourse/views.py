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