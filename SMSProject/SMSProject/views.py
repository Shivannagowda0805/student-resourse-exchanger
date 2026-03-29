from django.shortcuts import render
from resources.models import Resource

def home(request):
    featured_resources = Resource.objects.filter(is_approved=True).order_by('-uploaded_at')[:6]  # Get latest 6 resources
    context = {
        'featured_resources': featured_resources,
    }
    return render(request, 'home.html', context)