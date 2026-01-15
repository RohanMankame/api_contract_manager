import React, { useState } from 'react';
import TierModal from '../modals/TierModal';

export default function TierList({ tiers, rateCardId, onRefresh }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);

    const handleAdd = () => {
        setSelectedTier(null);
        setIsModalOpen(true);
    };

    const handleEdit = (tier) => {
        setSelectedTier(tier);
        setIsModalOpen(true);
    };

    if (!tiers) return null;

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tiers</h5>
                <button
                    onClick={handleAdd}
                    className="text-xs text-indigo-600 hover:text-indigo-900 font-medium"
                >
                    + Add Tier
                </button>
            </div>

            {tiers.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No tiers defined.</p>
            ) : (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-md">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-2 pl-4 pr-3 text-left text-xs font-medium text-gray-500 sm:pl-6">Min Calls</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Max Calls</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Unit Price</th>
                                <th scope="col" className="relative py-2 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {tiers.map((tier) => (
                                <tr key={tier.id}>
                                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{tier.min_calls}</td>
                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{tier.max_calls === -1 ? '∞' : tier.max_calls}</td>
                                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">${Number(tier.unit_price || 0).toFixed(2)}</td>
                                    <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                        <button
                                            onClick={() => handleEdit(tier)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <TierModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                rateCardId={rateCardId}
                onSuccess={onRefresh}
                initialData={selectedTier}
            />
        </div>
    );
}
