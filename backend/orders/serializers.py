from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import OrderItem, Order

class OrderItemInputSerializer(serializers.Serializer):
    menu_item_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    stall_id = serializers.IntegerField()
    items = OrderItemInputSerializer(many=True)

    def validate(self, data):
        if not data["items"]:
            raise serializers.ValidationError(
                "Order must contain at least one item."
            )
        return data

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(
        source="menu_item.name",
        read_only=True
    )

    class Meta:
        model = OrderItem
        fields = [
            "menu_item_name",
            "quantity",
            "price_at_order_time",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    stall_name = serializers.CharField(
        source="stall.name",
        read_only=True
    )
    
    class Meta:
        model = Order
        fields = [
            "id",
            "stall_name",
            "status",
            "created_at",
            "items",
        ]



class VendorOrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source="menu_item.name", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "menu_item_name",
            "quantity",
            "price_at_order_time",
        ]


class VendorOrderSerializer(serializers.ModelSerializer):
    items = VendorOrderItemSerializer(many=True, read_only=True)
    stall_name = serializers.CharField(source="stall.name", read_only=True)
    student_username = serializers.CharField(source="student.username", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "student_username",
            "stall_name",
            "status",
            "created_at",
            "items",
        ]

