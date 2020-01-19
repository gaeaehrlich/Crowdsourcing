from django.core.management.base import BaseCommand
from ...engine.collaborative import update_estimations


class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):

        update_estimations()