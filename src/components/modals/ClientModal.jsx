import { useState, useEffect } from 'react';
import ModalWrapper from '../ModalWrapper';
import { clientService } from '../../services';

export default function ClientModal({ isOpen, onClose, client, onSuccess }) {
    const [formData, setFormData] = useState({
        company_name: '',
        email: '',
        phone_number: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (client) {
                setFormData({
                    company_name: client.company_name || '',
                    email: client.email || '',
                    phone_number: client.phone_number || '',
                    address: client.address || '',
                });
            } else {
                setFormData({
                    company_name: '',
                    email: '',
                    phone_number: '',
                    address: '',
                });
            }
        }
    }, [client, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (client) {
                await clientService.updateClient(client.id, formData);
            } else {
                await clientService.createClient(formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save client. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await clientService.deleteClient(client.id);
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to delete client.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title={client ? 'Edit Client' : 'Add New Client'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                    </label>
                    <input
                        type="text"
                        id="company_name"
                        name="company_name"
                        required
                        value={formData.company_name}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
                        placeholder="Acme Corp"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
                        placeholder="contact@acme.com"
                    />
                </div>

                <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
                        placeholder="+1-555-0000"
                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
                        placeholder="123 Main St"
                    />
                </div>

                <div className="flex items-center justify-between pt-4">
                    {client ? (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-2 rounded transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Delete Client
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
                            {loading ? 'Saving...' : client ? 'Update Client' : 'Add Client'}
                        </button>
                    </div>
                </div>
            </form>
        </ModalWrapper>
    );
}
