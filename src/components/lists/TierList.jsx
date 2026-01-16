import React from 'react';

export default function TierList({ tiers }) {
    if (!tiers || tiers.length === 0) {
        return <p className="text-sm text-gray-400 italic">No tiers defined.</p>;
    }

    return (
        <div className="mt-2">
            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tiers</h5>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-md">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="py-2 pl-4 pr-3 text-left text-xs font-medium text-gray-500 sm:pl-6">Min Calls</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Max Calls</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500">Unit Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {tiers.map((tier) => (
                            <tr key={tier.id}>
                                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{tier.min_calls}</td>
                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{tier.max_calls === -1 ? '∞' : tier.max_calls}</td>
                                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">${Number(tier.unit_price || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
