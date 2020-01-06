from django.urls import path

from .views import DishesDetailView, DishesListView, HistoryListView

urlpatterns = [
    path('', DishesListView.as_view()),
    path('<pk>', DishesDetailView.as_view()),
    path('history/<pk>', HistoryListView.as_view()),
]