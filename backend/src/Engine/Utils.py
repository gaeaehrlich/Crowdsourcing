import numpy as np
from  backend.src.dishes.models import Rank
import threading


def values_list_flat(values_list, type):
    return values_list.orderby(type, flat=True) # because we do this allot


def averaged_mean(dish, neighbors): # order is important for averaged_mean
    ranks = Rank.objects.get(user__in=values_list_flat(neighbors, 'user'), dish=dish)
    stars_list = values_list_flat(ranks.order_by('user'), 'stars')
    distance_list = np.exp(-1 * np.array(values_list_flat(neighbors.order_by('user'), 'distance')))
    return np.average(stars_list, distance_list) # can raise ZeroDivisionError? check


def add_empty_ranks(): # TODO: for self checking implement or find a way to avoid it
    pass


# TODO: Orin - decide later where to use
def k_multi_thread(target, args, k = 5):
    t = threading.Thread(target=target, args=args)
    t.start()
    t.join()