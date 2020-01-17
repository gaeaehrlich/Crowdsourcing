from django.db.models import Sum
from rest_framework import serializers

from ..models import Tag, CityArea
from ..models import Dish, Review, Restaurant, Gift, Profile, Constraint

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('title',)

class ReviewSerializer(serializers.ModelSerializer):
    dish = serializers.PrimaryKeyRelatedField(read_only=False, queryset=Dish.objects.all())

    class Meta:
        model = Review
        fields = ('id', 'author_token', 'author_username', 'dish', 'description', 'stars', 'is_anonymous', 'likes', 'photo_name')
        # fields = '__all__'
        depth = 2


class DishSerializer(serializers.ModelSerializer):
    tags = TagSerializer(read_only=True, many=True)
    class Meta:
        model = Dish
        fields = ('id', 'title', 'content', 'price', 'restaurant', 'tags')
        # fields = '__all__'
        depth = 2

class DishSimpleSerializer(serializers.ModelSerializer):
    # test = serializers.RelatedField(source='restaurant', read_only=True)
    class Meta:
        model = Dish
        fields = ('id', 'title', 'content', 'price',)
        # fields = '__all__'
        depth = 1


class CityAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CityArea
        fields = '__all__'

class RestaurantSerializer(serializers.ModelSerializer):
    # Dish = serializers.RelatedField(source='Dish', read_only=True)
    dish = DishSimpleSerializer(read_only=True, many=True)
    # city_area = CityAreaSerializer(read_only=True, many=True)
    class Meta:
        model = Restaurant
        fields = ('id', 'name', 'number', 'dish', 'street', 'city_area')
        # fields = '__all__'
        depth=2


class GiftSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer(read_only=True, many=True)

    class Meta:
        model = Gift
        fields = ('user', 'restaurant', 'description')




class ConstraintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Constraint
        fields = '__all__'


class CityAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CityArea
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    likes = serializers.PrimaryKeyRelatedField(read_only=False, many=True, queryset=Review.objects.all())
    gifts = GiftSerializer(read_only=True, many=True)
    searches = serializers.PrimaryKeyRelatedField(read_only=False, many=True, queryset=Dish.objects.all())
    constraints = serializers.PrimaryKeyRelatedField(read_only=False, many=True, queryset=Constraint.objects.all())

    class Meta:
        model = Profile
        fields = ('user', 'username', 'level', 'likes', 'gifts', 'searches', 'constraints')
