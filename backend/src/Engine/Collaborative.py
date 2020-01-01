from  backend.src.dishes.models import DistanceMatrix, Rank, UserDishMatrix
from django.contrib.auth.models import User
import threading
from datetime import datetime, timedelta
from math import sqrt
from backend.src.Engine.Initialization import calculate_distance, KNN
import numpy as np


def user_user_distance(new_user, new_user_rank, old_user):
    old_user_rank = Rank.objects.filter(user=old_user)
    distance1 = DistanceMatrix(col=new_user, row=old_user)
    distance1.distance = calculate_distance(new_user_rank, old_user_rank.filter(dish__in=new_user_rank))
    distance1.save()
    distance2 = DistanceMatrix(col=old_user, row=new_user)
    distance2.distance = calculate_distance(old_user_rank, new_user_rank.filter(dish__in=new_user_rank))
    distance2.save()


def update_distance_for_new_user(new_user):
    new_user_rank = Rank.objects.filter(user=new_user)
    for old_user in User.objects.all():
        if old_user != new_user:
            t = threading.Thread(target=user_user_distance(), args=[new_user,new_user_rank,old_user])
            t.start()
            t.join()


def update_distance(distance, diff):
    return sqrt(pow(distance, 2) + diff)


def update_distance_for_new_rank(rank):
    user = rank.user
    dish = rank.dish
    for other in User.objects.all():
        other_stars = Rank.objects.get(user=other, dish=dish).stars
        distance = DistanceMatrix.objects.get(col=user, row=other)
        distance.distance = update_distance(distance.distance, abs(rank.stars - other_stars))
        distance.save(['distance'])
        if other_stars > 0:
            distance = DistanceMatrix.objects.get(col=other, row=user)
            distance.distance = update_distance(distance.distance, abs(rank.stars - other_stars))
            distance.save(['distance'])


def update_estimation(cell):
    user = cell.user
    dish = cell.dish
    neighbors = KNN(user)
    # TODO: maintain list of users that ate recently.
    #  update only for users that has a recntly updateted neighbor
    estimate, sum = 0
    for neighbor in neighbors:
        rank = Rank.objects.get(user=neighbor, dish=dish)
        estimate += rank.stars * np.exp(-1 * neighbor.distance)
        sum += np.exp(-1 * neighbor.distance)
    cell.estimate = estimate / sum
    cell.last_update = datetime.now()
    cell.save(['estimate', 'last_update'])


def update_estimations():
    t = datetime.now() - timedelta(days = 2)
    old_cells = UserDishMatrix.objects.filter(last_update__ls=t,) #user__in=list
    for cell in old_cells:
        update_estimation(cell)
