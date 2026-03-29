from django.db import models
from django.contrib.auth.models import User

class Resource(models.Model):
    RESOURCE_TYPES = [
        ('notes', 'Notes'),
        ('assignment', 'Assignment'),
        ('presentation', 'Presentation'),
        ('book', 'Book'),
        ('other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES, default='notes')
    file = models.FileField(upload_to='resources/', blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    subject = models.CharField(max_length=100, blank=True)
    semester = models.CharField(max_length=50, blank=True)
    downloads = models.PositiveIntegerField(default=0)
    is_approved = models.BooleanField(default=True)  # For moderation

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-uploaded_at']
