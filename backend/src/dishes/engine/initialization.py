from .utils import averaged_mean, knn
from .collaborative import calculate_distance
from django.contrib.auth.models import User
from ..models import Review, DistanceMatrix, Estimation, Dish


def initialize():
    calculate_all_distance()
    create_estimations()


def calculate_all_distance():
    all_users = User.objects.all()

    for user1 in all_users:
        for user2 in all_users:
            if user1 != user2:
                user1_reviews = Review.objects.filter(author_username=user1.username)
                user2_reviews = Review.objects.filter(author_username=user2.username,
                                                      dish__in=user1_reviews
                                                      .values_list('dish', flat=True))

                distance = calculate_distance(user1_reviews,
                                              user2_reviews)

                DistanceMatrix.objects.create(col=user1,
                                              row=user2,
                                              distance=distance)


def create_estimation_for_user(user):

    for dish in Dish.objects.all():
        estimate = 0
        if Review.objects.filter(author_username=user.username,
                                 dish=dish).exists():
            estimate = Review.objects.get(author_username=user.username,
                                          dish=dish).stars
        else:
            neighbors = knn(user, dish)
            if len(neighbors) != 0: # only if no user reviewed this dish!
                estimate = averaged_mean(user, dish, neighbors)

        Estimation.objects.create(dish=dish,
                                  user=user,
                                  estimate=estimate)


def create_estimations():
    for user in User.objects.all():
        create_estimation_for_user(user)