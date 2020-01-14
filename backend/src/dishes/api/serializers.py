from rest_framework import serializers
from rest_framework.authtoken.models import Token

from ..models import Dish, Profile, Review, Tag, Gift, Restaurant

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ('key', 'user')

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


class GiftSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer()

    class Meta:
        model = Gift
        fields = ('user', 'restaurant', 'description')


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('title',)


class ProfileSerializer(serializers.ModelSerializer):
    likes = ReviewSerializer(read_only=True, many=True)
    gifts = GiftSerializer(read_only=True, many=True)
    searches = DishSerializer(read_only=True, many=True)
    preferences = serializers.PrimaryKeyRelatedField(read_only=False, many=True, queryset=Tag.objects.all())

    class Meta:
        model = Profile
        fields = ('user', 'level', 'likes', 'gifts', 'searches', 'preferences')
