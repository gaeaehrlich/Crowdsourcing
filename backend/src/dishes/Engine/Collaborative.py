from .Utils import averaged_mean, get_dishes, get_stars, knn
from ..models import DistanceMatrix, Review, Estimation, Dish
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from math import sqrt
import numpy as np
from django.utils import timezone


def calculate_distance(user1_ranking, user2_ranking):
    user1_stars = np.array(get_stars(user1_ranking.order_by('dish')))
    user2_stars = np.array(get_stars(user2_ranking.order_by('dish')))
    return np.linalg.norm(user1_stars - user2_stars)


# TODO: CHECK
def create_users_distances(user1, user2):
    # We chose not to break the method into 2 to save time

    # reviews with stars = 0
    user1_review = Review.objects.filter(user=user1)
    user2_review = Review.objects.filter(user=user2)

    # reviews without stars = 0
    user1_review_positive = user1_review.filter(stars__gt=0)
    user2_review_positive = user2_review.filter(stars__gt=0)

    distance1 = calculate_distance(user1_review_positive,
                                  user2_review.filter(dish__in=get_dishes(user1_review_positive)))
    distance2 = calculate_distance(user2_review_positive,
                                  user1_review.filter(dish__in=get_dishes(user2_review_positive)))

    DistanceMatrix.objects.create(col=user1,
                                  row=user2,
                                  distance=distance1)
    DistanceMatrix.objects.create(col=user2,
                                  row=user1,
                                  distance=distance2)


def add_distances_for_new_user(new_user):
    for old_user in User.objects.exclude(pk=new_user.pk):
        create_users_distances(new_user, old_user)


# TODO: CHECK
def update_distance(distance, diff, prev_diff):
    # new distance will always be gte then 0
    return sqrt(pow(distance, 2) + pow(diff, 2) -pow(prev_diff, 2))


def update_distance_for_new_rank(rank):
    user = rank.user

    for distance_cell in DistanceMatrix.objects.filter(col=user):
        other = distance_cell.row
        other_stars = Review.objects.get(user=other, dish=rank.dish).stars
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
    neighbors = knn(user, dish)
    assert len(neighbors) > 0
    cell.estimate = averaged_mean(user, dish, neighbors)
    cell.last_update = timezone.now()
    # save here or not?


# TODO: ONLY UPDATE FOR USERS THAT ONE OF THEIR KNN CHANGED! (RATED A DISH LATELY)
def update_estimations(days = 0):
    t = datetime.now() - timedelta(days=days)
    old_cells = Estimation.objects.filter(last_update__lt=t)
    for cell in old_cells:
        update_estimation(cell)
        cell.save()


def add_estimations_for_new_user(user):
    for dish in Dish.objects.all():
        cell = Estimation(user, dish)
        stars = Review.objects.get(user=user, dish=dish).stars
        if stars == 0:
            update_estimation(cell)
        else:
            cell.estimate = stars
        cell.save()
