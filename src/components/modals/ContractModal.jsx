import { useState, useEffect } from 'react';
import ModalWrapper from '../ModalWrapper';
import { contractService, clientService } from '../../services';

export default function ContractModal({ isOpen, onClose, contract, onSuccess }) {
    const [formData, setFormData] = useState({
        contract_name: '',
        client_id: '',
        start_date: '',
        end_date: '',
    });
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch clients for dropdown
    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            clientService.listClients()
                .then(res => {
                    setClients(res.data?.data?.clients || []);
                })
                .catch(err => {
                    console.error("Failed to load clients", err);
                    setError("Failed to load clients list.");
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            // Keep existing error if client fetch failed
            if (!clients.length && !loading) {
                // Maybe don't clear error immediately if it was about fetching clients
            } else {
                setError(null);
            }

            if (contract) {
                // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
                // Assuming API returns ISO strings (2026-01-01T00:00:00Z)
                const formatForInput = (dateStr) => {
                    if (!dateStr) return '';
                    const date = new Date(dateStr);
                    // Local ISO string hack
                    const offset = date.getTimezoneOffset() * 60000;
                    const localISOTime = (new Date(date - offset)).toISOString().slice(0, 16);
                    return localISOTime;
                };

                setFormData({
                    contract_name: contract.contract_name || '',
                    client_id: contract.client_id || '',
                    start_date: formatForInput(contract.start_date),
                    end_date: formatForInput(contract.end_date),
                });
            } else {
                setFormData({
                    contract_name: '',
                    client_id: '',
                    start_date: '',
                    end_date: '',
                });
            }
        }
    }, [contract, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            // Convert local datetime back to ISO if needed, or send as is if backend handles it.
            // Usually backend expects ISO.
            const payload = {
                ...formData,
                start_date: new Date(formData.start_date).toISOString(),
                end_date: new Date(formData.end_date).toISOString(),
            };

            if (contract) {
                await contractService.updateContract(contract.id, payload);
            } else {
                await contractService.createContract(payload);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
           setError( "ERROR: " +
            (Array.isArray(err.response?.data?.errors.error) 
                ? err.response.data.errors.error.join(', ')
                : err.response?.data?.errors.error) 
            || err.response?.data?.message 
            || 'Failed to save contract. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async () => {
        if (!window.confirm('Are you sure you want to archive this contract?')) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await contractService.deleteContract(contract.id);
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.errors.error || err.response?.data?.message || 'Failed to archive contract.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title={contract ? 'Edit Contract' : 'Add New Contract'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Client *
                    </label>
                    <select
                        id="client_id"
                        name="client_id"
                        required
                        value={formData.client_id}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
                        disabled={loading}
                    >
                        <option value="">Select a Client</option>
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.company_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="contract_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Contract Name *
                    </label>
                    <input
                        type="text"
                        id="contract_name"
                        name="contract_name"
                        required
                        value={formData.contract_name}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
                        placeholder="e.g. Annual Deal 2026"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date *
                        </label>
                        <input
                            type="datetime-local"
                            id="start_date"
                            name="start_date"
                            required
                            value={formData.start_date}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                            End Date *
                        </label>
                        <input
                            type="datetime-local"
                            id="end_date"
                            name="end_date"
                            required
                            value={formData.end_date}
                            onChange={handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                    {contract ? (
                        <button
                            type="button"
                            onClick={handleArchive}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-2 rounded transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Archive
                        </button>
                    ) : (
                        <div /> /* Spacer */
                    )}

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : contract ? 'Update Contract' : 'Add Contract'}
                        </button>
                    </div>
                </div>
            </form>
        </ModalWrapper>
    );
}
