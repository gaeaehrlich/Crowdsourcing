# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Dish, Profile, Restaurant, City, CityArea, Review, DistanceMatrix, \
    UserDishMatrix, Tag, TagTag, DishTag, RestaurantTag, RestaurantArea, Gift, Constraint

admin.site.register(Dish)

admin.site.register(Profile)

admin.site.register(Restaurant)

admin.site.register(Gift)

admin.site.register(City)

admin.site.register(CityArea)

admin.site.register(Review)

admin.site.register(DistanceMatrix)

admin.site.register(UserDishMatrix)

admin.site.register(Tag)

admin.site.register(TagTag)

admin.site.register(DishTag)

admin.site.register(RestaurantTag)

admin.site.register(RestaurantArea)

admin.site.register(Constraint)
