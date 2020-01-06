from django.urls import path

from .views import DishesDetailView, DishesListView

urlpatterns = [
    path('dish/', DishesListView.as_view()),
    path('dish/<pk>', DishesDetailView.as_view()),
]