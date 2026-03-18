from django import forms
from .models import ContactMessage


class ContactForm(forms.ModelForm):
    """Formulario de contacto — se muestra como diálogo de Windows 95."""

    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'company', 'message']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'win95-input', 'placeholder': 'Tu nombre'}),
            'email': forms.EmailInput(attrs={'class': 'win95-input', 'placeholder': 'tu@email.com'}),
            'company': forms.TextInput(attrs={'class': 'win95-input', 'placeholder': 'Tu empresa (opcional)'}),
            'message': forms.Textarea(attrs={'class': 'win95-input', 'rows': 5, 'placeholder': 'Cuéntame sobre tu proyecto...'}),
        }
