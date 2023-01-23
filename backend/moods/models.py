from django.contrib.gis.db.models import PointField
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
    coordinates = PointField(default='POINT(0.0 0.0)')

    class Meta:
        ordering = ('created_at',)


class MoodCaptureManager(models.Manager):
    def mood_frequency(self, user):
        print()
        return self.filter(created_by=user).select_related('mood').values('mood__name').annotate(
            count=models.Count('mood')
        ).order_by('-count')


class MoodCapture(BaseMixin):
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    mood = models.ForeignKey(Mood, on_delete=models.CASCADE)
    captured_at = models.DateTimeField()
    objects = MoodCaptureManager()

    class Meta:
        ordering = ('captured_at',)
