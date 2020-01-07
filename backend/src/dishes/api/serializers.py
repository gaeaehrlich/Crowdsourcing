from django.contrib.auth.models import User
from rest_framework import serializers

from ..models import Dish
from ..models import Review


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ('id', 'title', 'content')


class ReviewSerializer(serializers.ModelSerializer):
    dish = DishSerializer()

    class Meta:
        model = Review
        fields = ('id', 'dish', 'description', 'stars')
