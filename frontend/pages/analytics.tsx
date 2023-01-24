import Header from "../components/header";
import {useSession} from "next-auth/react";
import {Bar} from 'react-chartjs-2';
import {Configuration, MoodFrequency, MoodSenseApi} from "../client";
import {useQuery} from "@tanstack/react-query";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip,} from 'chart.js';

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Mood Frequency'
        },
    },
};

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export default function Analytics() {
    const {data: session} = useSession();
    const {data: frequencyMoodCaptures} = useQuery<MoodFrequency[]>(
        ['frequencyMoodCaptures',],
        async () => {
            const configuration = new Configuration({basePath: process.env.NEXT_PUBLIC_BACKEND_URL});
            const moodSenseApi = new MoodSenseApi(configuration);
            const {data: results} = await moodSenseApi.frequencyMoodCapture({
                headers: {
                    // @ts-ignore
                    Authorization: `Bearer ${session?.access}`

                }
            })
            return results as unknown as MoodFrequency[];
        }, {
            // @ts-ignore
            enabled: !!session?.access

        }
    )
    const data = {
        labels: frequencyMoodCaptures?.map((frequencyMoodCapture) => frequencyMoodCapture.mood),
        datasets: [
            {
                label: 'Count',
                data: frequencyMoodCaptures?.map((frequencyMoodCapture) => frequencyMoodCapture.count),
                backgroundColor: 'rgba(72, 101, 165, 0.5)',
            }
        ],

    }
    return <>
        <Header/>

        <div className="flex flex-col items-center justify-center h-screen">
            {   // @ts-ignore
                !!session?.access ?
                    <Bar options={options} data={data} data-testid="frequency-mood-bar-chart"/> :
                    <h1 className="text-2xl font-bold">You need to be logged in to view this page</h1>
            }
        </div>
    </>
}