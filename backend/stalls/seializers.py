from rest_framework import serializers
from .models import Stall, MenuItem


class StallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stall
        fields = [
            "id",
            "name",
            "description",
            "image",
            "is_active",
        ]

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = [
            "id",
            "name",
            "price",
            "is_available",
            "image",
        ]

class CreateStallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stall
        fields = [
            "name",
            "description",
            "image",
        ]

