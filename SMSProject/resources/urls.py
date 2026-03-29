from django.urls import path
from . import views

urlpatterns = [
    path('', views.resource_list, name='resource_list'),
    path('upload/', views.upload_resource, name='upload_resource'),
    path('my-resources/', views.my_resources, name='my_resources'),
    path('<int:pk>/', views.resource_detail, name='resource_detail'),
    path('<int:pk>/delete/', views.delete_resource, name='delete_resource'),
]