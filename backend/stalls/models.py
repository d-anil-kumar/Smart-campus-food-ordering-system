from django.db import models
from django.contrib.auth.models import User


class Stall(models.Model):
    vendor = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="stall"
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="stall_images/")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    stall = models.ForeignKey(
        Stall,
        on_delete=models.CASCADE,
        related_name="menu_items"
    )
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    is_available = models.BooleanField(default=True)
    image = models.ImageField(upload_to="menu_items/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.stall.name}"
    