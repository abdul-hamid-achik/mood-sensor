from rest_framework import serializers

from moods.models import MoodCapture, Location, Mood


class MoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mood
        fields = (
            "id",
            "name",
            "description",
            "created_at",
            "modified_at",
            "created_by",
        )
        read_only_fields = ("created_at", "modified_at", "created_by")
        optional_fields = ("description",)


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = (
            "id",
            "name",
            "address",
            "coordinates",
            "created_at",
            "modified_at",
            "created_by",
        )


class MoodCaptureSerializer(serializers.ModelSerializer):
    location = serializers.PrimaryKeyRelatedField(queryset=Location.objects.all())
    mood = serializers.PrimaryKeyRelatedField(queryset=Mood.objects.all())

    class Meta:
        model = MoodCapture
        fields = (
            "id",
            "location",
            "mood",
            "captured_at",
            "created_at",
            "modified_at",
            "created_by",
        )


class MoodFrequencySerializer(serializers.Serializer):
    mood = serializers.StringRelatedField(source="mood__name")
    count = serializers.IntegerField()

    def create(self, validated_data):
        raise NotImplementedError

    def update(self, instance, validated_data):
        raise NotImplementedError


class SearchSerializer(serializers.Serializer):
    query = serializers.CharField()

    def create(self, validated_data):
        raise NotImplementedError

    def update(self, instance, validated_data):
        raise NotImplementedError
