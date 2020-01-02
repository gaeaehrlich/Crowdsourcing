from rest_framework.generics import ListAPIView, RetrieveAPIView

from ..models import Dish
from .serializers import DishSerializer


class DishesListView(ListAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer


class DishesDetailView(RetrieveAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
