import React, { useState, useEffect } from 'react';
import TierList from './TierList';
import RateCardModal from '../modals/RateCardModal';
import TierModal from '../modals/TierModal';
import { ChevronIcon, EditIcon, PlusIcon, SettingsIcon } from '../icons';


function RateCardItem({ rateCard, onRefresh, onManageTiers }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
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
                    {/* Edit Rate Card Dates */}
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); }}
                        className="group inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 focus:outline-none"
                    >
                        <EditIcon className="-ml-0.5 mr-2 h-4 w-4 transition-colors duration-200" />
                        Edit Rate-Card
                    </button>
                    {/* Manage Tiers (Bulk Add/Edit) */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onManageTiers(rateCard); }}
                        className="group inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 focus:outline-none"
                    >
                        <SettingsIcon className="-ml-0.5 mr-2 h-4 w-4 transition-colors duration-200" />
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
        </div>
    );
}

export default function RateCardList({ subscriptionId, initialRateCards, onRefresh, pricingType, strategy }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [rateCards, setRateCards] = useState(initialRateCards || []);


    const [tierModalConfig, setTierModalConfig] = useState({ isOpen: false, rateCardId: null, tiers: [] });

    useEffect(() => {
        setRateCards(initialRateCards || []);
    }, [initialRateCards]);

    const handleRateCardSuccess = (newRateCardId) => {
        onRefresh();
        if (newRateCardId) {
            setTierModalConfig({
                isOpen: true,
                rateCardId: newRateCardId,
                tiers: []
            });
        }
    };

    const openManageTiers = (rateCard) => {
        setTierModalConfig({
            isOpen: true,
            rateCardId: rateCard.id,
            tiers: rateCard.tiers || []
        });
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-900">Rate Cards</h4>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="group inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 focus:outline-none"
                >
                    <PlusIcon className="-ml-0.5 mr-2 h-4 w-4 transition-colors duration-200" />
                    Add Rate Card
                </button>
            </div>

            {rateCards.length === 0 ? (
                <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-md p-4 text-center">
                    No rate cards found. Add one to define pricing tiers.
                </div>
            ) : (
                rateCards.map(rc => (
                    <RateCardItem
                        key={rc.id}
                        rateCard={rc}
                        onRefresh={onRefresh}
                        onManageTiers={openManageTiers}
                    />
                ))
            )}

            <RateCardModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                subscriptionId={subscriptionId}
                onSuccess={handleRateCardSuccess}
            />

            <TierModal
                isOpen={tierModalConfig.isOpen}
                onClose={() => setTierModalConfig({ ...tierModalConfig, isOpen: false })}
                rateCardId={tierModalConfig.rateCardId}
                initialData={tierModalConfig.tiers}
                onSuccess={onRefresh}
                pricingType={pricingType}
                strategy={strategy}
            />
        </div>
    );
}
