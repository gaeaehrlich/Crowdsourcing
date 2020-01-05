from Crowdsourcing.backend.src.dishes.models import UserDishMatrix, Dish, Restaurant, DishTag, TagTag,\
    Constraint, RestaurantTag, RestaurantArea
from Crowdsourcing.backend.src.Engine import Utils
import numpy as np


def func(tag):
    return lambda x: TagTag.get(col=tag, row=x).distance


def cal_tag_loss(tag, dish):
    dish_tags = DishTag.objects.filter(dish=dish)
    return np.min(map(func(tag), dish_tags))


def cal_dish_loss(user, tags, dish):
    min_loss = cal_tag_loss(tags[0], dish)
    min_tag = tags[0]
    for tag in tags[1:]:
        tag_loss = cal_tag_loss(tag, dish)
        if tag_loss < min_loss:
            min_loss = tag_loss
            min_tag = tag
    estimation = UserDishMatrix.objects.get(user=user, dish=dish).estimate
    return min_tag, np.exp(min_loss - estimation)



# TODO
def best_resturant_for_group(users_list, tags_list, area):
    """

    :param users_list: list of users that want to eat together
    :param tags_list: each cell i in this list is list of tags that entered the user in users_list[i]
    :param area: where they want to eat
    :return: the recommended restaurant and list of (user, recommended_dish)
    """
    n = len(users_list)
    restaurants = Utils.values_list_flat(RestaurantArea.objects.filter(area=area), "restaurant")
    min_loss_val = float('inf')
    users_loss = []
    for restaurant in restaurants:
        # constraints
        loss = 0
        user_recommended_dish_list = []
        current_users_lost = []
        for i in range(n):
            user_loss, recommended_dish = restaurant_loss(users_list[i], tags_list[i], restaurant)
            current_users_lost.append(user_loss)
            loss += user_loss
            user_recommended_dish_list.append((users_list[i], recommended_dish))
        if min_loss_val > loss:
            best_restaurant = restaurant
            user_and_dish_at_restaurant = user_recommended_dish_list
            user_loss = user_and_dish_at_restaurant
    if min_loss_val == float('inf'):
        return None
    return best_restaurant, user_and_dish_at_restaurant, user_loss


# TODO : if there is no dish in  restaurant that match user constrains???
def restaurant_loss(user, tags, restaurant):
    """

    :param user:  user django object
    :param tags: TO ASK CHEN
    :param restaurant: restaurant django object
    :return: the distance of the closest dish for the given user , and the dish that achive it as tuple
    """
    dishes = Dish.objects.filter(resturant=restaurant)
    # FILTER OUT THE BAD DISHES THAT CAN KILL THEM Manually :
    user_constrains = Utils.values_list_flat(Constraint.objects.filter(user=user), "tag")
    dishes_loss =[float('inf')]
    appropriate_dishes = [None]
    for dish in dishes:
        bad_dish = False
        dish_tags = Utils.values_list_flat(DishTag.objects.filter(dish=dish), "tag")
        for constraint in user_constrains:
            if constraint not in dish_tags:
                bad_dish = True
                break
        if not bad_dish:
            tag, loss = cal_dish_loss(user, tags, dish)
            dishes_loss.append(loss)
            appropriate_dishes.append(dish)
    i = np.argmin(dishes_loss)
    return dishes_loss[i], appropriate_dishes[i]


def choose_restaurant(city, requests):
    restaurants = Restaurant.objects.filter(address__city=city)
