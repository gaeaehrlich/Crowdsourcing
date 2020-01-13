# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from django.utils import timezone
from django.db import models

# add tag as ManyToMany!
class Dish(models.Model):
    title = models.CharField(max_length=120)
    content = models.TextField()
    restaurant = models.ForeignKey('Restaurant', related_name='%(class)s', on_delete=models.PROTECT)
    tag = models.ManyToManyField('Tag', related_name='%(class)s', blank=True)

    def __str__(self):
        return self.title


class Review(models.Model):
    author = models.ForeignKey(User, related_name='%(class)s', on_delete=models.PROTECT)
    dish = models.ForeignKey(Dish, related_name='%(class)s', on_delete=models.PROTECT)
    description = models.CharField(max_length=100, blank=True)
    stars = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    likes = models.IntegerField(default=0)


class Gift(models.Model):
    user = models.ForeignKey(User, related_name='%(class)s', on_delete=models.PROTECT)
    restaurant = models.ForeignKey('Restaurant', related_name='%(class)s', on_delete=models.PROTECT)
    description = models.CharField(max_length=500)


class Tag(models.Model):
    title = models.CharField(max_length=30, unique=True)
    parent = models.ForeignKey('Tag',
                               related_name='children',
                               on_delete=models.PROTECT,
                               blank=True,
                               null=True)


class Profile(models.Model):
    user = models.OneToOneField(User, related_name='profile', on_delete=models.CASCADE)
    level = models.IntegerField(
        default=0,
        validators=[
            MaxValueValidator(100),
            MinValueValidator(1)
        ]
    )
    likes = models.ManyToManyField(Review, related_name="posts_liked", blank=True)
    gift = models.ManyToManyField(Gift, related_name="posts_liked", blank=True)
    search = models.ManyToManyField(Dish, related_name='%(class)s', blank=True)
    preference = models.ManyToManyField(Tag, blank=True)


class Address(models.Model):
    area = models.ForeignKey('CityArea', related_name='%(class)s', on_delete=models.PROTECT)
    street = models.ForeignKey('Street', related_name='%(class)s', on_delete=models.PROTECT)
    number = models.IntegerField()


class Restaurant(models.Model):
    name = models.CharField(max_length=30)
    address = models.ForeignKey(Address, related_name='restaurants', on_delete=models.PROTECT)


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
    col = models.ForeignKey(User, related_name='user_distances_from', on_delete=models.PROTECT)
    row = models.ForeignKey(User, related_name='user_distances_to', on_delete=models.PROTECT)
    distance = models.FloatField()


class Estimation(models.Model):
    dish = models.ForeignKey(Dish, related_name='%(class)s', on_delete=models.PROTECT)
    user = models.ForeignKey(User, related_name='%(class)s', on_delete=models.PROTECT)
    estimate = models.FloatField()
    last_update = models.DateTimeField(default=timezone.now)


class TagDistances(models.Model):
    col = models.ForeignKey(Tag, related_name='tag_distances_from', on_delete=models.PROTECT)
    row = models.ForeignKey(Tag, related_name='tag_distances_to', on_delete=models.PROTECT)
    distance = models.FloatField()
