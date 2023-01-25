from django.contrib.gis.db.models import PointField
from django.db import models

from api.shared import BaseMixin


class Mood(BaseMixin):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ("created_at",)
        constraints = [
            models.UniqueConstraint(fields=["name"], name="unique_mood_name")
        ]


class Location(BaseMixin):
    name = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField()
    coordinates = PointField(default="POINT(0.0 0.0)")

    class Meta:
        ordering = ("created_at",)
        constraints = [
            models.UniqueConstraint(
                fields=["address", "name", "coordinates"],
                name="unique_location_address_name_coordinates",
            )
        ]


class MoodCaptureManager(models.Manager):
    def mood_frequency(self, user):
        print()
        return (
            self.filter(created_by=user)
            .select_related("mood")
            .values("mood__name")
            .annotate(count=models.Count("mood"))
            .order_by("-count")
        )


class MoodCapture(BaseMixin):
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    mood = models.ForeignKey(Mood, on_delete=models.CASCADE)
    captured_at = models.DateTimeField()
    objects = MoodCaptureManager()

    class Meta:
        ordering = ("captured_at",)
        constraints = [
            models.UniqueConstraint(
                fields=["location", "mood", "captured_at"],
                name="unique_mood_capture_location_mood_captured_at",
            )
        ]
