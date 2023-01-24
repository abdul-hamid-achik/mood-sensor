import 'mapbox-gl/dist/mapbox-gl.css';
import {MapPinIcon} from '@heroicons/react/24/solid';
import Map, {AttributionControl, Marker, NavigationControl} from 'react-map-gl';
import {Configuration, Location, MoodCapture, MoodSenseApi} from '../client';
import {useQuery,} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';

const configuration = new Configuration({basePath: process.env.NEXT_PUBLIC_BACKEND_URL});
const moodSenseApi = new MoodSenseApi(configuration);

interface Props {
    center?: number[]
}

interface GeolocationPosition {
    coords: {
        latitude: number;
        longitude: number;
    }
}

export default function CustomMap({center = []}: Props) {
    const {data: session} = useSession();
    const {data: moodCaptures = []} = useQuery<MoodCapture[]>(['moodCaptures',], async () => {
        const {data: {results = []}} = await moodSenseApi.listMoodCaptures(1, 0, [], {
            headers: {
                // @ts-ignore
                Authorization: `Bearer ${session?.access}`
            }
        })
        return results;
    }, {
        // @ts-ignore
        enabled: !!session?.access
    });

    const {data: locations} = useQuery<Location[]>(['locations',], async () => {
        const {data: {results = []}} = await moodSenseApi.listLocations(1, 0, center || [], {
            headers: {
                // @ts-ignore
                Authorization: `Bearer ${session?.access}`
            },
            params: {
                ids: moodCaptures?.map((moodCapture) => moodCapture.location).join(',')
            }
        })
        return results;
    }, {
        // @ts-ignore
        enabled: !!session?.access
    });

    const {data: currentLocation, isSuccess: isCurrentLocationDetected} = useQuery(
        ['currentLocation',],
        async () => await new Promise<GeolocationPosition>((success, error) => navigator.geolocation.getCurrentPosition(success, error))
    )

    const [viewState, setViewState] = useState({
        latitude: 48.866667,
        longitude: -102.333333,
        zoom: 4,
    });

    useEffect(() => {
        if (isCurrentLocationDetected) {
            setViewState({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                zoom: 14,
            })
        }

    }, [isCurrentLocationDetected, currentLocation]);

    useEffect(() => {
        if (center.length > 0) {
            setViewState({
                latitude: center[1],
                longitude: center[0],
                zoom: 14,
            })
        }
    }, [center])

    return <Map
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        style={{width: '100vw', height: '720px'}}
        onMove={evt => setViewState(evt.viewState)}
        attributionControl={false}
        data-testid='custom-map'
        {...viewState}
    >
        <NavigationControl/>
        {locations?.map((location) => (
            <Marker
                key={location.id}
                latitude={parseFloat(
                    // @ts-ignore
                    location.coordinates?.coordinates?.[1]
                )}
                longitude={parseFloat(
                    // @ts-ignore
                    location.coordinates?.coordinates?.[0]
                )}
            >
                <MapPinIcon className="w-5 h-5 text-red-500"/>
                <span className="sr-only">{location.address}</span>
            </Marker>
        ))}
        <AttributionControl customAttribution="Mood Sense map designed by Abdul Hamid"/>
    </Map>
}