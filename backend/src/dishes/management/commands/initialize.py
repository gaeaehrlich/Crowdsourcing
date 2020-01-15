from django.core.management.base import BaseCommand
from ...engine.initialization import initialize

class Command(BaseCommand):
    help = 'Test initialization'

    def handle(self, *args, **kwargs):
        initialize()