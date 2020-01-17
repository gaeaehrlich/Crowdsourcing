# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
import datetime
from django.db import models
from django.core.validators import MinLengthValidator
from django.db.models import Sum

from django.utils import timezone



class Tag(models.Model):
    title = models.CharField(max_length=30, unique=True)
    parent = models.ForeignKey('Tag',
                               related_name='children',
                               on_delete=models.PROTECT,
                               blank=True,
                               null=True)

    def __str__(self):
        return self.title


class Constraint(models.Model):
    title = models.CharField(primary_key=True, max_length=30, unique=True)

    def __str__(self):
        return self.title

# add tag as ManyToMany!
class Dish(models.Model):
    title = models.CharField(max_length=120)
    content = models.TextField()
    restaurant = models.ForeignKey('Restaurant', related_name='%(class)s', on_delete=models.PROTECT)
    constraints = models.ManyToManyField(Constraint, related_name="dishes", blank=True)
    tags = models.ManyToManyField(Tag, related_name="%(class)s", blank=True)
    price = models.IntegerField(default=0)

    def __str__(self):
        return self.title


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
    username = models.CharField(max_length=40)

    @property
    def level(self):
        return Review.objects.filter(author_token=self.user).aggregate(Sum('likes'))["likes__sum"]

    likes = models.ManyToManyField(Review, related_name="posts_liked", blank=True)
    gifts = models.ManyToManyField(Gift, related_name="posts_liked", blank=True)
    searches = models.ManyToManyField(Dish, related_name='%(class)s', blank=True)

    # TODO: was preferences and now constraints
    constraints = models.ManyToManyField(Constraint, related_name='%(class)s', blank=True)
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
    col = models.ForeignKey(User, related_name='user_distances_from', on_delete=models.PROTECT)
    row = models.ForeignKey(User, related_name='user_distances_to', on_delete=models.PROTECT)
    distance = models.FloatField()


class Estimation(models.Model):
    dish = models.ForeignKey(Dish, related_name='%(class)s', on_delete=models.PROTECT)
    user = models.ForeignKey(User, related_name='%(class)s', on_delete=models.PROTECT)
    estimate = models.FloatField(default=0)
    last_update = models.DateTimeField(default=timezone.now)


class TagDistances(models.Model):
    col = models.ForeignKey(Tag, related_name='tag_distances_from', on_delete=models.PROTECT)
    row = models.ForeignKey(Tag, related_name='tag_distances_to', on_delete=models.PROTECT)
    distance = models.FloatField()