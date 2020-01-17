import numpy as np
from ..models import DistanceMatrix, Tag, TagDistances
import threading
from django.contrib.auth.models import User


def get_dishes(query_set):
    return list(map(lambda x: x.dish, query_set))


def get_users_from_review(query_set):
    return list(map(lambda x: User.objects.get(username=x.author_username), query_set))


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


def related(tag1, tag2):
    # tag1 is a son of tag2
    return tag1.tag_distances_from.get(row=tag2).distance == 0

# every neighbors gave a review on the dish since all neighbors are from knn function
def averaged_mean(user, dish, neighbors):
    neighbor_to_stars = lambda neighbor: dish.reviews.get(author_username=neighbor.username).stars
    neighbor_to_distance = lambda neighbor: neighbor.user_distances_to.get(col=user).distance

    # the order of both lists is important
    stars_list = list(map(neighbor_to_stars, neighbors))
    weights = np.exp(-1 * np.array(list(map(neighbor_to_distance, neighbors))))

    return np.average(a=stars_list, weights=weights)


def knn(user, dish, k = 5):
    valid_neighbors = get_users_from_review(dish.reviews.all())
    return get_rows(DistanceMatrix.objects.filter(col=user,
                                                  row__in=valid_neighbors).order_by('distance')[:k])


def create_fake_stars_list(user_reviews, other_reviews):
    array = []
    i = 0
    for j in range(len(user_reviews)):
        if i < len(other_reviews) and other_reviews[i].dish == user_reviews[j].dish:
            array.append(other_reviews[i].stars)
            i += 1
        else:
            array.append(0)

    return array


# TODO: Orin - decide later where to use
def k_multi_thread(target, args, k = 5):
    t = threading.Thread(target=target, args=args)
    t.start()
    t.join()