from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework import status
from users.permissions import IsStudent
from .models import Order, OrderItem
from .serializers import OrderCreateSerializer,OrderSerializer
from stalls.models import Stall, MenuItem


class PlaceOrderView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        student = request.user

        stall_id = serializer.validated_data["stall_id"]
        items = serializer.validated_data["items"]

        stall = get_object_or_404(
            Stall,
            id=stall_id,
            is_active=True
        )

        order = Order.objects.create(
            student=student,
            stall=stall
        )

        total_price = 0

        for item in items:
            menu_item = get_object_or_404(
                MenuItem,
                id=item["menu_item_id"],
                stall=stall,
                is_available=True
            )

            quantity = item["quantity"]
            price = menu_item.price

            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=quantity,
                price_at_order_time=price
            )

            total_price += price * quantity

        return Response({
            "message": "Order placed successfully",
            "order_id": order.id,
            "total_price": total_price
        })
    

class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated, IsStudent]

    def get(self, request):
        orders = Order.objects.filter(student=request.user).order_by("created_at")
        serializer = OrderSerializer(orders, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)