from rest_framework import serializers

from ..models import Dish, Review, Restaurant, Gift, Tag, Profile
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
