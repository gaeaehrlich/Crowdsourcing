from ..models import DistanceMatrix, Rank, UserDishMatrix
from django.contrib.auth.models import User
from .Utils import averaged_mean, get_dishes, get_stars, get_users, get_rows
import numpy as np


def initialize():
    calculate_all_distance()
    CreateUserDishMatrix()


def calculate_distance(user1_ranking, user2_ranking): # order by dish is crucial!
    user1_stars = np.array(get_stars(user1_ranking.order_by('dish')))
    user2_stars = np.array(get_stars(user2_ranking.order_by('dish')))
    return np.linalg.norm(user1_stars - user2_stars) # TODO: try different orders


def calculate_all_distance():
    all_users = User.objects.all()
    for user1 in all_users:
        for user2 in all_users:
            if user1 != user2:
                distance = DistanceMatrix(col=user1, row=user2)
                user1_ranking = Rank.objects.filter(user=user1, stars__gt=0)
                user2_ranking = Rank.objects.filter(user=user2,
                                                    dish__in=user1_ranking.values_list('dish', flat=True))
                distance.distance = calculate_distance(user1_ranking, user2_ranking)
                distance.save()


def KNN(user, k = 5):
    return DistanceMatrix.objects.filter(col=user).order_by('distance')[:k]


def AddEstimation(user):
    user_dishes = get_dishes(Rank.objects.filter(user=user))
    neighbors = KNN(user)
    for dish in user_dishes:
        estimate = Rank.objects.get(user=user, dish=dish).stars
        if estimate == 0: # else - go in the table as is
            estimate =  averaged_mean(user, dish, get_rows(neighbors))
        dish_estimation = UserDishMatrix(dish=dish, user=user, estimate=estimate)
        dish_estimation.save()


def CreateUserDishMatrix():
    for user in User.objects.all():
        AddEstimation(user)
