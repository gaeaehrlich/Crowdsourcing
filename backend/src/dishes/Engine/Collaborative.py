from .Utils import averaged_mean, get_dishes, get_stars, KNN
from ..models import DistanceMatrix, Rank, UserDishMatrix, Dish
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from math import sqrt
import numpy as np


def calculate_distance(user1_ranking, user2_ranking): # order by dish is crucial!
    user1_stars = np.array(get_stars(user1_ranking.order_by('dish')))
    user2_stars = np.array(get_stars(user2_ranking.order_by('dish')))
    return np.linalg.norm(user1_stars - user2_stars) # TODO: try different orders


def user_user_distance(new_user, old_user): # can break to 2 code duplication!
    new_user_rank = Rank.objects.filter(user=new_user)
    old_user_rank = Rank.objects.filter(user=old_user)
    new_user_rank_positive = new_user_rank.filter(stars__gt=0)
    old_user_rank_positive = old_user_rank.filter(stars__gt=0)
    distance1 = DistanceMatrix(col=new_user, row=old_user)
    distance1.distance = calculate_distance(new_user_rank_positive,
                                            old_user_rank.filter(dish__in=get_dishes(new_user_rank_positive)))
    distance1.save()
    distance2 = DistanceMatrix(col=old_user, row=new_user)
    distance2.distance = calculate_distance(old_user_rank_positive,
                                            new_user_rank.filter(dish__in=get_dishes(old_user_rank_positive)))
    distance2.save()


def add_distances_for_new_user(new_user):
    for old_user in User.objects.exclude(pk=new_user.pk):
        user_user_distance(new_user, old_user)


def update_distance(distance, diff, prev):
    return sqrt(pow(distance, 2) + diff -pow(prev, 2)) # should be gte then 0


def update_distance_for_new_rank(rank):
    user = rank.user

    for distance_cell in DistanceMatrix.objects.filter(col=user):
        other = distance_cell.row
        other_stars = Rank.objects.get(user=other, dish=rank.dish).stars
        diff = abs(rank.stars - other_stars)
        new_distance = update_distance(distance_cell.distance, diff, 0)
        distance_cell.distance = new_distance
        distance_cell.save()

        if other_stars > 0: # update for the old user
            distance_cell = DistanceMatrix.objects.get(col=other, row=user)
            new_distance = update_distance(distance_cell.distance, diff, other_stars)
            distance_cell.distance = new_distance
            distance_cell.save()


def update_estimation(cell):
    user = cell.user
    dish = cell.dish
    neighbors = KNN(user, dish)
    assert len(neighbors) > 0
    cell.estimate = averaged_mean(user, dish, neighbors)
    cell.last_update = datetime.now()
    # save here or not?


# TODO: ONLY UPDATE FOR USERS THAT ONE OF THEIR KNN CHANGED! (RATED A DISH LATELY)
def update_estimations(days = 0):
    t = datetime.now() - timedelta(days=days)
    old_cells = UserDishMatrix.objects.filter(last_update__lt=t)
    for cell in old_cells:
        update_estimation(cell)
        cell.save()


def add_estimations_for_new_user(user):
    for dish in Dish.objects.all():
        cell = UserDishMatrix(user, dish)
        stars = Rank.objects.get(user=user, dish=dish).stars
        if stars == 0:
            update_estimation(cell)
        else:
            cell.estimate = stars
        cell.save()
