from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_verified = models.BooleanField(default=False)

    def get_initials(self):
        name_parts = self.user.get_full_name().split()
        if name_parts:
            return ''.join([part[0].upper() for part in name_parts[:2]])
        return self.user.username[0].upper()

    def get_full_name(self):
        return self.user.get_full_name() or self.user.username
