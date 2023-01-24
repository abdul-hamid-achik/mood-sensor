import Link from "next/link";
import {DevicePhoneMobileIcon, PresentationChartBarIcon} from "@heroicons/react/24/solid";
export default function Navbar() {
    return (
        <div className="absolute top-0 left-0 p-2 flex flex-row items-center justify-between">
            <Link href="/">
                <span className="flex justify-center">
                    <span className="text-sm text-blue-700 p-2 rounded-md">Mood Sensor</span>
                    <DevicePhoneMobileIcon className="w-5 h-5 text-blue-700 mr-2 self-center"/>
                </span>
            </Link>
            <Link href="/analytics">
                <span className="flex justify-center">
                    <span className="text-sm text-blue-700 p-2 rounded-md">Analytics</span>
                    <PresentationChartBarIcon className="w-5 h-5 text-blue-700 mr-2 self-center"/>
                </span>
            </Link>
        </div>
    );
}
