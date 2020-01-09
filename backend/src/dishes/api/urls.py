from django.urls import path

from .views import DishesDetailView, DishesListView, UserReviewsListView, UserDetailView

urlpatterns = [
    path('', DishesListView.as_view()),
    path('<pk>', DishesDetailView.as_view()),
    path('userreviews/<pk>/', UserReviewsListView.as_view()),
    path('user/<pk>/', UserDetailView.as_view())
]