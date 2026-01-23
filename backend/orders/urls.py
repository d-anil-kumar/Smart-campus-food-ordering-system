from django.urls import path
from .views import PlaceOrderView, MyOrdersView

urlpatterns = [
    path('', PlaceOrderView.as_view()),
    path('my/', MyOrdersView.as_view()),
]