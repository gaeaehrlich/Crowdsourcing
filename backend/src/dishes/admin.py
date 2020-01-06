# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Dish, Profile, Address, Restaurant, City, CityArea, Street, Review, Rank, DistanceMatrix, \
    UserDishMatrix, Tag, TagTag, DishTag, RestaurantTag, Constraint, RestaurantArea

admin.site.register(Dish)

admin.site.register(Profile)

admin.site.register(Address)

admin.site.register(Restaurant)

admin.site.register(City)

admin.site.register(CityArea)

admin.site.register(Street)

admin.site.register(Review)

admin.site.register(Rank)

admin.site.register(DistanceMatrix)

admin.site.register(UserDishMatrix)

admin.site.register(Tag)

admin.site.register(TagTag)

admin.site.register(DishTag)

admin.site.register(RestaurantTag)

admin.site.register(Constraint)

admin.site.register(RestaurantArea)
