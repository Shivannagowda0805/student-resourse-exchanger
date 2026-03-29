from django.db import models
from django.contrib.auth.models import User

class Resource(models.Model):
    CATEGORY_CHOICES = [
        ('books', 'Books'),
        ('notes', 'Notes'),
        ('electronics', 'Electronics'),
        ('stationery', 'Stationery'),
        ('lab-materials', 'Lab Materials'),
        ('other', 'Other'),
    ]

    CONDITION_CHOICES = [
        ('new', 'New'),
        ('used', 'Used'),
        ('free', 'Free'),
        ('exchange', 'Exchange Only'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default='used')
    exchange_only = models.BooleanField(default=False)
    image = models.ImageField(upload_to='resource_images/', blank=True, null=True)
    file = models.FileField(upload_to='resources/', blank=True, null=True)
    url = models.URLField(blank=True, null=True)
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    subject = models.CharField(max_length=100, blank=True)
    semester = models.CharField(max_length=50, blank=True)
    downloads = models.PositiveIntegerField(default=0)
    is_approved = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-uploaded_at']
