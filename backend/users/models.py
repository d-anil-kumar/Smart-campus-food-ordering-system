from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ("STUDENT", "Student"),
        ("VENDOR", "Vendor"),
    ]
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
    
