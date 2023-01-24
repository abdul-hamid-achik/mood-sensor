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
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiYWFjaGlrIiwiYSI6ImNsZDhsczRwaTAwOG0zcXJveWFwbmI2Ym4ifQ.j8K1SPJClEz_K3U8I0D1XA
MAPBOX_ACCESS_TOKEN=sk.eyJ1IjoiYWFjaGlrIiwiYSI6ImNsZDhscm16ejAwN3Izb21wZWZjMndqcjAifQ.x3BEP3LZVpFkcwkADXMn_Q
```


<rootDir>/backend/.env

```dotenv
MAPBOX_ACCESS_TOKEN=sk.eyJ1IjoiYWFjaGlrIiwiYSI6ImNsZDhscm16ejAwN3Izb21wZWZjMndqcjAifQ.x3BEP3LZVpFkcwkADXMn_Q
```


<rootDir>/frontend/.env.local

```dotenv
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiYWFjaGlrIiwiYSI6ImNsZDhsczRwaTAwOG0zcXJveWFwbmI2Ym4ifQ.j8K1SPJClEz_K3U8I0D1XA
```

### Running the app

1. run `task install` to install dependencies
2. run `task start` to run the app
3. run `task stop` to stop the app
4. run `task test` to run tests
5. run `task clean` to clean up the app

for more info on the commands run `task --list`

## About the app

this was bootstrapped with my own [cookiecutter](https://github.com/sicksid/django-nextjs-boilerplate)
