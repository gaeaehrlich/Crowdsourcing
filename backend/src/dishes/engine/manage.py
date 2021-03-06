from .collaborative import add_distances_for_new_user, update_distances_for_new_review,\
    add_estimations_for_new_user, update_estimations, update_distances_for_del_review
from .search import search_dishes
from .eat_with import choose_restaurant
from ..models import User, Dish, CityArea, Review, Tag, DistanceMatrix, Estimation


def first_call_init_user(user):
    return not (( DistanceMatrix.objects.filter(col=user).exists()) or \
                (Estimation.objects.filter(user=user).exists()))


def init__user(username):
    user = User.objects.get(username=username)
    if first_call_init_user(user):
        add_distances_for_new_user(user)
        add_estimations_for_new_user(user)


def init__review(username, dish_id):
    review = Review.objects.get(author_username=username, dish__id=dish_id)
    update_distances_for_new_review(review)
    update_estimations()


def del__review(username, dish_id, stars):
    update_distances_for_del_review(username, dish_id, int(stars))
    update_estimations()



def search(username, area_name, tag_titles = [], lte = None, gte = None):
    user = User.objects.get(username=username)
    area = CityArea.objects.get(name=area_name)
    tags = Tag.objects.filter(title__in=tag_titles)

    return search_dishes(user, area, tags, lte, gte)


def eatwith(area_name, requests_strings):
    area = CityArea.objects.get(name=area_name)
    requests = []

    for user_name in requests_strings:
        user = User.objects.get(username=user_name)
        print(user_name)
        tags = Tag.objects.filter(title__in=requests_strings[user_name])
        requests.append((user, tags))

    restaurant, dishes, losses  = choose_restaurant(requests, area)

    return restaurant, dishes