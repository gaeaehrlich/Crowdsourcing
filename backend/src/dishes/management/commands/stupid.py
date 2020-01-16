from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from ...engine.collaborative import update_estimations

from ...engine.eat_with import choose_restaurant
from ...engine.initialization import initialize, create_estimations, calculate_all_distance
from ...engine.search import is_legal_dish, search_dishes
from ...engine.utils import get_stars, create_fake_stars_list
from ...models import Dish, Tag, City, CityArea, TagDistances, Review
from ...engine.collaborative import create_users_distances
import numpy as np


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        update_estimations()
        #update_estimations()
        #Tag.objects.create(title="Vegan")
        #Tag.objects.create(title="American")
        #tag = Tag.objects.get(pk=3)
        #area = CityArea.objects.get(pk=1)
        #dish1 = Dish.objects.get(pk=1)
        #print(choose_restaurant([(user1, [tag, Tag.objects.get(pk=2)]),(user2,[Tag.objects.get(title='Vegan'), Tag.objects.get(pk=2)])], area))
        #print(search_dishes(user=user1, area=CityArea.objects.get(pk=1), tags=[Tag.objects.get(title='Vegetarian')]))
        #create_estimations()
        #print(choose_restaurant([(User.objects.get(pk=1), [Tag.objects.get(title='Pizza')]), (User.objects.get(pk=2), [])], CityArea.objects.get(pk=1)))
        #print(TagDistances.objects.get(col__id=22, row__id=19).distance)
        #print(search_dishes(User.objects.get(id=3), area, tags = [Tag.objects.get(id=1)], k=50))