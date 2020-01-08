import numpy as np
from  ..models import Rank, DistanceMatrix
import threading

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
    distance_list = np.exp(-1 * np.array(get_distance(reorder_neighbors)))
    assert(len(stars_list) == len(distance_list))
    print("user: ", user,"\ndistance_list: ",distance_list, "\nstars_list: ", stars_list)
    #return np.average([ [stars_list[i], distance_list[i]] for i in range(len(stars_list))]) # can raise ZeroDivisionError? check
    return np.average(a=stars_list, weights=distance_list)

def add_empty_ranks(): # TODO: for self checking implement or find a way to avoid it
    pass


# TODO: Orin - decide later where to use
def k_multi_thread(target, args, k = 5):
    t = threading.Thread(target=target, args=args)
    t.start()
    t.join()