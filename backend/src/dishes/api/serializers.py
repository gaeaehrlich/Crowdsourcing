from rest_framework import serializers

from ..models import Dish, Review, Restaurant
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        # fields = ('id', 'title', 'content', 'price', 'restaurant')
        fields = '__all__'
        depth=2

class DishSerializer(serializers.ModelSerializer):
    # test = serializers.RelatedField(source='restaurant', read_only=True)
    reviews = ReviewSerializer(read_only=True, many=True)
    class Meta:
        model = Dish
        fields = ('id', 'title', 'content', 'price', 'restaurant', 'reviews')
        # fields = '__all__'
        depth=2

class DishSimpleSerializer(serializers.ModelSerializer):
    # test = serializers.RelatedField(source='restaurant', read_only=True)
    class Meta:
        model = Dish
        fields = ('id', 'title', 'content', 'price',)
        # fields = '__all__'
        depth=1

class RestaurantSerializer(serializers.ModelSerializer):
    # test = serializers.RelatedField(source='restaurant', read_only=True)
    dishes = DishSimpleSerializer(read_only=True, many=True)
    class Meta:
        model = Restaurant
        fields = ('id', 'name', 'city', 'number', 'dishes')
        # fields = '__all__'
        depth=1

