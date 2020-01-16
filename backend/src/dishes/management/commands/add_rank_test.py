from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from ...engine.collaborative import update_distance_for_new_rank
from ...models import Rank, Dish


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        rank = Rank.objects.get(user__pk=2, dish__pk=1)
        update_distance_for_new_rank(rank)