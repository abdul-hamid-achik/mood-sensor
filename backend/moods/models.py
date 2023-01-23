from django.db import models

from api.shared import BaseMixin


class Mood(BaseMixin):
    name = models.CharField(max_length=255)
    description = models.TextField()

    class Meta:
        ordering = ('created_at',)


class Location(BaseMixin):
    name = models.CharField(max_length=255)
    address = models.TextField()
    latitude = models.FloatField()
    longitude = models.FloatField()

    class Meta:
        ordering = ('created_at',)


class MoodCapture(BaseMixin):
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    mood = models.ForeignKey(Mood, on_delete=models.CASCADE)
    captured_at = models.DateTimeField()

    class Meta:
        ordering = ('captured_at',)
