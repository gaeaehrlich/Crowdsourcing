from django.urls import path

from .views import (
    UserReviewsListView,
    UserDetailView,
    UserCreateView,
    UserUpdateView,
    GiftListView,
    ReviewCreateView,
    DishReviewsListView,
    ReviewUpdateView,

)
from .views import DishesDetailView, DishesListView, RestaurantDetailView, RestaurantListView, \
    TagListView, CityAreaListView, send_file, search, multiuploader, init_review, init_user, \
    search_eatwith, ReviewDetailView

urlpatterns = [
    path('review/<pk>/', ReviewDetailView.as_view()),
    path('updatereviews/<pk>/', ReviewUpdateView.as_view()),
    path('userreviews/<pk>/', UserReviewsListView.as_view()),
    path('dishreviews/<pk>/', DishReviewsListView.as_view()),
    path('createreview/', ReviewCreateView.as_view()),
    path('user/<pk>/', UserDetailView.as_view()),
    path('createuser/', UserCreateView.as_view()),
    path('updateuser/<pk>/', UserUpdateView.as_view()),
    path('usergifts/<pk>/', GiftListView.as_view()),
    path('dish/', DishesListView.as_view()),
    path('dish/<pk>', DishesDetailView.as_view()),
    path('rest/', RestaurantListView.as_view()),
    path('rest/<pk>', RestaurantDetailView.as_view()),
    path('tag/', TagListView.as_view()),
    path('cityarea/', CityAreaListView.as_view()),
    path(r'pic/<str:dish>', send_file),
    path(r'search/', search),
    path('uploadphoto/', multiuploader),
    path('init_user/', init_user),
    path('init_review/', init_review),
    path('search_eatwith/', search_eatwith),



]