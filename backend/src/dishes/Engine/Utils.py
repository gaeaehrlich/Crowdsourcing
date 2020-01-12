import numpy as np
from ..models import Rank, DistanceMatrix, Dish
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


def averaged_mean(user, dish, neighbors): # order is important for averaged_mean
    reorder_neighbors = DistanceMatrix.objects.filter(col=user, row__in=neighbors).order_by('row')
    ranks = Rank.objects.filter(user__in=neighbors, dish=dish)
    stars_list = np.array(get_stars(ranks.order_by('user')))
    weights = np.exp(-1 * np.array(get_distance(reorder_neighbors)))
    assert(len(stars_list) == len(weights))
    print("neighbors: ", neighbors, "reorder_neighbors: ", reorder_neighbors)
    print("user: ", user,"\nweights: ",weights, "\nstars_list: ", stars_list)
    # can raise ZeroDivisionError !!!
    # we need to build the data base so that this is not possible
    return np.average(a=stars_list, weights=weights)


def KNN(user, dish, k = 5):
    valid_neighbors = get_users(Rank.objects
                                .filter(dish=dish).exclude(Q(user=user) | Q(stars=0)))
    print("valid_neighbors for user ",user , "and dish ", dish, ": ", valid_neighbors)
    return get_rows(DistanceMatrix.objects.filter(col=user,
                                                  row__in=valid_neighbors)
                    .order_by('distance')[:k])


def add_empty_ranks_for_user(user):
    ranked_dishes = get_dishes(Rank.objects.filter(user=user))

    for dish in Dish.objects.all():
        if dish not in ranked_dishes:
            Rank.objects.create(user=user, dish=dish)


def add_empty_ranks():
    for user in User.objects.all():
        add_empty_ranks(user)


# TODO: Orin - decide later where to use
def k_multi_thread(target, args, k = 5):
    t = threading.Thread(target=target, args=args)
    t.start()
    t.join()