import numpy as np
from ..models import Review, DistanceMatrix, Dish, Profile
import threading
from django.contrib.auth.models import User


def get_dishes(query_set):
    return list(map(lambda x: x.dish, query_set))


def get_users(query_set):
    return list(map(lambda x: x.user, query_set))


def get_stars(query_set):
    return list(map(lambda x: x.stars, query_set))


def get_restaurants(query_set):
    return list(map(lambda x: x.restaurant, query_set))


def get_tags(query_set):
    return list(map(lambda x: x.tag, query_set))


def get_rows(query_set):
    return list(map(lambda x: x.row, query_set))


def get_distance(query_set):
    return list(map(lambda x: x.distance, query_set))


def averaged_mean(user, dish, neighbors):
    neighbor_to_stars = lambda neighbor: neighbor.review.get(dish=dish).stars
    neighbor_to_distance = lambda neighbor: neighbor.user_distances_to.get(col=user).distance

    # the order of both lists is important
    stars_list = list(map(neighbor_to_stars, neighbors))
    weights = np.exp(-1 * np.array(list(map(neighbor_to_distance, neighbors))))
    assert(len(stars_list) == len(weights))
    assert(len(stars_list) > 0)
    #  np.average can raise ZeroDivisionError
    # we need to build the data base so that this is not possible
    return np.average(a=stars_list, weights=weights)


def knn(user, dish, k = 5):
    valid_neighbors = User.objects.filter(review__dish=dish,
                                          review__stars__gt=0).exclude(id=user.id)

    return get_rows(DistanceMatrix.objects.filter(col=user,
                                                  row__in=valid_neighbors).order_by('distance')[:k])


def add_empty_review_for_user(user):
    ranked_dishes = Dish.objects.filter(review__author=user,
                                        review__stars__gt=0)

    for dish in Dish.objects.all():
        if dish not in ranked_dishes:
            Review.objects.create(author=user,
                                  dish=dish)



# TODO: Orin - decide later where to use
def k_multi_thread(target, args, k = 5):
    t = threading.Thread(target=target, args=args)
    t.start()
    t.join()