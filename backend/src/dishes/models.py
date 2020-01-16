# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
import datetime
from django.db import models
from django.core.validators import MinLengthValidator
from django.db.models import Sum



class Tag(models.Model):
    title = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.title


class Constraint(models.Model):
    title = models.CharField(primary_key=True, max_length=30, unique=True)

    def __str__(self):
        return self.title


class Dish(models.Model):
    title = models.CharField(max_length=120)
    content = models.TextField()
    restaurant = models.ForeignKey('Restaurant', related_name='dishes', on_delete=models.PROTECT)
    constraints = models.ManyToManyField(Constraint, related_name='dishes', blank=True)
    tags = models.ManyToManyField(Tag, related_name='%(class)s', blank=True)
    price = models.IntegerField(default=0)

    def __str__(self):
        return " ".join(map(str, [self.title, self.restaurant]))


class Review(models.Model):
    author_token = models.CharField(max_length=40, validators=[MinLengthValidator(40)])
    author_username = models.CharField(max_length=40)
    dish = models.ForeignKey(Dish, related_name='reviews', on_delete=models.PROTECT, default=None)
    description = models.CharField(max_length=100, blank=True)
    stars = models.IntegerField(
        default=0,
        validators=[MaxValueValidator(5), MinValueValidator(0)]
    )
    is_anonymous = models.BooleanField(default=False)
    likes = models.IntegerField(default=0)

    def __str__(self):
        return " ".join(map(str, [self.dish, self.author_username]))


class Gift(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey('Restaurant', related_name='%(class)s', on_delete=models.PROTECT)
    description = models.CharField(max_length=500)


class Profile(models.Model):
    user = models.CharField(primary_key=True, max_length=40, validators=[MinLengthValidator(40)], unique=True)

    @property
    def level(self):
        return Review.objects.filter(author_token=self.user).aggregate(Sum('likes'))["likes__sum"]

    likes = models.ManyToManyField(Review, related_name="posts_liked", blank=True)
    gifts = models.ManyToManyField(Gift, related_name="posts_liked", blank=True)
    searches = models.ManyToManyField(Dish, related_name='%(class)s', blank=True)
    preferences = models.ManyToManyField(Constraint, blank=True)

    def __str__(self):
        return " ".join(map(str, [self.user]))


class City(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return " ".join(map(str, [self.name]))


class CityArea(models.Model):
    name = models.CharField(max_length=30, unique=True)
    city = models.ForeignKey(City, related_name='%(class)s', on_delete=models.PROTECT)
    def __str__(self):
        return " ".join(map(str, [self.name, self.city]))


class Restaurant(models.Model):
    name = models.CharField(max_length=30)
    city_area = models.ForeignKey(CityArea, related_name='%(class)s', on_delete=models.PROTECT)
    street = models.CharField(max_length=30)
    number = models.IntegerField(default=0)

    def __str__(self):
        return " ".join(map(str, [self.name, self.street]))


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
