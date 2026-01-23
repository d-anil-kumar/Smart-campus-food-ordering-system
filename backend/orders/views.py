from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework import status
from users.permissions import IsStudent, IsVendor
from .models import Order, OrderItem
from .serializers import OrderCreateSerializer,OrderSerializer, VendorOrderSerializer
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
    


class VendorOrdersView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        try:
            stall = request.user.stall
        except Stall.DoesNotExist:
            return Response(
                {"detail": "Stall not found for this vendor"},
                status=status.HTTP_404_NOT_FOUND
            )

        orders = (
            Order.objects.filter(stall=stall)
            .prefetch_related("items", "items__menu_item")
            .order_by("-created_at")
        )

        serializer = VendorOrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class UpdateOrderStatusView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def patch(self, request, order_id):
        try:
            stall = request.user.stall
        except Stall.DoesNotExist:
            return Response({"detail": "Stall not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            order = Order.objects.get(id=order_id, stall=stall)
        except Order.DoesNotExist:
            return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get("status")
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response(
                {"detail": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()

        return Response(VendorOrderSerializer(order).data, status=status.HTTP_200_OK)