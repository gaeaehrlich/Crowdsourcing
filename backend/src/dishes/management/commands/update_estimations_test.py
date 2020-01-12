from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from ...Engine.Collaborative import update_estimations
from ...models import Rank, Dish


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):

        update_estimations()