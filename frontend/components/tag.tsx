interface Props {
    label: string;
    handleRemove?: () => void;
}

export default function Tag({label, handleRemove}: Props) {
    return <span
        className="inline-flex items-center rounded-full bg-indigo-200 px-2 py-0.5 text-sm font-medium text-gray-700">
            {label.toString().substring(0, 20)}...
        {handleRemove && <button
            type="button"
            className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-300 focus:bg-gray-500 focus:text-white focus:outline-none"
            onClick={handleRemove}>
            <span className="sr-only">Remove {label}</span>
            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7"/>
            </svg>
        </button>}
    </span>
}