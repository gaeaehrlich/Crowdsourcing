# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator
import datetime
from django.db import models

User = get_user_model()


class Dish(models.Model):
    title = models.CharField(max_length=120)
    content = models.TextField()
    restaurant = models.ForeignKey('Restaurant', related_name='%(class)s', on_delete=models.PROTECT, default=None, null=True)

    def __str__(self):
        return self.title


class Review(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    dish = models.ForeignKey(Dish, related_name='%(class)s', on_delete=models.PROTECT, default=None)
    description = models.CharField(max_length=100, blank=True)
    stars = models.IntegerField(
        default=0,
        validators=[MaxValueValidator(5), MinValueValidator(0)]
    )
    likes = models.IntegerField(default=0)


class Gift(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey('Restaurant', related_name='%(class)s', on_delete=models.PROTECT)
    description = models.CharField(max_length=500)


class Tag(models.Model):
    title = models.CharField(max_length=30, unique=True)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    level = models.IntegerField(
        default=0,
        validators=[
            MaxValueValidator(100),
            MinValueValidator(1)
        ]
    )
    likes = models.ManyToManyField(Review, related_name="posts_liked", blank=True)
    gifts = models.ManyToManyField(Gift, related_name="posts_liked", blank=True)
    searches = models.ManyToManyField(Dish, related_name='%(class)s', blank=True)
    preferences = models.ManyToManyField(Tag, blank=True)


class Address(models.Model):
    city = models.ForeignKey('City', related_name='%(class)s', on_delete=models.PROTECT, default=None)
    street = models.ForeignKey('Street', related_name='%(class)s', on_delete=models.PROTECT, default=None)
    number = models.IntegerField()


class Restaurant(models.Model):
    name = models.CharField(max_length=30, unique=True)
    address = models.ForeignKey(Address, related_name='%(class)s', on_delete=models.PROTECT, default=None)


class City(models.Model):
    name = models.CharField(max_length=30, unique=True)


class CityArea(models.Model):
    name = models.CharField(max_length=30, unique=True)
    city = models.ForeignKey(City, related_name='%(class)s', on_delete=models.PROTECT, default=None)


class Street(models.Model):
    name = models.CharField(max_length=30)
    city = models.ForeignKey(City, related_name='%(class)s', on_delete=models.PROTECT, default=None)
    city_area = models.ForeignKey(CityArea, related_name='%(class)s', on_delete=models.PROTECT, default=None)


class DistanceMatrix(models.Model):
    col = models.ForeignKey(User, related_name='col', on_delete=models.PROTECT, default=None)
    row = models.ForeignKey(User, related_name='row', on_delete=models.PROTECT, default=None)
    distance = models.FloatField()


class UserDishMatrix(models.Model):
    dish = models.ForeignKey(Dish, related_name='%(class)s', on_delete=models.PROTECT, default=None)
    user = models.ForeignKey(User, related_name='%(class)s', on_delete=models.PROTECT, default=None)
    estimate = models.FloatField()
    last_update = models.DateTimeField(default=datetime.datetime.now)


class TagTag(models.Model):
    col = models.ForeignKey(Tag, related_name='col', on_delete=models.PROTECT, default=None)
    row = models.ForeignKey(Tag, related_name='row', on_delete=models.PROTECT, default=None)
    distance = models.FloatField()


class DishTag(models.Model):
    dish = models.ForeignKey(Dish, related_name='%(class)s', on_delete=models.PROTECT, default=None)
    tag = models.ForeignKey(Tag, related_name='%(class)s', on_delete=models.PROTECT, default=None)


class RestaurantTag(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='%(class)s', on_delete=models.PROTECT, default=None)
    tag = models.ForeignKey(Tag, related_name='%(class)s', on_delete=models.PROTECT, default=None)


class RestaurantArea(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='%(class)s', on_delete=models.PROTECT, default=None)
    area = models.ForeignKey(CityArea, related_name='%(class)s', on_delete=models.PROTECT, default=None)