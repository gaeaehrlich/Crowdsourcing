from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.http import FileResponse, JsonResponse

from ..models import Dish, Restaurant, Tag, CityArea
from .serializers import DishSerializer, RestaurantSerializer, TagSerializer, CityAreaSerializer


class DishesListView(ListAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer


class DishesDetailView(RetrieveAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer

class RestaurantDetailView(RetrieveAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

class RestaurantListView(ListAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer

class TagListView(ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class CityAreaListView(ListAPIView):
    queryset = CityArea.objects.all()
    serializer_class = CityAreaSerializer

def send_file(req, dish):
    img = open('images/'+dish+'.jpg', 'rb')

    response = FileResponse(img)

    return response

def search(req):
    tags = req.GET['tags[]']
    area = req.GET['area']
    user = req.GET['user']

    json = {'the new': {'name':'asd'}, 'afganit': {'name':'qwe'}}
    response = JsonResponse(data=json)

    return response
