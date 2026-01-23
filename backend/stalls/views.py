from django.shortcuts import render
from .models import Stall, MenuItem
from .seializers import StallSerializer, MenuItemSerializer, CreateStallSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from users.permissions import IsVendor
from rest_framework.permissions import IsAuthenticated

class StallListViews(APIView):

    def get(self ,request):
        stalls = Stall.objects.filter(is_active = True)

        search = request.query_params.get("search")
        if search:
            stalls = stalls.filter(name__icontains=search)

        serializer = StallSerializer(stalls, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class StallMenuItemListView(APIView):
    def get(self, request, stall_id):
        stall = get_object_or_404(Stall, id=stall_id, is_active=True)
        menu_items = MenuItem.objects.filter(
            stall = stall,
            is_available=True
        )

        search = request.query_params.get("search")
        if search:
            menu_items = menu_items.filter(name__icontains=search)

        serializer = MenuItemSerializer(menu_items, many=True)
        return Response(serializer.data)

class CreateStallView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def post(self, request):
        if Stall.objects.filter(vendor=request.user).exists():
            return Response(
                {"message": "Vendor already has a stall."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CreateStallSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        stall = serializer.save(vendor=request.user)
        
        return Response(
            {
                "message": "Stall created successfully.",
                "stall_id": stall.id
            },
            status=status.HTTP_201_CREATED
        )
    
class VendorStallView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        try:
            stall = Stall.objects.get(vendor=request.user)
        except Stall.DoesNotExist:
            return Response(
                {"detail": "Stall not found for this vendor"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = StallSerializer(stall)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class MenuItemsView(APIView):
    permission_classes = [IsAuthenticated, IsVendor]

    def get(self, request):
        try:
            stall = request.user.stall
        except Stall.DoesNotExist:
            return Response(
                {"detail": "Stall not found for this vendor"},
                status=status.HTTP_404_NOT_FOUND
            )

        menu_items = MenuItem.objects.filter(stall=stall)
        serializer = MenuItemSerializer(menu_items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        try:
            stall = request.user.stall
        except Stall.DoesNotExist:
            return Response(
                {"detail": "Stall not found for this vendor"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = MenuItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        menu_item = serializer.save(stall=stall)

        return Response(
            {
                "message": "Menu-Item Added Successfully",
                "menu_item": MenuItemSerializer(menu_item).data
            },
            status=status.HTTP_201_CREATED
        )


    
        