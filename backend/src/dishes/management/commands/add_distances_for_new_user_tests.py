from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from ...Engine.Collaborative import add_distances_for_new_user


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        gaea = User.objects.get(first_name='gaea')
        add_distances_for_new_user(gaea)