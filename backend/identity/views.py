from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from identity.serializers import UserSerializer
from moods.models import MoodCapture, Mood
from moods.serializers import LocationSerializer

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [
        IsAuthenticated,
    ]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=["get"], serializer_class=LocationSerializer)
    def closest_happy_location(self, request, pk=None):
        user = self.get_object()
        happy_moods = Mood.objects.filter(name__iexact="happy")
        current_location = request.GET.get("current_location")
        [latitude, longitude] = [
            float(coordinate) for coordinate in current_location.split(",")
        ]
        current_location = Point(longitude, latitude)
        closest_location = MoodCapture.objects.filter(
            created_by=user,
            mood__in=happy_moods,
            location__coordinates__dwithin=(current_location, 180),
        )
        if closest_location.exists():
            mood_captured = closest_location.order_by("location__coordinates").first()
            serializer = LocationSerializer(mood_captured.location)
            return Response(serializer.data)
        return Response(
            {"error": "User has not been happy yet."}, status=status.HTTP_404_NOT_FOUND
        )
