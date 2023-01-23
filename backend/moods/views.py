from rest_framework import viewsets

from .models import Mood, Location, MoodCapture
from .serializers import MoodSerializer, LocationSerializer, MoodCaptureSerializer


class MoodViewSet(viewsets.ModelViewSet):
    queryset = Mood.objects.all()
    serializer_class = MoodSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class MoodCaptureViewSet(viewsets.ModelViewSet):
    queryset = MoodCapture.objects.all()
    serializer_class = MoodCaptureSerializer
