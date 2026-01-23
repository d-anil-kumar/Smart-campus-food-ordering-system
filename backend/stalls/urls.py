from django.urls import path
from .views import StallListViews, StallMenuItemListView
urlpatterns = [
    path('', StallListViews.as_view()),
    path('<int:stall_id>/menu/', StallMenuItemListView.as_view())
]

