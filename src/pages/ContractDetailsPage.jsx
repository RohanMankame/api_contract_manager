import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContractInfoCard from '../components/infocards/ContractInfoCard';
import ContractModal from '../components/modals/ContractModal';
import SubscriptionList from '../components/lists/SubscriptionList';
import { contractService, rateCardService, clientService } from '../services';
import { generateContractDocument } from '../utils/contractExport';

export default function ContractDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);


    const fetchFullContractDetails = async (contractId) => {

        const contractRes = await contractService.getContractById(contractId);
        let contractData = contractRes.data?.data?.contract || contractRes.data?.data || contractRes.data;


        const subsRes = await contractService.getContractSubscriptions(contractId);
        const subscriptions = subsRes.data?.data?.subscriptions || [];


        const rateCardsRes = await rateCardService.listRateCards();
        const allRateCards = rateCardsRes.data?.data?.rate_cards || [];

        const enrichedSubscriptions = subscriptions.map(sub => {
            // Find rate cards for this sub
            const subRateCards = allRateCards.filter(rc => rc.subscription_id === sub.id || rc.subscription_id === sub.subscription_id);
            return {
                ...sub,
                rate_cards: subRateCards // Nest them
            };
        });

        contractData.subscriptions = enrichedSubscriptions;

        // Fetch client details for name
        if (contractData.client_id) {
            try {
                const clientRes = await clientService.getClientById(contractData.client_id);
                const client = clientRes.data?.data?.client || clientRes.data?.data || clientRes.data;
                contractData.client_name = client.company_name || 'Unknown Client';
            } catch (err) {
                console.error('Failed to fetch client details', err);
                contractData.client_name = 'Unknown Client';
            }
        }

        return contractData;
    };

    useEffect(() => {
        const fetchContract = async () => {
            try {
                if (!contract) {
                    setLoading(true);
                }
                const data = await fetchFullContractDetails(id);
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

    const handleDownloadContract = async () => {
        try {
            await generateContractDocument(contract);
        } catch (err) {
            console.error('Failed to generate contract document:', err);
            alert('Failed to download contract. Please try again.');
        }
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
            <div>
                <button
                    onClick={() => navigate('/contracts')}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2 focus:outline-none"
                >
                    <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Contracts
                </button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-medium text-gray-900">Contract Details</h1>
                        <p className="text-gray-500 text-sm">Viewing details for contract ID: {id}</p>
                    </div>
                    <button
                        onClick={handleDownloadContract}
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download Contract
                    </button>
                </div>
            </div>

            <ContractInfoCard
                contract={contract}
                onEdit={() => setIsEditModalOpen(true)}
            />

            <SubscriptionList
                subscriptions={contract?.subscriptions || []}
                contractId={id}
                onRefresh={handleEditSuccess}
            />

            <ContractModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                contract={contract}
                onSuccess={handleEditSuccess}
            />
        </div>
    );
}
