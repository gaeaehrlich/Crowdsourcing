from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from ...engine.collaborative import update_estimations, update_distances_for_new_review

from ...engine.eat_with import choose_restaurant
from ...engine.initialization import initialize, create_estimations, calculate_all_distance
from ...engine.search import is_legal_dish, search_dishes
from ...engine.utils import get_stars, create_fake_stars_list
from ...models import Dish, Tag, City, CityArea, TagDistances, Review, DistanceMatrix, Estimation
from ...engine.collaborative import create_users_distances, add_estimations_for_new_user, add_distances_for_new_user
import numpy as np
from ...engine.manage import eatwith, search


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        #Tag.objects.get(id=1)], k=50))
        user = User.objects.all()[0]
        area = CityArea.objects.all()[0]
        print(area)
        print(search('orinL', 'Tel Aviv - Rotchield', ['Pizza'], gte=35))
        #print(eatwith('Tel Aviv - Rotchield', [('orinL',['Pizza', 'Egrol']), ('adi',['Chainese'])]))