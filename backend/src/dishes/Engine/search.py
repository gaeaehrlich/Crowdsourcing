from ..models import Profile, Estimation, Dish, Tag
from django.contrib.auth.models import User
from .utils import related

def search_dishes(user, tags, area, k=50):
    all_tags = list(set().union(tags, user.profile.preferences.all()))
    dishes = [dish for dish in Dish.objects.filter(restaurant__address__area=area)
              if is_legal_dish(dish, all_tags)]

    return sorted(dishes,
                  key=lambda dish: dish.estimation.get(user=user).estimate,
                  reverse=True)[:k]


def is_legal_dish(dish, tags):
    return all(related(x,y) for x in dish.tags.all() for y in tags)
