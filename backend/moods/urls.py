from django.urls import path, include
from rest_framework import routers

from .views import MoodViewSet, LocationViewSet, MoodCaptureViewSet

router = routers.DefaultRouter()
router.register(r"moods", MoodViewSet)
router.register(r"locations", LocationViewSet)
router.register(r"mood_captures", MoodCaptureViewSet, basename="mood-capture")

urlpatterns = [
    path("", include(router.urls)),
]
