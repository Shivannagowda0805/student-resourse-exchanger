from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from .models import Resource
from .forms import ResourceUploadForm

def resource_list(request):
    resources = Resource.objects.filter(is_approved=True)
    category = request.GET.get('category')
    q = request.GET.get('q')  # search query
    price_min = request.GET.get('price_min')
    price_max = request.GET.get('price_max')
    conditions = request.GET.getlist('condition')
    location = request.GET.get('location')
    sort = request.GET.get('sort', 'newest')

    if category:
        resources = resources.filter(category=category)
    if q:
        resources = resources.filter(title__icontains=q) | resources.filter(description__icontains=q) | resources.filter(subject__icontains=q)
    if price_min:
        resources = resources.filter(price__gte=price_min)
    if price_max and price_max != '1000':
        resources = resources.filter(price__lte=price_max)
    if conditions:
        resources = resources.filter(condition__in=conditions)
    if location:
        # Assuming location is campus, but since no field, maybe filter by user profile or something
        pass
    if sort == 'price-low':
        resources = resources.order_by('price')
    elif sort == 'relevant':
        # For now, same as newest
        pass
    else:
        resources = resources.order_by('-uploaded_at')

    paginator = Paginator(resources, 12)  # 12 resources per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'categories': Resource.CATEGORY_CHOICES,
    }
    return render(request, 'resources/resource_list.html', context)

@login_required
def upload_resource(request):
    if request.method == 'POST':
        form = ResourceUploadForm(request.POST, request.FILES)
        if form.is_valid():
            resource = form.save(commit=False)
            resource.uploaded_by = request.user
            resource.save()
            messages.success(request, 'Resource uploaded successfully!')
            return redirect('my_resources')
    else:
        form = ResourceUploadForm()
    return render(request, 'resources/upload.html', {'form': form})

@login_required
def my_resources(request):
    resources = Resource.objects.filter(uploaded_by=request.user)
    return render(request, 'resources/my_resources.html', {'resources': resources})

def resource_detail(request, pk):
    resource = get_object_or_404(Resource, pk=pk, is_approved=True)
    return render(request, 'resources/resource_detail.html', {'resource': resource})
    # Increment download count if user downloads
    if request.GET.get('download'):
        resource.downloads += 1
        resource.save()
    return render(request, 'resources/resource_detail.html', {'resource': resource})

@login_required
def delete_resource(request, pk):
    resource = get_object_or_404(Resource, pk=pk, uploaded_by=request.user)
    if request.method == 'POST':
        resource.delete()
        messages.success(request, 'Resource deleted successfully!')
        return redirect('my_resources')
    return render(request, 'resources/delete_confirm.html', {'resource': resource})
