from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from ...models import Dish, Review
from ...Engine.Utils import knn, get_stars
import numpy as np


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        dish = Dish.objects.get(pk=3)
        user = User.objects.get(pk=2)
        neighbors = User.objects.filter(review__dish=dish, review__stars__gt=0)
        func = lambda neighbor: neighbor.user_distances_to.get(col=user).distance

        print('neighbors distances are: ',list(map(func, neighbors)))
        print('weights are ',  np.exp(-1 * np.array(list(map(func, neighbors)))))
        print( np.average(range(5)) )
        print(knn(user, dish))
