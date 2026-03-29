from django import forms
from .models import Resource

class ResourceUploadForm(forms.ModelForm):
    class Meta:
        model = Resource
        fields = ['title', 'description', 'resource_type', 'file', 'url', 'subject', 'semester']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
        }