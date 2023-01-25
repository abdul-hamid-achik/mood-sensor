import geocoder
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_gis.filters import DistanceToPointFilter

from .models import Mood, Location, MoodCapture
from .serializers import (
    MoodSerializer,
    LocationSerializer,
    MoodCaptureSerializer,
    MoodFrequencySerializer,
    SearchSerializer,
)

User = get_user_model()


class MoodViewSet(viewsets.ModelViewSet):
    queryset = Mood.objects.all()
    serializer_class = MoodSerializer

    @action(
        detail=False,
        methods=["post"],
        serializer_class=SearchSerializer,
        pagination_class=None,
    )
    def search(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(
            Q(name__iexact=request.data.get("query"))
            | Q(description__icontains=request.data.get("query"))
        )
        serializer = MoodSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = (IsAuthenticated,)

    @action(detail=False, methods=["post"], pagination_class=None)
    def geocode(self, request, *args, **kwargs):
        saved_locations = Location.objects.filter(address=request.data.get("address"))
        if saved_locations.exists():
            return Response(
                LocationSerializer(saved_locations.first()).data,
                status=status.HTTP_200_OK,
            )

        place = geocoder.mapbox(request.data.get("address"))
        if place.status_code != status.HTTP_200_OK or place.error:
            return Response(
                {"error": "Unable to geocode address"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(
            data={
                "name": place.json.get("address"),
                "address": place.json.get("address"),
                "coordinates": str(
                    Point(float(place.json.get("lng")), float(place.json.get("lat")))
                ),
            }
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["post"], pagination_class=None)
    def reverse_geocode(self, request, *args, **kwargs):
        place = geocoder.mapbox(request.data.get("coordinates"), method="reverse")
        serializer = self.get_serializer(
            data={
                "name": place.json.get("address"),
                "address": place.json.get("address"),
                "coordinates": str(
                    Point(float(place.json.get("lng")), float(place.json.get("lat")))
                ),
            }
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(
        detail=False,
        methods=["POST"],
        permission_classes=[AllowAny],
        serializer_class=SearchSerializer,
        pagination_class=None,
    )
    def search(self, request, *args, **kwargs):
        geocoder_response = geocoder.mapbox(request.data.get("query"))
        if (
            geocoder_response.status_code != status.HTTP_200_OK
            or geocoder_response.error
        ):
            return Response(
                {"error": "No results found"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response(geocoder_response.geojson, status=status.HTTP_200_OK)


class MoodCaptureViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = MoodCapture.objects.all()
    serializer_class = MoodCaptureSerializer
    filter_backends = [DistanceToPointFilter]
    distance_filter_field = "location__coordinates"

    @action(
        detail=False,
        methods=["get"],
        serializer_class=MoodFrequencySerializer,
        pagination_class=None,
    )
    def frequency(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            MoodCapture.objects.mood_frequency(request.user.id), many=True
        )
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        serializer_class=LocationSerializer,
        pagination_class=None,
    )
    def closest_happy_location(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(
            created_by=self.request.user,
            mood__name__iexact="happy",
        )

        if queryset.exists():
            mood_captured = queryset.order_by("location__coordinates").first()
            serializer = self.get_serializer(mood_captured.location)
            return Response(serializer.data)
        return Response(
            {"error": "User has not been happy yet."}, status=status.HTTP_404_NOT_FOUND
        )
