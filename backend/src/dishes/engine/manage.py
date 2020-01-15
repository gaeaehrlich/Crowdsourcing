from .collaborative import add_empty_review_for_user, add_distances_for_new_user, update_distances_for_new_review
from .search import search_dishes
from .eat_with import choose_restaurant
from ..models import User, Dish, CityArea, Review, Tag


def init__user(username): # TODO: make sure
    user = User.objects.get(username=username)
    add_empty_review_for_user(user)
    add_distances_for_new_user(user)

def init__review(review_id): # TODO: make sure
    review = Review.objects.get(id=review_id)
    update_distances_for_new_review(review)

def search(username, areaname, tagsid, lte, gte):
    user = User.objects.get(username=username)
    area = CityArea.objects.get(name=areaname)
    tags = [Tag.objects.get(id=tag_id) for tag_id in tagsid ]

    dishes = search_dishes(user, area, tags, lte, gte)

    return dishes

def eatwith():
    pass