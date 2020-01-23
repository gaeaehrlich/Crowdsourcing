from django.core.management.base import BaseCommand
from ...engine.initialization import initialize
from ...models import DistanceMatrix, Estimation

class Command(BaseCommand):
    help = 'Initialization'

    def handle(self, *args, **kwargs):
        DistanceMatrix.objects.all().delete()
        Estimation.objects.all().delete()
        initialize()