from .search import is_legal_dish_constraints
from ..models import Estimation, Restaurant
import numpy as np


def cal_tag_loss(tag, dish):

    tag_to_distance = lambda x: tag.tag_distances_from.get(row=x).distance
    tags = dish.tags.all()
    min_loss = tag_to_distance(tags[0]) # every dish has at least one tag
    for tag2 in tags[1:]:
        loss = tag_to_distance(tag2)
        if loss < min_loss:
            min_loss = loss

    return min_loss


def cal_dish_loss(user, tags, dish):

    if len(tags) == 0: # user don't care
        min_loss = 0
    else:              # user gave us a few options

        min_loss = cal_tag_loss(tags[0], dish)
        for tag in tags[1:]:
            tag_loss = cal_tag_loss(tag, dish)
            if tag_loss < min_loss:
                min_loss = tag_loss

    estimation = Estimation.objects.get(user=user, dish=dish).estimate
    return np.exp(min_loss - estimation) # rethink this


def cal_restaurant_loss(user, tags, restaurant):

    dishes = [dish for dish in restaurant.dish.all()
              if is_legal_dish_constraints(dish, user)]

    if(len(dishes) == 0):
        print('prob with', user, restaurant, '!')
        return None, float('inf')

    min_loss = cal_dish_loss(user, tags, dishes[0])
    min_dish = dishes[0]
    for dish in dishes[1:]:
        dish_loss = cal_dish_loss(user, tags, dish)
        if dish_loss < min_loss:
            min_loss = dish_loss
            min_dish = dish

    return min_dish, min_loss


def choose_restaurant(requests, area):

    restaurants = Restaurant.objects.filter(address__area=area)
    min_total_loss = float('inf') # later
    min_restaurant = None
    min_loss = []
    min_dishes = []
    for restaurant in restaurants:
        total_loss = 0
        dishes = []
        for user, tags in requests:
            dish, loss = cal_restaurant_loss(user, tags, restaurant)
            total_loss += loss
            if dish == None:
                break

            dishes.append(dish)
            min_loss.append(loss)

        if total_loss < min_total_loss:
            min_total_loss = total_loss
            min_restaurant = restaurant
            min_dishes = dishes
    if min_total_loss == float('inf'):
        return None

    return min_restaurant, min_dishes, min_loss