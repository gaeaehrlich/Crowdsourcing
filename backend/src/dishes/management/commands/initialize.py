from django.core.management.base import BaseCommand
from django.utils import timezone
from ...Engine.Initialization import initialize

class Command(BaseCommand):
    help = 'Displays current time'

    def handle(self, *args, **kwargs):
        initialize()