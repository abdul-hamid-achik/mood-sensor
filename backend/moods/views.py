from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_gis.filters import DistanceToPointFilter

from .models import Mood, Location, MoodCapture
from .serializers import MoodSerializer, LocationSerializer, MoodCaptureSerializer, MoodFrequencySerializer

User = get_user_model()


class MoodViewSet(viewsets.ModelViewSet):
    queryset = Mood.objects.all()
    serializer_class = MoodSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class MoodCaptureViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = MoodCapture.objects.all()
    serializer_class = MoodCaptureSerializer
    filter_backends = [DistanceToPointFilter]
    distance_filter_field = 'location__coordinates'

    @action(detail=False, methods=['get'], serializer_class=MoodFrequencySerializer, pagination_class=None)
    def frequency(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            MoodCapture.objects.mood_frequency(request.user.id),
            many=True
        )
        return Response(serializer.data)

    @action(detail=False, methods=['get'], serializer_class=LocationSerializer, pagination_class=None)
    def closest_happy_location(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(
            created_by=self.request.user,
            mood__name__iexact='happy',
        )

        if queryset.exists():
            mood_captured = queryset.order_by('location__coordinates').first()
            serializer = self.get_serializer(mood_captured.location)
            return Response(serializer.data)
        return Response({"error": "User has not been happy yet."}, status=status.HTTP_404_NOT_FOUND)
