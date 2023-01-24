import {MouseEvent} from "react";
import {Feature, getIdentifier, getNameIdentifier} from "../utils";
import {Location, Mood} from "../client";
import Tag from '../components/tag'
interface Props {
    tags: Feature[] | Mood[] | Location[];
    handleRemove: (tag: Feature | Mood | Location) => (event: MouseEvent<HTMLButtonElement>) => void;
}

export default function Tags({tags, handleRemove}: Props) {
    return <div>
        {tags.length > 0 && (
            <div className="mt-4">
                {tags.map((tag) => (
                    <Tag key={getIdentifier(tag)} label={getNameIdentifier(tag) as string} handleRemove={() => handleRemove(tag)}/>
                ))}
            </div>
        )}
    </div>
}