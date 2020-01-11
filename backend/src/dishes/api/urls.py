from django.urls import path

from .views import (
    DishesDetailView,
    DishesListView,
    UserReviewsListView,
    UserDetailView,
    UserCreateView,
    UserUpdateView,
    GiftListView
)

urlpatterns = [
    path('', DishesListView.as_view()),
    path('<pk>', DishesDetailView.as_view()),
    path('userreviews/<pk>/', UserReviewsListView.as_view()),
    path('user/<pk>/', UserDetailView.as_view()),
    path('createuser/', UserCreateView.as_view()),
    path('updateuser/<pk>/', UserUpdateView.as_view()),
    path('usergifts/<pk>/', GiftListView.as_view())
]