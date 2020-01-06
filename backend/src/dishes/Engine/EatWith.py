from  ..models import UserDishMatrix, Dish, Restaurant, DishTag, TagTag
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


def restaurant_loss(user, tags, restaurant):
    dishes = Dish.objects.filter(resturant=restaurant)  # TODO: FILTER OUT THE BAD DISHES THAT CAN KILL THEM

    return np.min(map(cal_dish_loss, dishes))


def choose_restaurant(city, requests):
    restaurants = Restaurant.objects.filter(address__city=city)
