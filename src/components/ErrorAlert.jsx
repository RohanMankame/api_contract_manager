export default function ErrorAlert({ error, onClose }) {
    if (!error) return null;

    return (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200 flex items-center justify-between">
            <span>{error}</span>
            <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 text-red-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500  ml-4"
                aria-label="Close error"
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}