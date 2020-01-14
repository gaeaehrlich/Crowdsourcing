from django.urls import path

from .views import (
    DishesDetailView,
    DishesListView,
    UserReviewsListView,
    UserDetailView,
    UserCreateView,
    UserUpdateView,
    GiftListView,
    TagListView,
    RestaurantDetailView,
    RestaurantListView

)

urlpatterns = [
    path('userreviews/<pk>/', UserReviewsListView.as_view()),
    path('user/<pk>/', UserDetailView.as_view()),
    path('createuser/', UserCreateView.as_view()),
    path('updateuser/<pk>/', UserUpdateView.as_view()),
    path('usergifts/<pk>/', GiftListView.as_view()),
    path('tags/', TagListView.as_view())
    path('dish/', DishesListView.as_view()),
    path('dish/<pk>', DishesDetailView.as_view()),
    path('rest/', RestaurantListView.as_view()),
    path('rest/<pk>', RestaurantDetailView.as_view()),
]