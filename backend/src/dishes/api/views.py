from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.http import FileResponse, JsonResponse
from rest_framework.authtoken.models import Token
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView

from ..models import CityArea
from .serializers import  TagSerializer, CityAreaSerializer

from ..models import Dish, Review, Profile, Gift, Tag, Restaurant
from .serializers import DishSerializer, ReviewSerializer, ProfileSerializer, GiftSerializer, RestaurantSerializer


class DishesListView(ListAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer


class DishesDetailView(RetrieveAPIView):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer


class ReviewCreateView(CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


class ReviewUpdateView(UpdateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


class UserReviewsListView(ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        token = self.kwargs.get("pk")
        return Review.objects.filter(author=token)


class DishReviewsListView(ListAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        dishID = self.kwargs.get("pk")
        return Review.objects.filter(dish__id=dishID)


class UserDetailView(RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class UserCreateView(CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class UserUpdateView(UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class GiftListView(ListAPIView):
    serializer_class = GiftSerializer

    def get_queryset(self):
        token = self.kwargs.get("pk")
        if token:
            token_obj = Token.objects.get(key=token)
            if token_obj:
                user = token_obj.user
                return Gift.objects.filter(user=user)


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
    area = req.GET['area[]']
    user_name = req.GET['user_name']
    print(tags, area, user_name)

    json = {'the new': {'name':'asd'}, 'afganit': {'name':'qwe'}}
    response = JsonResponse(data=json)

    return response
