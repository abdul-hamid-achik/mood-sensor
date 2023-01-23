from rest_framework import serializers

from moods.models import MoodCapture, Location, Mood


class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = ('id', 'name', 'description', 'created_at', 'modified_at', 'created_by')


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ('id', 'name', 'address', 'latitude', 'longitude', 'created_at', 'modified_at', 'created_by')


class MoodCaptureSerializer(serializers.ModelSerializer):
    location = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all())
    mood = serializers.PrimaryKeyRelatedField(queryset=Mood.objects.all())

    class Meta:
        model = MoodCapture
        fields = ('id', 'location', 'mood', 'captured_at', 'created_at', 'modified_at', 'created_by')
