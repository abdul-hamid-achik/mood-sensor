import pytest
from django.forms import model_to_dict
from model_bakery import baker


@pytest.fixture
def mood_data():
    return model_to_dict(baker.prepare_recipe('moods.mood'), exclude=['id'])


@pytest.fixture
def location_data():
    return model_to_dict(baker.prepare_recipe('moods.location'), exclude=['id'])


@pytest.fixture
def mood_capture_data(mood_data, location_data):
    mood = baker.make_recipe('moods.mood', **mood_data)
    location = baker.make_recipe('moods.location', **location_data)
    return model_to_dict(
        baker.prepare_recipe('moods.mood_capture', mood_id=mood.pk, location_id=location.pk),
        exclude=['id']
    )
