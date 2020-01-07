from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework.generics import ListAPIView, RetrieveAPIView

from ..models import Dish, Review
from .serializers import DishSerializer, ReviewSerializer


class DishesListView(ListAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer


class DishesDetailView(RetrieveAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer


class HistoryListView(ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        token = self.kwargs.get("pk")
        if token:
            token_obj = Token.objects.get(key=token)
            if token_obj:
                user = token_obj.user
                return Review.objects.filter(author=user)
