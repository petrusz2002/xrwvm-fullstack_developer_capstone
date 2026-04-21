from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):

    SEDAN = 'Sedan'
    SUV = 'SUV'
    WAGON = 'Wagon'
    HATCHBACK = 'Hatchback'
    COUPE = 'Coupe'
    CONVERTIBLE = 'Convertible'
    PICKUP = 'Pickup'
    MINIVAN = 'Minivan'

    CAR_TYPES = [
        (SEDAN, 'Sedan'),
        (SUV, 'SUV'),
        (WAGON, 'Wagon'),
        (HATCHBACK, 'Hatchback'),
        (COUPE, 'Coupe'),
        (CONVERTIBLE, 'Convertible'),
        (PICKUP, 'Pickup'),
        (MINIVAN, 'Minivan'),
    ]

    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)

    dealer_id = models.IntegerField(null=True, blank=True)

    name = models.CharField(max_length=100)

    type = models.CharField(max_length=20, choices=CAR_TYPES, default=SUV)

    year = models.IntegerField(
        validators=[
            MinValueValidator(2015),
            MaxValueValidator(2026)
        ]
    )

    def __str__(self):
        return f"{self.car_make.name} {self.name}"