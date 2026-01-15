import React, { useState, useEffect } from 'react';
import TierList from './TierList';
import RateCardModal from '../modals/RateCardModal';

function RateCardItem({ rateCard, onRefresh }) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-md p-4 mb-4 bg-gray-50">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-sm font-medium text-gray-900">
                        Date Range:
                        <span className="font-normal text-gray-600 ml-2">
                            {new Date(rateCard.start_date).toLocaleDateString()} - {new Date(rateCard.end_date).toLocaleDateString()}
                        </span>
                    </p>
                    <p className="text-xs text-gray-400">ID: {rateCard.id}</p>
                </div>
                <button
                    onClick={() => setIsEditOpen(true)}
                    className="text-xs text-indigo-600 hover:text-indigo-900"
                >
                    Edit
                </button>
            </div>

            <TierList tiers={rateCard.tiers || []} rateCardId={rateCard.id} onRefresh={onRefresh} />

            <RateCardModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                subscriptionId={rateCard.subscription_id}
                onSuccess={onRefresh}
                initialData={rateCard}
            />
        </div>
    );
}

export default function RateCardList({ subscriptionId, initialRateCards, onRefresh }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [rateCards, setRateCards] = useState(initialRateCards || []);

    useEffect(() => {
        setRateCards(initialRateCards || []);
    }, [initialRateCards]);

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-900">Rate Cards</h4>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add Rate Card
                </button>
            </div>

            {rateCards.length === 0 ? (
                <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-md p-4 text-center">
                    No rate cards found. Add one to define pricing tiers.
                </div>
            ) : (
                rateCards.map(rc => (
                    <RateCardItem key={rc.id} rateCard={rc} onRefresh={onRefresh} />
                ))
            )}

            <RateCardModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                subscriptionId={subscriptionId}
                onSuccess={onRefresh}
            />
        </div>
    );
}
