from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('sobre-mi/', views.about, name='about'),
    path('contacto/', views.contact, name='contact'),
]
