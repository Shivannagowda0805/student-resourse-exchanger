from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from .models import Resource
from .forms import ResourceUploadForm

@login_required
def resource_list(request):
    resources = Resource.objects.filter(is_approved=True)
    resource_type = request.GET.get('type')
    subject = request.GET.get('subject')

    if resource_type:
        resources = resources.filter(resource_type=resource_type)
    if subject:
        resources = resources.filter(subject__icontains=subject)

    paginator = Paginator(resources, 12)  # 12 resources per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'resource_types': Resource.RESOURCE_TYPES,
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

@login_required
def resource_detail(request, pk):
    resource = get_object_or_404(Resource, pk=pk, is_approved=True)
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
