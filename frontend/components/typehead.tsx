import {Dispatch, MouseEvent, SetStateAction, useRef} from 'react';
import {useForm} from 'react-hook-form';
import {Location, Mood, Search} from '../client';
import {useOnClickOutside} from 'usehooks-ts';
import {useMutation} from '@tanstack/react-query';
import {Feature, getIdentifier, getNameIdentifier} from '../utils'

interface Props {
    label: string;
    searchCallback: (query: Search | Mood) => Promise<Feature[] | Mood[]>;
    handleCustomAction?: (items: Search | Feature | Mood | Location) => Promise<void> | void;
    multiple?: boolean;

    setSelected?: Dispatch<SetStateAction<Mood | Location[] | Feature[]>>;
    selected?: Mood | Location[] | Feature[];
}

const Typeahead: React.FC<Props> = ({selected, setSelected, ...props}) => {
    const {register, handleSubmit, reset} = useForm();
    const ref = useRef<HTMLDivElement>(null);
    const {data: results = [], mutate, error, ...mutation} = useMutation(props.searchCallback)

    useOnClickOutside(ref, () => {
        reset()
        mutation.reset()
    })


    const buttonLabel = !props.multiple && mutation.isSuccess && results.length === 0 ? 'Create' : 'Search';

    const handleItemSelect = (item: Feature | Mood | Location) => (event: MouseEvent<HTMLButtonElement>) => {
        if (props?.multiple && Array.isArray(selected)) {
            // @ts-ignore
            setSelected([...selected.filter((i) => getIdentifier(i) !== getIdentifier(item)), item]);
        } else {
            // @ts-ignore
            setSelected(item);
        }

    }


    const onValid = async ({query}: {query: string}) => {
        if (!props?.multiple && results.length === 0 && mutation.isSuccess) {
            await props.handleCustomAction({
                name: query
            } as Mood);
            mutate({query});
            reset()
        } else {
            await mutate({query});
        }
    }


    const onInvalid = (errors) => {
        console.error(errors);
    }

    const isNotFoundInSelected = (item?: Feature | Mood | Location, items?: any[] | any) => {
        if (Array.isArray(items)) {
            if (!item) return false;
            const identifier = getIdentifier(item);
            const identifiers = items.map((item) => getIdentifier(item));
            return !identifiers.includes(identifier);
        } else {
            if (!item || !items) return true;
            return getIdentifier(item) !== getIdentifier(items);
        }
    }

    return (
        <div className="relative z-10  p-2 mr-4" data-testid="typehead" ref={ref}>
            <form onSubmit={handleSubmit(onValid, onInvalid)} className="flex items-center">
                <label htmlFor="query" className="mr-2">{props.label}</label>
                <input
                    id="query"
                    type="text"
                    {...register('query')}
                    className="border p-2 rounded"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    {mutation.isLoading ? 'Loading...' : buttonLabel}
                </button>
            </form>
            {results?.length > 0 ? (
                <div className="absolute z-0 bottom-0 left-0 right-0 top-0 mt-10 bg-white h-64 overflow-y-auto">
                    <ul role="list" className="-my-10 divide-y divide-gray-200 pt-10">
                        {results?.map((result) => (
                            <li key={getIdentifier(result)} className="py-4 pr-2">
                                <div className="flex items-center  space-x-4">
                                    <div className="flex-shrink-0">

                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-900">{getNameIdentifier(result)}</p>
                                    </div>
                                    <div className="flex space-between">
                                        {isNotFoundInSelected(result, selected) && <button
                                            type="button"
                                            className="inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={handleItemSelect(result)}
                                        >
                                            Select
                                        </button>}
                                        {props.multiple && props.handleCustomAction && <button
                                            type="button"
                                            className="inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => props?.handleCustomAction(result)}
                                        >
                                            View
                                        </button>}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : mutation.isSuccess &&
                <div className="absolute z-0 bottom-0 left-0 right-0 top-0 mt-10 bg-white h-16 text-center p-4">
                    <p>No results found</p>
                </div>}
        </div>
    );
};

export default Typeahead;
