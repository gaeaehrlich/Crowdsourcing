from ..models import Profile, Estimation, Dish, Tag
from django.contrib.auth.models import User

def search_dishes(user, tags, area, k=50): # if we want city area we need to change the field in addres
    all_tags = list(set().union(tags, user.profile.preferences.all()))
    dishes = [dish for dish in Dish.objects.filter(restaurant__address__area=area,
                                                   tags__in=all_tags)
              if is_legal_dish(dish, all_tags)]

    return sorted(dishes,
                  key=lambda dish: dish.estimations.get(user=user).estimat,
                  reverse=True)[:k]


def is_legal_dish(dish, tags):
    return all(tag in dish.tags.all() for tag in tags)
