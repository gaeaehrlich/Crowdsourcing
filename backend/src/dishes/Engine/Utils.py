import numpy as np
from  ..models import Rank
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

def averaged_mean(dish, neighbors): # order is important for averaged_mean
    ranks = Rank.objects.filter(user__in=get_rows(neighbors), dish=dish)
    stars_list = get_stars(ranks.order_by('user'))
    distance_list = np.exp(-1 * np.array(get_rows(neighbors.order_by('row'))))
    return np.average(stars_list, distance_list) # can raise ZeroDivisionError? check


def add_empty_ranks(): # TODO: for self checking implement or find a way to avoid it
    pass


# TODO: Orin - decide later where to use
def k_multi_thread(target, args, k = 5):
    t = threading.Thread(target=target, args=args)
    t.start()
    t.join()