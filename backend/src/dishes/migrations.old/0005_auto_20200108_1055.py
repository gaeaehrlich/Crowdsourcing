# Generated by Django 3.0.1 on 2020-01-08 10:55

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dishes', '0004_review_stars'),
    ]

    operations = [
        migrations.AddField(
            model_name='dish',
            name='restaurant',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.PROTECT, related_name='dish', to='dishes.Restaurant'),
        ),
        migrations.AddField(
            model_name='profile',
            name='level',
            field=models.IntegerField(default=0, validators=[django.core.validators.MaxValueValidator(100), django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AddField(
            model_name='profile',
            name='liked',
            field=models.ManyToManyField(to='dishes.Review'),
        ),
        migrations.AddField(
            model_name='review',
            name='likes',
            field=models.IntegerField(default=0),
        ),
    ]
