from ..models import  Dish, Profile
from .utils import related

def search_dishes(user, area, tags = [], lte = None, gte = None, k=50):
    query_set = Dish.objects.filter(restaurant__city_area=area)
    if lte != None:
        query_set = query_set.filter(price__lte=lte)
    if gte != None:
        query_set = query_set.filter(price__gte=gte)

    dishes = [dish for dish in query_set if is_legal_dish(dish, tags, user)]
    return sorted(dishes,
                  key=lambda dish: dish.estimation.get(user=user).estimate,
                  reverse=True)[:k]

def is_legal_dish(dish, tags, username):
    return is_legal_dish_tags(dish, tags) and \
           is_legal_dish_constraints(dish, username)


def is_legal_dish_tags(dish, tags):
    return any(related(x,y) for x in dish.tags.all() for y in tags)


def is_legal_dish_constraints(dish, username):
    constraints = Profile.objects.get(username=username).constraints.all()
    return all((constraint in dish.constraints.all()) for constraint in constraints)