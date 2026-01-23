from django.urls import path
from .views import StallListViews, StallMenuItemListView, CreateStallView, VendorStallView, MenuItemsView
urlpatterns = [
    path('', StallListViews.as_view()),
    path('<int:stall_id>/menu/', StallMenuItemListView.as_view()),
    path('create-stall/', CreateStallView.as_view()),
    path('my/', VendorStallView.as_view()),
    path('menu/', MenuItemsView.as_view())
]

