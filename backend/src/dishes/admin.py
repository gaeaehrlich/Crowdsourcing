# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Dish
from .models import Restaurant
from .models import Review, Tag, Profile, City, CityArea, Constraint


admin.site.register(Dish)
admin.site.register(Restaurant)
admin.site.register(Review)
admin.site.register(Tag)
admin.site.register(Profile)
admin.site.register(CityArea)
admin.site.register(City)
admin.site.register(Constraint)
