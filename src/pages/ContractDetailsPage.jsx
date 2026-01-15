import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ContractDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="mt-4 text-left">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-medium text-gray-900">Contract Details</h1>
                    <p className="text-gray-500 text-sm">Viewing details for contract ID: {id}</p>
                </div>
                <button
                    onClick={() => navigate('/contracts')}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Back to Contracts
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Contract Information</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and attachments.</p>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Contract ID</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{id}</dd>
                        </div>
                        {/* More details will be added later */}
                    </dl>
                </div>
            </div>
        </div>
    );
}
