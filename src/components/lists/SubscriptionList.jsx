import React, { useState } from 'react';
import RateCardList from './RateCardList';
import SubscriptionModal from '../modals/SubscriptionModal';
import { ChevronIcon, EditIcon, PlusIcon } from '../icons';

function SubscriptionCard({ subscription, onRefresh }) {
    const { product, pricing_type, strategy, tiers, rate_cards, id } = subscription;
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const displayRateCards = rate_cards || [];

    const bubbleText = pricing_type === 'Fixed' ? 'Fixed' : `${pricing_type}-${strategy}`;

    return (
        <div className="bg-white shadow rounded-lg mb-6 border border-gray-200 overflow-hidden">
            {/* Header - Click to Toggle */}
            <div
                className="bg-gray-50 px-4 py-4 border-b border-gray-200 sm:px-6 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <ChevronIcon className="h-5 w-5 text-gray-400 mr-3" expanded={isExpanded} />
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                {product?.api_name || 'Unknown Product'}
                            </h3>
                            <p className="text-xs text-gray-500">Subscription ID: {id}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Unified Bubble */}
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {bubbleText}
                        </span>

                        <button
                            onClick={(e) => { e.stopPropagation(); setIsEditOpen(true); }}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <EditIcon className="-ml-0.5 mr-2 h-4 w-4 text-gray-500" />
                            Edit
                        </button>
                    </div>
                </div>
            </div>

            {/* Collapsible Content */}
            {isExpanded && (
                <div className="px-4 py-5 sm:p-6">
                    <RateCardList
                        subscriptionId={id}
                        initialRateCards={displayRateCards}
                        onRefresh={onRefresh}
                    />
                </div>
            )}

            <SubscriptionModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                contractId={subscription.contract_id}
                onSuccess={onRefresh}
                initialData={subscription}
            />
        </div>
    );
}

export default function SubscriptionList({ subscriptions, contractId, onRefresh }) {
    const [isAddOpen, setIsAddOpen] = useState(false);

    const activeSubscriptions = subscriptions?.filter(s => !s.is_archived) || [];

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Subscriptions</h2>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                    Subscription
                </button>
            </div>

            {activeSubscriptions.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">No subscriptions found for this contract.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {activeSubscriptions.map(sub => (
                        <SubscriptionCard key={sub.id} subscription={sub} onRefresh={onRefresh} />
                    ))}
                </div>
            )}

            <SubscriptionModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                contractId={contractId}
                onSuccess={onRefresh}
            />
        </div>
    );
}
