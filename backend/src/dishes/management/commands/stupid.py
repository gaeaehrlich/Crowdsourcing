from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from ...Engine.utils import create_tag_distances, create_specific_distances
from ...Engine.utils import create_another_tags_dists
from ...Engine.search import is_legal_dish, search_dishes
from ...models import Dish, Tag, City, CityArea
from ...Engine.collaborative import create_users_distances
import numpy as np


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        # create_tag_distances()
        #create_specific_distances()
        create_another_tags_dists()