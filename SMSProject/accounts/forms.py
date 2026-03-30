from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import AuthenticationForm

from django.contrib.auth.models import User
from .models import UserProfile

DEPARTMENTS = [
    ('cse', 'Computer Science'),
    ('ise', 'Information Science'),
    ('ece', 'Electronics & Communication'),
    ('eee', 'Electrical & Electronics'),
    ('mechanical', 'Mechanical'),
    ('civil', 'Civil'),
]

class RegisterForm(forms.Form):
    full_name = forms.CharField(max_length=100, label='Full Name', required=True)
    email = forms.EmailField(label='Email', required=True)
    department = forms.ChoiceField(choices=DEPARTMENTS, label='Department', required=True)
    password = forms.CharField(widget=forms.PasswordInput, label='Password', min_length=8, required=True)
    confirm_password = forms.CharField(widget=forms.PasswordInput, label='Confirm Password', required=True)

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("A user with this email already exists.")
        return email

    def clean_password(self):
        password = self.cleaned_data.get('password')
        if len(password) < 8:
            raise forms.ValidationError("Password must be at least 8 characters long.")
        return password

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')

        if password and confirm_password and password != confirm_password:
            raise forms.ValidationError("Passwords do not match.")
        return cleaned_data

class LoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].label = 'USN'
        self.fields['username'].widget.attrs.update({'placeholder': 'Enter your USN'})
        self.fields['password'].widget.attrs.update({'placeholder': 'Enter your password'})
        self.remember_me = forms.BooleanField(required=False, label='Remember me')
