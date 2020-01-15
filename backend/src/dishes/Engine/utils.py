import numpy as np
from ..models import DistanceMatrix, Tag, TagDistances
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


def related(tag1, tag2):
    # tag1 is a son of tag2
    return tag1.tag_distances_from.get(row=tag2).distance == 0


def averaged_mean(user, dish, neighbors):
    neighbor_to_stars = lambda neighbor: neighbor.review.get(dish=dish).stars
    neighbor_to_distance = lambda neighbor: neighbor.user_distances_to.get(col=user).distance

    # the order of both lists is important
    stars_list = list(map(neighbor_to_stars, neighbors))
    weights = np.exp(-1 * np.array(list(map(neighbor_to_distance, neighbors))))

    return np.average(a=stars_list, weights=weights)


def knn(user, dish, k = 5):
    valid_neighbors = User.objects.filter(review__dish=dish,
                                          review__stars__gt=0).exclude(id=user.id)

    return get_rows(DistanceMatrix.objects.filter(col=user,
                                                  row__in=valid_neighbors).order_by('distance')[:k])


# TODO: Orin - decide later where to use
def k_multi_thread(target, args, k = 5):
    t = threading.Thread(target=target, args=args)
    t.start()
    t.join()


def create_tag_distances():
    for tag in Tag.objects.all():
        TagDistances.objects.create(col=tag, row=tag, distance=0)
        children = tag.children.all()
        for child in children:
            TagDistances.objects.create(col=child, row=tag, distance=0)


def create_specific_distances():
    level0 = Tag.objects.filter(title='All')
    level1 = Tag.objects.filter(parent_id='37')
    middle_east_cat = Tag.objects.filter(parent_id='22')
    eropean_cat = Tag.objects.filter(parent_id='36')
    general_cat = Tag.objects.filter(parent_id='19')
    american_cat = Tag.objects.filter(parent_id='5')
    asian_cats = Tag.objects.filter(parent_id='8')
    deserts = Tag.objects.filter(parent_id='14')
    greek_food = Tag.objects.filter(parent_id='23')
    italian_food = Tag.objects.filter(parent_id='1')
    japanease_food = Tag.objects.filter(parent_id='9')
    chainese_food = Tag.objects.filter(parent_id='10')

    # All with itsels:
    TagDistances.objects.create(col=level0[0], row=level0[0], distance=0)
    # All to its children and reverse:
    for tag in level1:
        TagDistances.objects.create(col=tag, row=level0[0], distance=3)
        TagDistances.objects.create(col=level0[0], row=tag, distance=0)
    # distances between level 2 objects
    for tag1 in level1:
        for tag2 in level1:
            if tag1 == tag2:
                TagDistances.objects.create(col=tag1, row=tag2, distance=0)
            else:
                TagDistances.objects.create(col=tag1, row=tag2, distance=3)

    # middle east tags
    middle_east = Tag.objects.get(title='Middle Eeast')
    TagDistances.objects.create(col=middle_east, row=middle_east, distance=0)
    for tag in middle_east_cat:
        TagDistances.objects.create(col=tag, row=middle_east, distance=2)
    greek = Tag.objects.get(title='Greek')
    for tag1 in greek_food:
        TagDistances.objects.create(col=tag1, row=greek, distance=1)
        TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in greek_food:
            TagDistances.objects.create(col=tag1, row=tag2, distance=1)

    # Ero tags
    ero = Tag.objects.get(title='Europenian')
    TagDistances.objects.create(col=ero, row=ero, distance=0)
    for tag in eropean_cat:
        TagDistances.objects.create(col=tag, row=ero, distance=2)
    italy = Tag.objects.get(title='Italian')
    for tag1 in italian_food:
        TagDistances.objects.create(col=tag1, row=italy, distance=1)
        TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in italian_food:
            TagDistances.objects.create(col=tag1, row=tag2, distance=1)

    # General tags
    general = Tag.objects.get(title='General Food')
    TagDistances.objects.create(col=general, row=general, distance=0)
    for tag1 in general_cat:
        TagDistances.objects.create(col=tag1, row=general, distance=2)
        TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in general_cat:
            TagDistances.objects.create(col=tag1, row=tag2, distance=1)

    # American tags
    american = Tag.objects.get(title='American')
    TagDistances.objects.create(col=american, row=american, distance=0)
    for tag1 in american_cat:
        TagDistances.objects.create(col=tag1, row=american, distance=2)
        TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in american_cat:
            TagDistances.objects.create(col=tag1, row=tag2, distance=1)

    # Asian tags:
    asian = Tag.objects.get(title='Asian')
    TagDistances.objects.create(col=asian, row=asian, distance=0)
    for tag in asian_cats:
        TagDistances.objects.create(col=tag, row=asian, distance=2)

    japan = Tag.objects.get(title='Japanese')
    for tag1 in japanease_food:
        TagDistances.objects.create(col=tag1, row=japan, distance=1)
        TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in japanease_food:
            TagDistances.objects.create(col=tag1, row=tag2, distance=1)

    chaina = Tag.objects.get(title='Chainese')
    for tag1 in chainese_food:
        TagDistances.objects.create(col=tag1, row=chaina, distance=1)
        TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in chainese_food:
            TagDistances.objects.create(col=tag1, row=tag2, distance=1)


    # Deserts tags
    Desert = Tag.objects.get(title='Deserts')
    TagDistances.objects.create(col=general, row=Desert, distance=0)
    for tag1 in deserts:
        TagDistances.objects.create(col=tag1, row=Desert, distance=2)
        TagDistances.objects.create(col=tag1, row=tag1, distance=0)
        for tag2 in deserts:
            TagDistances.objects.create(col=tag1, row=tag2, distance=1)

