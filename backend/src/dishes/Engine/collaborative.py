from .utils import averaged_mean, get_dishes, get_stars, knn
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


# TODO: CHECK AGAIN
def create_users_distances(user1, user2):
    # We chose not to break the method into 2 to save time

    # reviews with stars = 0
    user1_review = Review.objects.filter(author=user1)
    user2_review = Review.objects.filter(author=user2)

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
    for old_user in User.objects.exclude(id=new_user.id):
        create_users_distances(new_user, old_user)


def update_distance(distance, diff, prev_diff):
    # new distance will always be gte then 0
    return sqrt(pow(distance, 2) + pow(diff, 2) -pow(prev_diff, 2))


def update_distances_for_new_review(review):
    user = review.author

    for distance_cell in DistanceMatrix.objects.filter(col=user):
        other = distance_cell.row
        other_stars = Review.objects.get(author=other, dish=review.dish).stars
        diff = abs(review.stars - other_stars)
        distance_cell.distance = update_distance(distance_cell.distance, diff, 0)
        distance_cell.save()

        if other_stars > 0: # need to update distance for the old user
            distance_cell = DistanceMatrix.objects.get(col=other, row=user)
            distance_cell.distance = update_distance(distance_cell.distance, diff, other_stars)
            distance_cell.save()


def update_estimation(cell):
    user = cell.user
    dish = cell.dish
    neighbors = knn(user, dish)
    if len(neighbors > 0):
        cell.estimate = averaged_mean(user, dish, neighbors)
    cell.last_update = timezone.now()
    cell.save()


# todo: only update for users that ONE OF THEIR KNN CHANGED (RATED A DISH LATELY)?
def update_estimations(days = 0):
    t = datetime.now() - timedelta(days=days)
    old_cells = Estimation.objects.filter(last_update__lt=t)
    for cell in old_cells:
        update_estimation(cell)


# TODO: CHECK AGAIN
def add_estimations_for_new_user(user):

    for dish in Dish.objects.all():
        cell = Estimation(user, dish)
        stars = Review.objects.get(author=user, dish=dish).stars
        if stars == 0:
            update_estimation(cell)
        else:
            cell.estimate = stars
            cell.save()


def add_empty_review_for_user(user):
    ranked_dishes = Dish.objects.filter(review__author=user,
                                        review__stars__gt=0)

    for dish in Dish.objects.all():
        if dish not in ranked_dishes:
            Review.objects.create(author=user,
                                  dish=dish)