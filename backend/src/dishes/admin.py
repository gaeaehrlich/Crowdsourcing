# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Dish
from .models import Restaurant
from .models import Address
from .models import Review


admin.site.register(Dish)
admin.site.register(Restaurant)
admin.site.register(Address)
admin.site.register(Review)
