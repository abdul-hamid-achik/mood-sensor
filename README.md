# Mood Sense

I managed to get most of the features from the exam done although the requirements were a bit vague,
so I had to make some assumptions. I also had to make some compromises in order to get the app done in time.

I wrote several tests but with more time i would have completely covered the app with tests.
i however thing the tests i wrote are a good representation of my testing skills.

## Getting started

### Prerequisites

1. install [Taskfile](https://taskfile.dev/#/installation) and [Docker](https://docs.docker.com/get-docker/)
2. create the following .env files(note that the values are my own keys, you can use them if you want but you should get your own keys):

<rootDir>/.env

```dotenv
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<your mapbox access token>
MAPBOX_ACCESS_TOKEN=<your mapbox access token>
```


<rootDir>/backend/.env

```dotenv
MAPBOX_ACCESS_TOKEN=<your mapbox access token>
```


<rootDir>/frontend/.env.local

```dotenv
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<your mapbox access token>
```

### Running the app

* run `task install` to install dependencies
* run `task start` to run the app 
* run `task migrate` to migrate the database
* run `task seed` to create a first superuser
* run `task stop` to stop the app if you want
* run `task test` to run tests
* run `task clean` to clean up the app

for more info on the commands run `task --list`

## About the app

this was bootstrapped with my own [cookiecutter](https://github.com/sicksid/django-nextjs-boilerplate)
