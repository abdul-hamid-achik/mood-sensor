import Head from 'next/head';
import Typehead from '../components/typehead';
import CustomMap from "../components/custom_map";
import UserInfo from "../components/user_info";
import Tags from "../components/tags";
import {useSession} from "next-auth/react";
import {useState} from "react";
import {Configuration, Location, Mood, MoodCapture, MoodSenseApi, Search, User} from "../client";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Feature, FeatureCollection, getIdentifier, getNameIdentifier} from "../utils";
import {AxiosResponse} from "axios";
import Tag from "../components/tag";
import Header from "../components/header";

export default function Home() {
    const {data: session} = useSession();
    const [locations, setLocations] = useState<Location[]>([]);
    const [features, setFeatures] = useState<Feature[]>([]);
    const [mood, setMood] = useState<Mood>();
    const [mapCenter, setMapCenter] = useState<number[]>();
    const configuration = new Configuration({basePath: process.env.NEXT_PUBLIC_BACKEND_URL});
    const moodSenseApi = new MoodSenseApi(configuration);
    const {mutate, reset} = useMutation((data: MoodCapture) => moodSenseApi.createMoodCapture(data, {
        headers: {
            // @ts-ignore
            Authorization: `Bearer ${session?.access}`
        }
    }))
    const queryClient = useQueryClient()

    const handleSearchLocation = async (query: Search) => {
        // @ts-ignore
        const response = await moodSenseApi.searchLocation(query) as unknown as AxiosResponse<FeatureCollection>
        return response?.data.features
    }

    // @ts-ignore
    const handleSearchMood = async (query: Search) => {
        // @ts-ignore
        const response = await moodSenseApi.searchMood(query) as unknown as AxiosResponse<Mood[]>
        return response?.data
    }

    const navigateToLocation = (feature: Feature) => {
        setMapCenter(feature.geometry.coordinates)
    }

    const handleRemoveLocation = (location: Location) => () => {
        setLocations(locations.filter((item) => getIdentifier(item) !== getIdentifier(location)))
    }

    const handleRemoveMood = () => {
        setMood(null)
    }
    const handleSubmit = async () => {
        const promises = features.map(async (feature: Feature) => {
            const {data: location} = await moodSenseApi.geocodeLocation({
                address: getNameIdentifier(feature) as string,
                // @ts-ignore
                coordinates: feature.geometry.coordinates
            }, {
                headers: {
                    // @ts-ignore
                    Authorization: `Bearer ${session?.access}`
                }
            })


            // retrieve or create location
            await mutate({
                // @ts-ignore
                location: location.id,
                mood: mood.id,
                // @ts-ignore
                created_by: session.id,
                captured_at: new Date().toISOString()
            }, {
                onSuccess: async () => {
                    await queryClient.invalidateQueries(['moodCaptures'])
                    await queryClient.invalidateQueries(['locations'])
                    reset()
                    setLocations([])
                    setFeatures([])
                    setMood(null)
                }
            })
        })

        await Promise.all(promises)
    }

    const handleCreateMood = async (mood: Mood) => {
        await moodSenseApi.createMood(mood)
        await queryClient.invalidateQueries(['moods'])
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <Head>
                <title>Mood Sensor by @sicksid - [Abdul Hamid]</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <Header />
            <div className="mx-auto w-full flex items-center justify-center flex-col">
                <div className="flex w-full flex-row justify-between">
                    <div className="flex flex-col p-4">
                        <Typehead label="Locations"
                                  searchCallback={handleSearchLocation}
                                  selected={features}
                                  setSelected={setFeatures}
                                  handleCustomAction={navigateToLocation}
                                  multiple/>
                        <Tags tags={features} handleRemove={handleRemoveLocation}/>
                    </div>
                    <div className="p-4">
                        <Typehead label="Moods"
                                  searchCallback={handleSearchMood}
                                  selected={mood}
                                  setSelected={setMood}
                                  handleCustomAction={handleCreateMood}
                        />
                        {mood &&
                            <Tag label={getNameIdentifier(mood) as string} handleRemove={handleRemoveMood} />
                        }
                    </div>
                    {features.length > 0 && mood && getIdentifier(session?.user as User) && <div>
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleSubmit}>
                            Capture Mood
                        </button>
                    </div>}
                </div>
                <CustomMap center={mapCenter}/>
            </div>
        </div>
    )
}
