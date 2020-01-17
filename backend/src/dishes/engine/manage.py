from .collaborative import add_distances_for_new_user, update_distances_for_new_review, add_estimations_for_new_user
from .search import search_dishes
from .eat_with import choose_restaurant
from ..models import User, Dish, CityArea, Review, Tag


def init__user(username):
    user = User.objects.get(username=username)
    add_distances_for_new_user(user)
    add_estimations_for_new_user(user)


def init__review(review_id): # TODO: if you need give me something else let me know
    review = Review.objects.get(id=review_id)
    update_distances_for_new_review(review)


def search(username, area_name, tag_titles = [], lte = None, gte = None):
    user = User.objects.get(username=username)
    area = CityArea.objects.get(name=area_name)
    tags = Tag.objects.filter(title__in=tag_titles)

    return search_dishes(user, area, tags, lte, gte)


def eatwith(area_name, requests_strings): # TODO: what the fuck am I getting here?
    area = CityArea.objects.get(name=area_name)
    requests = []


    for request in requests_strings:
        user = User.objects.get(username=request[0])
        tags = Tag.objects.filter(title__in=request[1])
        requests.append((user, tags))

    restaurant, dishes, losses  = choose_restaurant(requests, area)
    answers = {}
    for i in range(len(requests)):
        answers[requests[i][0]] = (dishes[i], losses[i])

    return restaurant, answers