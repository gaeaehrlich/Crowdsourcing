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
        self.token = get_object_or_404(Review, name=self.kwargs['publisher'])
        return Review.object.filter(id=Token.objects.get(key=self.token).user)