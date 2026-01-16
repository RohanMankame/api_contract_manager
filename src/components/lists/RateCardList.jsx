import React, { useState, useEffect } from 'react';
import TierList from './TierList';
import RateCardModal from '../modals/RateCardModal';
import TierModal from '../modals/TierModal';
import { ChevronIcon, EditIcon, PlusIcon, SettingsIcon } from '../icons';

function RateCardItem({ rateCard, onRefresh }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isTierModalOpen, setIsTierModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="border border-gray-200 rounded-md mb-4 bg-gray-50 overflow-hidden">
            <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center">
                    <ChevronIcon className="h-4 w-4 text-gray-400 mr-2" expanded={isExpanded} />
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            Date Range:
                            <span className="font-normal text-gray-600 ml-2">
                                {new Date(rateCard.start_date).toLocaleDateString()} - {new Date(rateCard.end_date).toLocaleDateString()}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex space-x-4 items-center">
                    {/* Edit Rate Card Details */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); }}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <EditIcon className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" />
                        Edit Details
                    </button>
                    {/* Manage Tiers (Bulk Add/Edit) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsTierModalOpen(true); }}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <SettingsIcon className="-ml-0.5 mr-2 h-5 w-5 text-gray-500" />
                        Manage Tiers
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-200 pt-3">
                    <TierList tiers={rateCard.tiers || []} />
                </div>
            )}

            <RateCardModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                subscriptionId={rateCard.subscription_id}
                onSuccess={onRefresh}
                initialData={rateCard}
            />

            <TierModal
                isOpen={isTierModalOpen}
                onClose={() => setIsTierModalOpen(false)}
                rateCardId={rateCard.id}
                initialData={rateCard.tiers || []} // Pass existing tiers for bulk edit
                onSuccess={onRefresh}
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
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" />
                    Rate Card
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
