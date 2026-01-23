from django.urls import path
from .views import PlaceOrderView, MyOrdersView, VendorOrdersView, UpdateOrderStatusView

urlpatterns = [
    path('', PlaceOrderView.as_view()),
    path('my/', MyOrdersView.as_view()),
    path('orders/', VendorOrdersView.as_view()),
    path("<int:order_id>/", UpdateOrderStatusView.as_view(), name="update-order-status"),
]