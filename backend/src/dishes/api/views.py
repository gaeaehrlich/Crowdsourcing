import os

from django.http import FileResponse, JsonResponse, HttpResponse
from rest_framework.authtoken.models import Token
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView
from django.views.decorators.csrf import csrf_exempt


from ..Engine.manage import search as algo_search, init__user, init__review, eatwith as algo_eatwith

from ..models import Dish, Review, Profile, Gift, Tag, Restaurant, CityArea
from .serializers import DishSerializer, ReviewSerializer, ProfileSerializer, GiftSerializer, RestaurantSerializer,\
    TagSerializer, CityAreaSerializer


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
        return Review.objects.filter(author_token=token)


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
    photo_path = 'images/'+dish+'.jpg'
    if not os.path.exists(photo_path):
        photo_path = 'images/the_new_asian.jpg'

    img = open(photo_path, 'rb')
    response = FileResponse(img)

    return response

def search(req):
    tags = req.GET.getlist('tags[]')
    area = req.GET.getlist('area[]')
    user_name = req.GET['user_name']

    out = algo_search(user_name, area[0], tags)

    json = list(map(lambda dish: dict(DishSerializer(dish).data), out))
    response = JsonResponse(data=json, safe=False)

    return response

def search_eatwith(req):
    tags = req.GET.getlist('tags[]')
    area = req.GET.getlist('area')
    user_names = req.GET.getlist('users[]')
    print(tags, area, user_names)
    user_tags = {}

    for user_name, tags in zip(user_names, tags):
        tags = eval(tags.replace('null', 'None'))
        user_tags[user_name] = list(filter(lambda tag:tag, tags))


    rest, users = algo_eatwith(area[0], user_tags)
    print(users)

    rest = dict(RestaurantSerializer(rest).data)
    out = {'dishes': [], 'rest': rest}
    for user in users:
        dish, rating = users[user]
        dish = dict(DishSerializer(dish).data)
        out['dishes'].append(dish)


    json = {'the new': {'name':'asd'}, 'afganit': {'name':'qwe'}}
    response = JsonResponse(data=out, safe=False)

    return response

@csrf_exempt
def multiuploader(request):
    image_folder_path = os.path.dirname(os.path.abspath(__file__)) + '/../../images/'
    
    if request.method == 'POST':
        name = request.FILES['avatar'].name
        data = request.FILES['avatar'].file.read()

        with open(image_folder_path+name, 'wb') as f:
            f.write(data)

        json = {'the new': {'name': 'asd'}, 'afganit': {'name': 'qwe'}}
        response = JsonResponse(data=json)

        return response

def init_review(req):
    dish_id = req.GET['dish_id']
    user_name = req.GET['user_name']
    print('init_review was called:', user_name, dish_id)

    init__review(user_name, dish_id)

    json = {'the new': {'name':'asd'}, 'afganit': {'name':'qwe'}}
    response = JsonResponse(data=json)

    return response

def init_user(req):
    user_name = req.GET['user_name']
    print('init_user was called:', user_name)

    init__user(user_name)

    json = {'the new': {'name':'asd'}, 'afganit': {'name':'qwe'}}
    response = JsonResponse(data=json)

    return response