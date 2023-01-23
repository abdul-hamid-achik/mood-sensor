import pytest
from django.urls import reverse
from model_bakery import baker
from rest_framework import status

from .models import Mood, Location, MoodCapture


@pytest.mark.describe('Mood')
@pytest.mark.it('should create a mood')
def test_create_mood(get_authenticated_client, user, mood_data):
    client = get_authenticated_client(user)
    response = client.post(reverse('mood-list'), mood_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert Mood.objects.count() == 1
    assert Mood.objects.get().name == mood_data['name']


@pytest.mark.describe('Mood')
@pytest.mark.it('should list moods')
def test_list_moods(get_authenticated_client, user):
    client = get_authenticated_client(user)
    response = client.get(reverse('mood-list'))
    assert response.status_code == status.HTTP_200_OK
    assert response.data['count'] == Mood.objects.count()


@pytest.mark.describe('Mood')
@pytest.mark.it('should retrieve a mood')
def test_update_mood(get_authenticated_client, user, mood_data):
    mood = Mood.objects.create(**mood_data)
    client = get_authenticated_client(user)
    new_name = 'Updated Mood Name'
    mood_data['name'] = new_name
    response = client.patch(reverse('mood-detail', kwargs={'pk': mood.pk}), mood_data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['name'] == new_name
    assert Mood.objects.get(pk=mood.pk).name == new_name


@pytest.mark.describe('Mood')
@pytest.mark.it('should delete a mood')
def test_delete_mood(get_authenticated_client, user, mood_data):
    mood = Mood.objects.create(**mood_data)
    client = get_authenticated_client(user)
    response = client.delete(reverse('mood-detail', kwargs={'pk': mood.pk}))
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert Mood.objects.count() == 0


@pytest.mark.describe('Location')
@pytest.mark.it('should create a location')
def test_location_creation(get_authenticated_client, user, location_data):
    client = get_authenticated_client(user)
    response = client.post(reverse('location-list'), location_data)
    assert response.status_code == status.HTTP_201_CREATED
    assert Location.objects.count() == 1
    assert Location.objects.get().name == location_data['name']


@pytest.mark.describe('Location')
@pytest.mark.it('should list locations')
def test_list_locations(get_authenticated_client, user):
    client = get_authenticated_client(user)
    response = client.get(reverse('location-list'))
    assert response.status_code == status.HTTP_200_OK
    assert response.data['count'] == Location.objects.count()


@pytest.mark.describe('Location')
@pytest.mark.it('should retrieve a location')
def test_retrieve_location(get_authenticated_client, user, location_data):
    location = Location.objects.create(**location_data)
    client = get_authenticated_client(user)
    response = client.get(reverse('location-detail', kwargs={'pk': location.pk}))
    assert response.status_code == status.HTTP_200_OK
    assert response.data['name'] == location.name


@pytest.mark.describe('Location')
@pytest.mark.it('should update a location')
def test_update_location(get_authenticated_client, user, location_data):
    location = Location.objects.create(**location_data)
    client = get_authenticated_client(user)
    new_name = 'Updated Location Name'
    location_data['name'] = new_name
    response = client.patch(reverse('location-detail', kwargs={'pk': location.pk}), location_data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data['name'] == new_name
    assert Location.objects.get(pk=location.pk).name == new_name


@pytest.mark.describe('Location')
@pytest.mark.it('should delete a location')
def test_delete_location(get_authenticated_client, user, location_data):
    location = Location.objects.create(**location_data)
    client = get_authenticated_client(user)
    response = client.delete(reverse('location-detail', kwargs={'pk': location.pk}))
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert Location.objects.count() == 0


@pytest.mark.describe('MoodCapture')
@pytest.mark.it('should create a mood capture')
def test_mood_capture_creation(get_authenticated_client, user, mood_capture_data):
    client = get_authenticated_client(user)
    response = client.post(reverse('mood-capture-list'), mood_capture_data)
    assert response.status_code == status.HTTP_201_CREATED, response.data
    assert MoodCapture.objects.count() == 1
    assert MoodCapture.objects.get().mood.pk == mood_capture_data['mood']
    assert MoodCapture.objects.get().location.pk == mood_capture_data['location']


@pytest.mark.describe('MoodCapture')
@pytest.mark.it('should list mood captures')
def test_list_mood_captures(get_authenticated_client, user):
    client = get_authenticated_client(user)
    response = client.get(reverse('mood-capture-list'))
    assert response.status_code == status.HTTP_200_OK
    assert response.data['count'] == MoodCapture.objects.count()


@pytest.mark.describe('MoodCapture')
@pytest.mark.it('should retrieve a mood capture')
def test_retrieve_mood_capture(get_authenticated_client, user):
    mood_capture = baker.make_recipe('moods.mood_capture')
    client = get_authenticated_client(user)
    response = client.get(reverse('mood-capture-detail', kwargs={'pk': mood_capture.pk}))
    assert response.status_code == status.HTTP_200_OK
    assert response.data['mood'] == mood_capture.mood.pk
    assert response.data['location'] == mood_capture.location.pk


@pytest.mark.describe('MoodCapture')
@pytest.mark.it('should update a mood capture')
def test_update_mood_capture(get_authenticated_client, user):
    mood_capture = baker.make_recipe('moods.mood_capture')
    client = get_authenticated_client(user)

    new_mood = baker.make_recipe('moods.mood')
    new_location = baker.make_recipe('moods.location')
    updated_data = {'mood': new_mood.id, 'location': new_location.id}

    response = client.patch(reverse('mood-capture-detail', kwargs={'pk': mood_capture.pk}), updated_data)
    assert response.status_code == status.HTTP_200_OK
    assert MoodCapture.objects.get(pk=mood_capture.pk).mood == new_mood
    assert MoodCapture.objects.get(pk=mood_capture.pk).location == new_location


@pytest.mark.describe('MoodCapture')
@pytest.mark.it('should delete a mood capture')
def test_delete_mood_capture(get_authenticated_client, user):
    mood_capture = baker.make_recipe('moods.mood_capture')
    client = get_authenticated_client(user)

    response = client.delete(reverse('mood-capture-detail', kwargs={'pk': mood_capture.pk}))
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert MoodCapture.objects.count() == 0
