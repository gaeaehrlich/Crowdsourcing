from  backend.src.dishes.models import DistanceMatrix, Rank, UserDishMatrix
from django.contrib.auth.models import User
import numpy as np
import threading



def initialize():
    calculate_all_distance()
    CreateUserDishMatrix()


def calculate_distance(user1_ranking, user2_ranking):
    np1 = np.array(user1_ranking.values_list('stars', flat=True))
    np2 = np.array(user2_ranking.values_list('stars', flat=True))
    return np.linalg.norm(np1-np2, ord=2)


def calculate_all_distance():
    all_users = User.objects.all() # TODO: create liuse st of unordered tuples and user_user_distance()
    for user1 in all_users:
        for user2 in all_users:
            if user1 != user2:
                distance = DistanceMatrix(col=user1, row=user2)
                user1_ranking = Rank.objects.filter(user=user1, stars__gt=0)
                user2_ranking = Rank.objects.filter(user=user2, dish__in=user1_ranking)
                distance.distance = calculate_distance(user1_ranking, user2_ranking)
                distance.save()


def KNN(user, k = 5):
    return DistanceMatrix.objects.filter(col=user).order_by('distance')[:k]


def AddEstimation(user):
    user_dishes = Rank.objects.filter(user=user).values_list('dish', flat=True)
    neighbors = KNN(user) #.values('user', 'distance')
    for dish in user_dishes:
        estimate = Rank.objects.get(user=user).stars
        if estimate == 0:
            sum = 0
            for neighbor in neighbors:
                rank = Rank.objects.get(user=neighbor, dish=dish)
                estimate += rank.stars * np.exp(-1 * neighbor.distance)
                sum += np.exp(-1 * neighbor.distance)
            estimate = estimate / sum

        dish_estimation = UserDishMatrix(dish=dish, user=user, estimate=estimate)
        dish_estimation.save()


def CreateUserDishMatrix():
    for user in User.objects.all():
        AddEstimation(user)


def k_multi_thread(target, args, k = 5):
    t = threading.Thread(target=target, args=args)
    t.start()
    t.join()


if __name__ == '__main__':
    initialize()