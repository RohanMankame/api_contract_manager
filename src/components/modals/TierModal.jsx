import React, { useState, useEffect } from 'react';
import { subscriptionTierService, rateCardService } from '../../services';
import ModalWrapper from '../ModalWrapper';
import { PlusIcon, TrashIcon } from '../icons';

export default function TierModal({ isOpen, onClose, rateCardId, onSuccess, initialData = null, pricingType, strategy }) {
    const [tiers, setTiers] = useState([{ min_calls: 1, max_calls: '', unit_price: '', is_infinite: false }]);
    const [originalTiers, setOriginalTiers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        const fetchTiers = async () => {
            if (!rateCardId) return;
            setFetching(true);
            try {
                const response = await rateCardService.getRateCardSubscriptionTiers(rateCardId);
                const fetchedTiers = response.data?.data?.subscription_tiers || response.data?.data || response.data || [];

                if (Array.isArray(fetchedTiers) && fetchedTiers.length > 0) {
                    setOriginalTiers(fetchedTiers);
                    setTiers(fetchedTiers.map(t => ({
                        id: t.id,
                        min_calls: t.min_calls,
                        max_calls: t.max_calls === -1 ? '' : t.max_calls,
                        unit_price: t.unit_price,
                        is_infinite: t.max_calls === -1
                    })));
                } else {
                    setOriginalTiers([]);
                    setTiers([{ min_calls: 1, max_calls: '', unit_price: '', is_infinite: false }]);
                }
            } catch (err) {
                console.error("Failed to fetch tiers", err);
                setOriginalTiers([]);
                setTiers([{ min_calls: 1, max_calls: '', unit_price: '', is_infinite: false }]);
            } finally {
                setFetching(false);
            }
        };

        if (isOpen) {
            setError(null);
            fetchTiers();
        }
    }, [isOpen, rateCardId]);

    const handleTierChange = (index, field, value) => {
        const newTiers = [...tiers];
        newTiers[index][field] = value;
        setTiers(newTiers);
    };

    const handleInfiniteToggle = (index) => {
        const newTiers = [...tiers];
        newTiers[index].is_infinite = !newTiers[index].is_infinite;
        if (newTiers[index].is_infinite) {
            newTiers[index].max_calls = '';
        }
        setTiers(newTiers);
    };

    const addTierRow = () => {
        const lastTier = tiers[tiers.length - 1];
        let nextMin = 1;

        if (lastTier) {
            const lastMax = parseInt(lastTier.max_calls, 10);
            if (!isNaN(lastMax) && !lastTier.is_infinite) {
                nextMin = lastMax + 1;
            }
        }
        setTiers([...tiers, { min_calls: nextMin, max_calls: '', unit_price: '', is_infinite: false }]);
    };

    const removeTierRow = (index) => {

        if (index === tiers.length - 1 && tiers.length > 1) {
            const newTiers = tiers.filter((_, i) => i !== index);
            setTiers(newTiers);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation
        const lastTier = tiers[tiers.length - 1];
        if (!lastTier.is_infinite && !lastTier.max_calls) {
            setError("Tier must either be infinite or have a max calls value.");
            return;
        }
        if (!lastTier.unit_price) {
            setError("Tier must have a unit price.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            for (const t of originalTiers) {
                if (t.id) {
                    try {
                        await subscriptionTierService.deleteSubscriptionTier(t.id);
                    } catch (delErr) {
                        console.warn(`Failed to delete tier ${t.id}`, delErr);
                    }
                }
            }

            for (const tier of tiers) {
                const payload = {
                    rate_card_id: rateCardId,
                    min_calls: parseInt(tier.min_calls, 10),
                    max_calls: tier.is_infinite ? -1 : parseInt(tier.max_calls, 10),
                    unit_price: parseFloat(tier.unit_price)
                };
                await subscriptionTierService.createSubscriptionTier(payload);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError("ERROR: " +
                (Array.isArray(err.response?.data?.errors.error)
                    ? err.response.data.errors.error.join(', ')
                    : err.response?.data?.errors.error)
                || err.response?.data?.message
                || 'Failed to save tiers. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const isFixedFixed = pricingType === 'Fixed' && strategy === 'Fixed';
    
    const isLastTierValid = () => {
        const lastTier = tiers[tiers.length - 1];
        const minCalls = parseInt(lastTier.min_calls, 10);
        const maxCalls = parseInt(lastTier.max_calls, 10);
        
        if (lastTier.is_infinite) return lastTier.unit_price !== '';
        return lastTier.max_calls !== '' && lastTier.unit_price !== '' && minCalls < maxCalls;
    };

    const canAddTier = !tiers[tiers.length - 1].is_infinite && isLastTierValid() && (!isFixedFixed || tiers.length === 0);

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title="Manage Tiers"
            maxWidth="max-w-4xl"
        >
            {fetching ? (
                <div className="py-10 text-center text-gray-500">
                    <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                    Loading existing tiers...
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800">
                            {error}
                        </div>
                    )}
                    <div className="space-y-6">
                        {tiers.map((tier, index) => {
                            const isLast = index === tiers.length - 1;
                            return (
                                <div key={index} className="grid grid-cols-12 gap-6 items-end pb-6 border-b border-gray-100 last:border-0">
                                    <div className="col-span-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Min Calls</label>
                                        <input
                                            type="number"
                                            value={tier.min_calls}
                                            readOnly
                                            className="block w-full rounded-md border-gray-300 bg-gray-100 border p-2.5 text-gray-500 focus:outline-none sm:text-sm cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="col-span-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Calls</label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="number"
                                                value={tier.max_calls}
                                                onChange={(e) => handleTierChange(index, 'max_calls', e.target.value)}
                                                disabled={tier.is_infinite || !isLast}
                                                className="block w-full rounded-md border-gray-300 bg-white border p-2.5 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                                            />
                                            <div className="flex items-center h-full pt-1">
                                                <input
                                                    id={`infinite-${index}`}
                                                    type="checkbox"
                                                    checked={tier.is_infinite}
                                                    onChange={() => handleInfiniteToggle(index)}
                                                    disabled={!isLast}
                                                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:bg-gray-100"
                                                />
                                                <label htmlFor={`infinite-${index}`} className={`ml-2 text-sm ${!isLast ? 'text-gray-400' : 'text-gray-700'}`}>Infinity</label>
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
                                            disabled={!isLast}
                                            className="block w-full rounded-md border-gray-300 bg-white border p-2.5 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-400"
                                        />
                                    </div>

                                    <div className="col-span-1 text-right pb-1">
                                        {isLast && tiers.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTierRow(index)}
                                                className="inline-flex items-center justify-center p-2 rounded text-gray-400 hover:text-red-500 hover:bg-gray-50 focus:outline-none transition-colors"
                                                title="Remove Tier"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={addTierRow}
                            disabled={!canAddTier}
                            className={`inline-flex items-center text-sm font-medium ${canAddTier ? 'text-indigo-600 hover:text-indigo-800' : 'text-gray-300 cursor-not-allowed opacity-50'}`}
                        >
                            <PlusIcon className="mr-1 h-5 w-5" />
                            Add another tier
                        </button>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !isLastTierValid()}
                                className="inline-flex justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm disabled:opacity-70"
                            >
                                {loading ? 'Saving...' : 'Save Tiers'}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </ModalWrapper>
    );
}
