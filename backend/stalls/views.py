from django.shortcuts import render
from .models import Stall, MenuItem
from .seializers import StallSerializer, MenuItemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

class StallListViews(APIView):

    def get(self ,request):
        stalls = Stall.objects.filter(is_active = True)
        serializer = StallSerializer(stalls, many = True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class StallMenuItemListView(APIView):
    def get(self, request, stall_id):
        stall = get_object_or_404(Stall, id=stall_id, is_active=True)
        menu_items = MenuItem.objects.filter(
            stall = stall,
            is_available=True
        )
        serializer = MenuItemSerializer(menu_items, many=True)
        return Response(serializer.data)
