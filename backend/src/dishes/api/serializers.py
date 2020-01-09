from rest_framework import serializers

from ..models import Dish, Profile, Review, Gift, Restaurant


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ('name', )


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ('id', 'title', 'content')


class ReviewSerializer(serializers.ModelSerializer):
    dish = DishSerializer()

    class Meta:
        model = Review
        fields = ('author', 'dish', 'description', 'stars', 'likes')


class ProfileSerializer(serializers.ModelSerializer):
    likes = ReviewSerializer(read_only=True, many=True)

    class Meta:
        model = Profile
        fields = ('user', 'location', 'level', 'likes')


class GiftSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer()

    class Meta:
        model = Gift
        fields = ('user', 'restaurant', 'description')