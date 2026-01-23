from django.db import models
from django.contrib.auth.models import User
from stalls.models import Stall, MenuItem

class Order(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("ACCEPTED", "Accepted"),
        ("PREPARING", "Preparing"),
        ("READY", "Ready"),
        ("COMPLETED", "Completed"),
    ]
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders"
    )
    stall = models.ForeignKey(
        Stall,
        on_delete=models.CASCADE,
        related_name="orders"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="PENDING"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id}"

class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )
    menu_item = models.ForeignKey(
        MenuItem,
        on_delete=models.CASCADE
    )
    quantity = models.PositiveIntegerField()
    price_at_order_time = models.DecimalField(
        max_digits=6,
        decimal_places=2
    )

    def __str__(self):
        return f"{self.menu_item.name} x {self.quantity}"
