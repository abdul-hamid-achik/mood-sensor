import pytest
from django.forms import model_to_dict
from model_bakery import baker


@pytest.fixture()
def mood_data():
    return model_to_dict(baker.prepare_recipe('moods.mood'), exclude=['id'])


@pytest.fixture()
def location_data():
    data = model_to_dict(baker.prepare_recipe('moods.location'), exclude=['id'])
    data['coordinates'] = f"{data['coordinates']}"
    return data


@pytest.fixture()
def mood_capture_data(mood_data, location_data):
    mood = baker.make_recipe('moods.mood', **mood_data)
    location = baker.make_recipe('moods.location', **location_data)
    return model_to_dict(
        baker.prepare_recipe('moods.mood_capture', mood_id=mood.pk, location_id=location.pk),
        exclude=['id']
    )


@pytest.fixture()
def mood_capture_frequency_data(mood_capture_data, user):
    mood1 = baker.make('moods.Mood', name='happy')
    mood2 = baker.make('moods.Mood', name='sad')
    mood3 = baker.make('moods.Mood', name='neutral')
    baker.make('moods.MoodCapture', mood=mood1, created_by=user)
    baker.make('moods.MoodCapture', mood=mood1, created_by=user)
    baker.make('moods.MoodCapture', mood=mood2, created_by=user)
    baker.make('moods.MoodCapture', mood=mood3, created_by=user)
