import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientInfoCard from '../components/infocards/ClientInfoCard';
import ClientModal from '../components/modals/ClientModal';
import { clientService } from '../services';

export default function ClientDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                setLoading(true);
                const response = await clientService.getClientById(id);
                // Similar to contracts, handle potential data structures
                const data = response.data?.data?.client || response.data?.data || response.data;
                setClient(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch client", err);
                setError("Failed to load client details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchClient();
        }
    }, [id, refreshTrigger]);

    const handleEditSuccess = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="mt-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-8 text-center text-red-600">
                {error}
                <button onClick={() => navigate('/clients')} className="ml-2 text-indigo-600 hover:text-indigo-500 underline">Go back</button>
            </div>
        );
    }

    return (
        <div className="mt-4 text-left space-y-6">

            <button
                onClick={() => navigate('/clients')}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-10 focus:outline-none"
            >
                <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to Clients
            </button>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-medium text-gray-900">Client Details</h1>
                    <p className="text-gray-500 text-sm">Viewing details for client ID: {id}</p>
                </div>

            </div>

            <ClientInfoCard
                client={client}
                onEdit={() => setIsEditModalOpen(true)}
            />

            {/* Placeholder for related lists e.g. Contracts for this client */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">More</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">information.</p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <div className="py-5 px-6 text-sm text-gray-500">
                        Placeholder.
                    </div>
                </div>
            </div>

            <ClientModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                client={client}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
}
