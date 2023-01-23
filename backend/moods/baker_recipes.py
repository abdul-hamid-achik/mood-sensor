from django.contrib.gis.geos import Point
from django.utils import timezone
from faker import Faker
from model_bakery.recipe import Recipe, foreign_key

from .models import Mood, Location, MoodCapture

faker = Faker()

mood = Recipe(
    Mood,
    name=lambda: faker.sentence(nb_words=1),
    description=lambda: faker.paragraph(nb_sentences=3)
)

location = Recipe(
    Location,
    name=lambda: faker.sentence(nb_words=1),
    address=faker.address(),
    coordinates=Point((faker.longitude(), faker.latitude()))
)

mood_capture = Recipe(
    MoodCapture,
    location=foreign_key(location),
    mood=foreign_key(mood),
    captured_at=faker.past_datetime(tzinfo=timezone.get_current_timezone())
)