def create_another_tags_dists():
    middle_east_cat = Tag.objects.filter(parent_id='22')
    eropean_cat = Tag.objects.filter(parent_id='36')
    general_cat = Tag.objects.filter(parent_id='19')
    american_cat = Tag.objects.filter(parent_id='5')
    asian_cats = Tag.objects.filter(parent_id='8')
    deserts = Tag.objects.filter(parent_id='14')
    greek_food = Tag.objects.filter(parent_id='23')
    italian_food = Tag.objects.filter(parent_id='1')
    japanease_food = Tag.objects.filter(parent_id='9')
    chainese_food = Tag.objects.filter(parent_id='10')

    all_tags = Tag.objects.all()

    # middle east subtree
    middle_east_subtree = [Tag.objects.get(title='Middle Eeast')]+list(middle_east_cat)+list(greek_food)
    for tag_middle in middle_east_subtree:
        for gen_tag in all_tags:
            if gen_tag not in middle_east_subtree:
                TagDistances.objects.create(col=tag_middle, row=gen_tag, distance=3)

    # Ero subtree
    Ero_subtree = [Tag.objects.get(title='Europenian')]+list(eropean_cat)+list(italian_food)
    for tag_ero in Ero_subtree:
        for gen_tag in all_tags:
            if gen_tag not in Ero_subtree:
                TagDistances.objects.create(col=tag_ero, row=gen_tag, distance=3)

    #General Tags:
    General_subtree = [Tag.objects.get(title='General Food')]+list(general_cat)
    for tag_general in General_subtree:
        for gen_tag in all_tags:
            if gen_tag not in General_subtree:
                TagDistances.objects.create(col=tag_general, row=gen_tag, distance=3)

    #American Tags:
    American_subtree = [Tag.objects.get(title='American')]+list(american_cat)
    for American_tag in American_subtree:
        for gen_tag in all_tags:
            if gen_tag not in General_subtree:
                TagDistances.objects.create(col=American_tag, row=gen_tag, distance=3)


    # Asian subtree
    Asian_subtree = [Tag.objects.get(title='Asian')]+list(asian_cats)+list(chainese_food)+list(japanease_food)
    for tag_asian in Asian_subtree:
        for gen_tag in all_tags:
            if gen_tag not in Asian_subtree:
                TagDistances.objects.create(col=tag_asian, row=gen_tag, distance=3)

    #Desert Tags:
    Desert_subtree = [Tag.objects.get(title='Deserts')]+list(deserts)
    for Desert_tag in Desert_subtree:
        for gen_tag in all_tags:
            if gen_tag not in General_subtree:
                TagDistances.objects.create(col=Desert_tag, row=gen_tag, distance=3)