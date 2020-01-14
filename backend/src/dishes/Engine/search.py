from ..models import  Dish
from .utils import related

def search_dishes(user, area, tags = [], k=50):
    dishes = [dish for dish in Dish.objects.filter(restaurant__address__area=area)
              if is_legal_dish(dish, tags, user)]

    return sorted(dishes,
                  key=lambda dish: dish.estimation.get(user=user).estimate,
                  reverse=True)[:k]

def is_legal_dish(dish, tags, user):
    return is_legal_dish_tags(dish, tags) and \
           is_legal_dish_constraints(dish, user)

# all dishes are tagged
def is_legal_dish_tags(dish, tags):
    return all(related(x,y) for x in dish.tags.all() for y in tags)


def is_legal_dish_constraints(dish, user):
    constraints = user.profile.constraints.all()
    return all((constraint in dish.constraints.all()) for constraint in constraints)