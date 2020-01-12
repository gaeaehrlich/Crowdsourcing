# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
import datetime
from django.db import models

# add tag as ManyToMany!
class Dish(models.Model):
    title = models.CharField(max_length=120)
    content = models.TextField()
    restaurant = models.ForeignKey('Restaurant', related_name='%(class)s', on_delete=models.PROTECT)

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
    city = models.ForeignKey('City', related_name='%(class)s', on_delete=models.PROTECT)
    street = models.ForeignKey('Street', related_name='%(class)s', on_delete=models.PROTECT)
    number = models.IntegerField()


class Restaurant(models.Model):
    name = models.CharField(max_length=30)
    address = models.ForeignKey(Address, related_name='%(class)s', on_delete=models.PROTECT)


class City(models.Model):
    name = models.CharField(max_length=30, unique=True)


class CityArea(models.Model):
    name = models.CharField(max_length=30, unique=True)
    city = models.ForeignKey(City, related_name='%(class)s', on_delete=models.PROTECT)


class Street(models.Model):
    name = models.CharField(max_length=30)
    city = models.ForeignKey(City, related_name='%(class)s', on_delete=models.PROTECT)
    city_area = models.ForeignKey(CityArea, related_name='%(class)s', on_delete=models.PROTECT)


class DistanceMatrix(models.Model):
    col = models.ForeignKey(User, related_name='col', on_delete=models.PROTECT)
    row = models.ForeignKey(User, related_name='row', on_delete=models.PROTECT)
    distance = models.FloatField()


# add a field that tells us if the estimation is real or not
# or even better - unite with Rank table!!!!!!!!!!!!!
class UserDishMatrix(models.Model):
    dish = models.ForeignKey(Dish, related_name='%(class)s', on_delete=models.PROTECT)
    user = models.ForeignKey(User, related_name='%(class)s', on_delete=models.PROTECT)
    estimate = models.FloatField()
    last_update = models.DateTimeField(default=datetime.datetime.now)


class TagTag(models.Model):
    col = models.ForeignKey(Tag, related_name='col', on_delete=models.PROTECT)
    row = models.ForeignKey(Tag, related_name='row', on_delete=models.PROTECT)
    distance = models.FloatField()

class DishTag(models.Model):
    dish = models.ForeignKey(Dish, related_name='%(class)s', on_delete=models.PROTECT)
    tag = models.ForeignKey(Tag, related_name='%(class)s', on_delete=models.PROTECT)


class RestaurantTag(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='%(class)s', on_delete=models.PROTECT)
    tag = models.ForeignKey(Tag, related_name='%(class)s', on_delete=models.PROTECT)


class RestaurantArea(models.Model):
    restaurant = models.ForeignKey(Restaurant, related_name='%(class)s', on_delete=models.PROTECT)
    area = models.ForeignKey(CityArea, related_name='%(class)s', on_delete=models.PROTECT)