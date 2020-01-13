from ..models import  Dish
from .utils import related

def search_dishes(user, area, tags = [], k=50):
    all_tags = list(set().union(tags, user.profile.preferences.all()))
    dishes = [dish for dish in Dish.objects.filter(restaurant__address__area=area)
              if is_legal_dish(dish, all_tags)]

    return sorted(dishes,
                  key=lambda dish: dish.estimation.get(user=user).estimate,
                  reverse=True)[:k]

# all dishes are tagged
def is_legal_dish(dish, tags):
    return all(related(x,y) for x in dish.tags.all() for y in tags)

