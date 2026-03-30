from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from .forms import RegisterForm, LoginForm

def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data['email'].split('@')[0],  # username from email prefix
                email=form.cleaned_data['email'],
                first_name=form.cleaned_data['full_name'],
                password=form.cleaned_data['password']
            )
            
            # Create UserProfile
            UserProfile.objects.create(
                user=user,
                department=form.cleaned_data['department']
            )
            
            user = authenticate(request, username=user.username, password=form.cleaned_data['password'])
            if user:
                login(request, user)
            messages.success(request, 'Registration successful! Welcome!')
            return redirect('home')
        else:
            messages.error(request, 'Registration failed. Please correct the errors.')
    else:
        form = RegisterForm()
    return render(request, 'accounts/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(data=request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                if request.POST.get('remember_me'):
                    request.session.set_expiry(60 * 60 * 24 * 30)
                else:
                    request.session.set_expiry(0)
                messages.success(request, 'Login successful!')
                return redirect('home')
            else:
                messages.error(request, 'Invalid USN/Email or password.')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = LoginForm()
    return render(request, 'accounts/login.html', {'form': form})

def logout_view(request):
    logout(request)
    messages.success(request, 'Logged out successfully!')
    return redirect('home')
