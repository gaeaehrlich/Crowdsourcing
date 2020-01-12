from ..models import DistanceMatrix, Rank, UserDishMatrix
from django.contrib.auth.models import User
from .Utils import averaged_mean, get_dishes, KNN
from .Collaborative import calculate_distance
from django.db.models import Q


def initialize():
    calculate_all_distance()
    CreateUserDishMatrix()


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


def AddEstimation(user): #bug!!!
    user_dishes = get_dishes(Rank.objects.filter(user=user, stars__gt=0))
    for dish in user_dishes:
        neighbors = KNN(user, dish)
        estimate = Rank.objects.get(user=user, dish=dish).stars
        if estimate == 0: # else - go in the table as is
            assert len(neighbors) > 0
            estimate =  averaged_mean(user, dish, neighbors)
        dish_estimation = UserDishMatrix(dish=dish, user=user, estimate=estimate)
        dish_estimation.save()


def CreateUserDishMatrix():
    for user in User.objects.all():
        AddEstimation(user)
