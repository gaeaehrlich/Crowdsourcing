from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from ...Engine.utils import add_empty_ranks_for_user


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        gaea = User.objects.get(first_name='gaea')
        add_empty_ranks_for_user(gaea)