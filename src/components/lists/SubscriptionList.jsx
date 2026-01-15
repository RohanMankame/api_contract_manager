import React, { useState } from 'react';
import RateCardList from './RateCardList';
import SubscriptionModal from '../modals/SubscriptionModal';

function SubscriptionCard({ subscription, onRefresh }) {
    const { product, pricing_type, strategy, tiers, rate_cards, id } = subscription;
    const [isEditOpen, setIsEditOpen] = useState(false);

    const displayRateCards = rate_cards || [];

    return (
        <div className="bg-white shadow rounded-lg mb-6 border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-4 border-b border-gray-200 sm:px-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {product?.api_name || 'Unknown Product'}
                        </h3>
                        <p className="text-xs text-gray-500">Sub ID: {id}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="flex space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {pricing_type}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {strategy}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsEditOpen(true)}
                            className="ml-4 text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
                <RateCardList
                    subscriptionId={id}
                    initialRateCards={displayRateCards}
                    onRefresh={onRefresh}
                />
            </div>
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

    // Filter out archived if needed? API usually handles it or returns `is_archived`.
    const activeSubscriptions = subscriptions?.filter(s => !s.is_archived) || [];

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Subscriptions</h2>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Add Subscription
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
