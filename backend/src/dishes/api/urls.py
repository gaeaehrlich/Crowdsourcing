from django.urls import path

from .views import DishesDetailView, DishesListView, RestaurantDetailView, RestaurantListView, \
    TagListView, CityAreaListView

urlpatterns = [
    path('dish/', DishesListView.as_view()),
    path('dish/<pk>', DishesDetailView.as_view()),
    path('rest/', RestaurantListView.as_view()),
    path('rest/<pk>', RestaurantDetailView.as_view()),
    path('tag/', TagListView.as_view()),
    path('cityarea/', CityAreaListView.as_view()),
]