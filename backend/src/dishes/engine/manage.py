from .collaborative import add_distances_for_new_user, update_distances_for_new_review
from .search import search_dishes
from .eat_with import choose_restaurant
from ..models import User, Dish, CityArea, Review, Tag


def init__user(username): # TODO: make sure
    user = User.objects.get(username=username)
    add_distances_for_new_user(user)
    add_estimations_for_new_user(user)


def init__review(review_id): # TODO: if you need give me somthing else let me know
    review = Review.objects.get(id=review_id)
    update_distances_for_new_review(review)


def search(username, areaname, tagsid = [], lte = None, gte = None):
    user = User.objects.get(username=username)
    area = CityArea.objects.get(name=areaname)
    tags = [Tag.objects.get(id=tag_id) for tag_id in tagsid ]

    dishes = search_dishes(user, area, tags, lte, gte)

    return dishes


def eatwith(): # TODO: what the fuck am I getting here?
    pass