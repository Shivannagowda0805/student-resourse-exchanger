from django import forms
from .models import Resource

class ResourceUploadForm(forms.ModelForm):
    class Meta:
        model = Resource
        fields = ['title', 'description', 'category', 'price', 'condition', 'exchange_only', 'image', 'file', 'url', 'subject', 'semester']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
        }