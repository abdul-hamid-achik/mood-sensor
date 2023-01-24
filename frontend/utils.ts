import {Location, Mood, User} from "./client";
import {Key} from 'react';

export interface Feature {
    id: number;
    type: string;
    geometry: {
        type: string;
        coordinates: number[];
    }
    properties: {
        address: string;

        city: string;

        country: string;

        lat: number;

        lng: number;


        postal: string

    }
}

export interface FeatureCollection {
    features: Feature[];

}

export const getNameIdentifier = (item: Feature | Mood | Location | User): Key => {
    if ('name' in item) return item.name;
    if ('properties' in item && 'address' in item?.properties) return item.properties?.address;
    if ('username' in item) return item.username;
}

export const getIdentifier = (item: Feature | Mood | Location | User): Key => {
    if (!item) return null;
    if ('id' in item) return item.id;
    return getNameIdentifier(item);
}

