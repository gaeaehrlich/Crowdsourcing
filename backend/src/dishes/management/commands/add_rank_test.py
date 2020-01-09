from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from ...Engine.Collaborative import update_distance_for_new_rank
from ...models import Rank, Dish


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        gaea = User.objects.get(first_name='gaea')
        dish = Dish.objects.get(title='pizza neapolitan')
        rank = Rank.objects.get(user=gaea, dish=dish)
        rank.stars = 4
        rank.save()
        update_distance_for_new_rank(rank)