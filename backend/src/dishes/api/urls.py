from django.urls import path

from .views import DishesDetailView, DishesListView

urlpatterns = [
    path('', DishesListView.as_view()),
    path('<pk>', DishesDetailView.as_view()),
]