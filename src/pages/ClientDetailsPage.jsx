import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ClientInfoCard from '../components/infocards/ClientInfoCard';
import ClientModal from '../components/modals/ClientModal';
import { clientService, userService } from '../services';
import { ContractsIcon, ArrowIcon } from '../components/icons';

export default function ClientDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [contracts, setContracts] = useState([]);
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

                // Fetch user names for audit info
                if (data.created_by) {
                    try {
                        const userRes = await userService.getUserById(data.created_by);
                        const user = userRes.data?.data?.user || userRes.data?.data || userRes.data;
                        data.created_by_name = user.full_name || user.username || 'N/A';
                    } catch (err) {
                        console.error('Failed to fetch creator details', err);
                    }
                }
                if (data.updated_by) {
                    try {
                        const userRes = await userService.getUserById(data.updated_by);
                        const user = userRes.data?.data?.user || userRes.data?.data || userRes.data;
                        data.updated_by_name = user.full_name || user.username || 'N/A';
                    } catch (err) {
                        console.error('Failed to fetch updater details', err);
                    }
                }

                setClient(data);

                // Fetch client contracts
                try {
                    const contractsRes = await clientService.getClientContracts(id);
                    setContracts(contractsRes.data?.data?.contracts || []);
                } catch (err) {
                    console.error("Failed to fetch client contracts", err);
                }

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
        <div className="mt-4 text-left space-y-6 pb-12">

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

            {/* Client Contracts Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-lg font-medium text-gray-900">Contracts</h3>
                    <p className="text-sm text-gray-500">{contracts.length} contracts</p>
                </div>

                {contracts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {contracts.map((contract) => (
                            <div
                                key={contract.id}
                                onClick={() => navigate(`/contracts/${contract.id}`)}
                                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-indigo-200 cursor-pointer"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300 flex items-center justify-center">
                                            <ContractsIcon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 truncate">
                                                {contract.contract_name || 'Unnamed Contract'}
                                            </h4>
                                            <p className="mt-1 text-sm font-medium text-gray-500 whitespace-nowrap">
                                                {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-start">
                                    <div className="text-indigo-500 transform -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        <ArrowIcon className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 className="mt-2 text-sm font-medium text-gray-900">No contracts found</h4>
                        <p className="mt-1 text-sm text-gray-500">This client doesn't have any associated contracts yet.</p>
                    </div>
                )}
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
