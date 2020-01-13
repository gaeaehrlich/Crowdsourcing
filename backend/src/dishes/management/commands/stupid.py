from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from ...Engine.EatWith import choose_restaurant
from ...Engine.search import is_legal_dish, search_dishes
from ...models import Dish, Tag, City, CityArea
from ...Engine.collaborative import create_users_distances
import numpy as np


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        #Tag.objects.create(title="Vegan")
        #Tag.objects.create(title="American")

        tag = Tag.objects.get(title='Vegetarian')
        area = CityArea.objects.get(pk=1)
        user1 = User.objects.get(pk=1)
        user2 = User.objects.get(pk=2)
        print(choose_restaurant([(user1, [tag, Tag.objects.get(pk=2)]),(user2,[Tag.objects.get(title='Vegan'), Tag.objects.get(pk=2)])], area))
        print(search_dishes(user=user1, area=CityArea.objects.get(pk=1), tags=[Tag.objects.get(title='Vegetarian')]))
