from.Utils import averaged_mean, k_multi_thread
from ..models import DistanceMatrix, Rank, UserDishMatrix, Dish
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from math import sqrt
from .Initialization import calculate_distance, KNN


def user_user_distance(new_user, old_user):
    new_user_rank = Rank.objects.filter(user=new_user)
    old_user_rank = Rank.objects.filter(user=old_user)
    distance1 = DistanceMatrix(col=new_user, row=old_user)
    distance1.distance = calculate_distance(new_user_rank, old_user_rank.filter(dish__in=new_user_rank))
    distance1.save()
    distance2 = DistanceMatrix(col=old_user, row=new_user)
    distance2.distance = calculate_distance(old_user_rank, new_user_rank.filter(dish__in=new_user_rank))
    distance2.save()


def add_distances_for_new_user(new_user):
    for old_user in User.objects.all():
        if old_user != new_user:
            user_user_distance(user_user_distance)
            #k_multi_thread(target=user_user_distance(), args=[new_user, old_user])


def update_distance(distance, diff):
    return sqrt(pow(distance, 2) + diff)


def update_distance_for_new_rank(rank):
    user = rank.user
    dish = rank.dish
    for other in User.objects.all():
        other_stars = Rank.objects.get(user=other, dish=dish).stars
        diff = abs(rank.stars - other_stars)
        distance = DistanceMatrix.objects.get(col=user, row=other)
        distance.distance = update_distance(distance.distance, diff)
        distance.save(['distance'])
        if other_stars > 0: # update for the old user
            distance = DistanceMatrix.objects.get(col=other, row=user)
            distance.distance = update_distance(distance.distance, diff)
            distance.save(['distance'])


def update_estimation(cell):
    user = cell.user
    dish = cell.dish
    neighbors = KNN(user)
    cell.estimate = averaged_mean(dish, neighbors)
    cell.last_update = datetime.now()
    # save here or not?


# TODO: ONLY UPDATE FOR USERS THAT ONE OF THEIR KNN CHANGED! (RATED A DISH LATELY)
def update_estimations(days = 1):
    t = datetime.now() - timedelta(days=days)
    old_cells = UserDishMatrix.objects.filter(last_update__ls=t)
    for cell in old_cells:
        update_estimation(cell)
        cell.save(['estimate', 'last_update'])


def add_estimations_for_new_user(user):
    for dish in Dish.objects.all():
        cell = UserDishMatrix(user, dish)
        stars = Rank.objects.get(user=user, dish=dish).stars
        if stars == 0:
            update_estimation(cell)
        else:
            cell.estimate = stars
        cell.save()
