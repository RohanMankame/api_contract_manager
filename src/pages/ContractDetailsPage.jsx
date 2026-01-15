import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContractInfoCard from '../components/infocards/ContractInfoCard';
import ContractModal from '../components/modals/ContractModal';
import { contractService } from '../services';

export default function ContractDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                setLoading(true);
                const response = await contractService.getContractById(id);
                // Assuming response.data.data is the contract object or similar wrapper
                // Based on standard axios response: response.data
                // Adjusting based on standard patterns or if I saw response structure in previous turns.
                // In ContractsPage: res?.data?.data?.contracts
                // So here it likely is res?.data?.data for single item or res?.data?.data?.contract
                // I will try to support likely structures.
                const data = response.data?.data?.contract || response.data?.data || response.data;
                setContract(data);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch contract", err);
                setError("Failed to load contract details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchContract();
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
                <button onClick={() => navigate('/contracts')} className="ml-2 text-indigo-600 hover:text-indigo-500 underline">Go back</button>
            </div>
        );
    }

    return (
        <div className="mt-4 text-left space-y-6">
            <div className="flex items-center justify-between">
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

            <ContractInfoCard
                contract={contract}
                onEdit={() => setIsEditModalOpen(true)}
            />

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

            <ContractModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                contract={contract}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
}
