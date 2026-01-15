import React, { useState, useEffect } from 'react';
import { subscriptionTierService } from '../../services';

export default function TierModal({ isOpen, onClose, rateCardId, onSuccess, initialData = null }) {
    // Tiers will be an array. If initialData is passed, it might be a single tier we are editing?
    // User screenshot shows "Add Tiers to Rate Card", implying bulk add. 
    // But they also said "edit".
    // If editing a single tier, `tiers` array will have 1 item.
    // If adding, `tiers` can have multiple.

    const [tiers, setTiers] = useState([{ min_calls: 0, max_calls: '', unit_price: '', is_infinite: false }]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const isEdit = !!initialData;

    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (initialData) {
                // Edit Mode: Single tier usually
                setTiers([{
                    id: initialData.id,
                    min_calls: initialData.min_calls,
                    max_calls: initialData.max_calls === -1 ? '' : initialData.max_calls,
                    unit_price: initialData.unit_price,
                    is_infinite: initialData.max_calls === -1
                }]);
            } else {
                // Add Mode: Reset
                setTiers([{ min_calls: 0, max_calls: '', unit_price: '', is_infinite: false }]);
            }
        }
    }, [isOpen, initialData]);

    const handleTierChange = (index, field, value) => {
        const newTiers = [...tiers];
        newTiers[index][field] = value;
        setTiers(newTiers);
    };

    const handleInfiniteToggle = (index) => {
        const newTiers = [...tiers];
        newTiers[index].is_infinite = !newTiers[index].is_infinite;
        if (newTiers[index].is_infinite) {
            newTiers[index].max_calls = ''; // visual clear
        }
        setTiers(newTiers);
    };

    const addTierRow = () => {
        const lastTier = tiers[tiers.length - 1];
        let nextMin = 0;

        // Auto-calculate next min
        if (lastTier) {
            const lastMax = parseInt(lastTier.max_calls, 10);
            if (!isNaN(lastMax) && !lastTier.is_infinite) {
                nextMin = lastMax + 1;
            } else if (lastTier.is_infinite) {
                // If previous is infinite, you technically can't add more, but let's allow user to manage it or show error
                nextMin = 0; // fallback
            }
        }
        setTiers([...tiers, { min_calls: nextMin, max_calls: '', unit_price: '', is_infinite: false }]);
    };

    const removeTierRow = (index) => {
        if (tiers.length > 1) {
            const newTiers = tiers.filter((_, i) => i !== index);
            setTiers(newTiers);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isEdit) {
                // Single update
                const tier = tiers[0];
                const payload = {
                    min_calls: parseInt(tier.min_calls, 10),
                    max_calls: tier.is_infinite ? -1 : parseInt(tier.max_calls, 10),
                    unit_price: parseFloat(tier.unit_price)
                };
                await subscriptionTierService.updateSubscriptionTier(initialData.id, payload);
            } else {
                // Bulk create
                for (const tier of tiers) {
                    const payload = {
                        rate_card_id: rateCardId,
                        min_calls: parseInt(tier.min_calls, 10),
                        max_calls: tier.is_infinite ? -1 : parseInt(tier.max_calls, 10),
                        unit_price: parseFloat(tier.unit_price)
                    };
                    await subscriptionTierService.createSubscriptionTier(payload);
                }
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} tiers.`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {isEdit ? 'Edit Tier' : 'Add Tiers to Rate Card'}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-md bg-red-50 p-4">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                {tiers.map((tier, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-6 items-end pb-6 border-b border-gray-100 last:border-0">
                                        <div className="col-span-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Calls</label>
                                            <input
                                                type="number"
                                                value={tier.min_calls}
                                                onChange={(e) => handleTierChange(index, 'min_calls', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 bg-gray-50 border p-2.5 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            />
                                        </div>

                                        <div className="col-span-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Calls</label>
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="number"
                                                    value={tier.max_calls}
                                                    onChange={(e) => handleTierChange(index, 'max_calls', e.target.value)}
                                                    disabled={tier.is_infinite}
                                                    className="block w-full rounded-md border-gray-300 bg-white border p-2.5 focus:border-green-500 focus:ring-green-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                                                />
                                                <div className="flex items-center h-full pt-1">
                                                    <input
                                                        id={`infinite-${index}`}
                                                        type="checkbox"
                                                        checked={tier.is_infinite}
                                                        onChange={() => handleInfiniteToggle(index)}
                                                        className="h-5 w-5 rounded border-gray-300 text-gray-800 focus:ring-gray-800"
                                                    />
                                                    <label htmlFor={`infinite-${index}`} className="ml-2 text-sm text-gray-700">Infinity</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={tier.unit_price}
                                                onChange={(e) => handleTierChange(index, 'unit_price', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 bg-white border p-2.5 focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                            />
                                        </div>

                                        {/* Only show delete on bulk add or if multiple rows exist (though edit usually 1 row) */}
                                        {(!isEdit && tiers.length > 1) && (
                                            <div className="col-span-1 text-right pb-1">
                                                <button
                                                    type="button"
                                                    onClick={() => removeTierRow(index)}
                                                    className="inline-flex items-center justify-center p-2 rounded text-red-600 hover:bg-red-50 focus:outline-none"
                                                >
                                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-2">
                                    {!isEdit && (
                                        <>
                                            <button type="button" className="p-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-500">
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={addTierRow}
                                                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 shadow-sm"
                                            >
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="ml-4 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm"
                                    >
                                        {loading ? 'Saving...' : (isEdit ? 'Update Tier' : 'Add Tier')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
