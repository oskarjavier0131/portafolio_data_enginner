from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Service, Skill, Project, Certification
from .forms import ContactForm
from blog.models import Post


def home(request):
    services = Service.objects.filter(is_active=True)[:6]
    projects = Project.objects.filter(is_featured=True)[:4]
    certifications = Certification.objects.all()
    latest_posts = Post.objects.filter(status='published')[:3]
    return render(request, 'core/home.html', {
        'services': services,
        'projects': projects,
        'certifications': certifications,
        'latest_posts': latest_posts,
    })


def about(request):
    skills = Skill.objects.all()
    skills_by_category = {}
    for skill in skills:
        skills_by_category.setdefault(skill.get_category_display(), []).append(skill)
    return render(request, 'core/about.html', {
        'skills_by_category': skills_by_category,
        'default_langs': ['Python', 'PySpark', 'SQL', 'JavaScript'],
        'default_cloud': ['Azure Databricks', 'Microsoft Fabric', 'Azure DevOps', 'Django'],
    })


def services(request):
    service_list = Service.objects.filter(is_active=True)
    return render(request, 'core/services.html', {'services': service_list})


def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, '¡Mensaje enviado! Te responderé pronto.')
            return redirect('contact')
    else:
        form = ContactForm()
    return render(request, 'core/contact.html', {'form': form})
