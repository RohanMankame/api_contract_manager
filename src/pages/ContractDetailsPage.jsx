import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContractInfoCard from '../components/infocards/ContractInfoCard';
import ContractModal from '../components/modals/ContractModal';
import SubscriptionList from '../components/lists/SubscriptionList';
import { contractService, rateCardService } from '../services';

export default function ContractDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Helper to build the hierarchy properly since API might be flat or missing deep nesting
    const fetchFullContractDetails = async (contractId) => {
        // 1. Fetch Contract (has basic subs info potentially)
        const contractRes = await contractService.getContractById(contractId);
        let contractData = contractRes.data?.data?.contract || contractRes.data?.data || contractRes.data;

        // 2. Fetch Subscriptions explicitly to be sure (or use what's in contractData if robust)
        // API doc says GET /contracts/{id}/subscriptions exists.
        const subsRes = await contractService.getContractSubscriptions(contractId);
        const subscriptions = subsRes.data?.data?.subscriptions || [];

        // 3. For each subscription, fetch Rate Cards?
        // User said "subscriptions hold ratecards".
        // API doesn't have "get rate cards for subscription". It has listRateCards.
        // We might have to fetch listRateCards and filter. 
        // OR check if subscription object already has it?
        // Let's assume we need to fetch all rate cards and match them.
        // Optimization: If API supported filter, we'd use it. For now, fetch all (warning: scaling issue).
        // Better: Fetch rate cards for each subscription if a specific endpoint existed.
        // Alternate: Maybe the subscription object in `subscriptions` array DOES have it?
        // Let's try to map rate cards to subscriptions.

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
        return contractData;
    };

    useEffect(() => {
        const fetchContract = async () => {
            try {
                setLoading(true);
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
