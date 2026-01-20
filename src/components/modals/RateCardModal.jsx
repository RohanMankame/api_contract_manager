import React, { useState, useEffect } from 'react';
import { rateCardService } from '../../services';
import ModalWrapper from '../ModalWrapper';

export default function RateCardModal({ isOpen, onClose, subscriptionId, onSuccess, initialData = null }) {
    const [formData, setFormData] = useState({
        start_date: '',
        end_date: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isEdit = !!initialData;

    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (initialData) {
                const formatForInput = (dateStr) => {
                    if (!dateStr) return '';
                    const date = new Date(dateStr);
                    const offset = date.getTimezoneOffset() * 60000;
                    return (new Date(date - offset)).toISOString().slice(0, 16);
                };

                setFormData({
                    start_date: formatForInput(initialData.start_date),
                    end_date: formatForInput(initialData.end_date)
                });
            } else {
                setFormData({
                    start_date: '',
                    end_date: ''
                });
            }
        }
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                start_date: new Date(formData.start_date).toISOString(),
                end_date: new Date(formData.end_date).toISOString(),
            };

            if (isEdit) {
                await rateCardService.updateRateCard(initialData.id, payload);
                onSuccess();
            } else {
                const res = await rateCardService.createRateCard({
                    subscription_id: subscriptionId,
                    ...payload
                });
                // Pass the new ID to the success callback
                // Response structure: res.data.data.rate_card.id
                const newId = res.data?.data?.rate_card?.id || res.data?.data?.id || res.data?.id;
                console.log('RateCardModal: Created Rate Card ID:', newId);
                onSuccess(newId);
            }
            onClose();
        } catch (err) {
            console.error(err);
            setError( "ERROR: " +
            (Array.isArray(err.response?.data?.errors.error) 
                ? err.response.data.errors.error.join(', ')
                : err.response?.data?.errors.error) 
            || err.response?.data?.message 
            || 'Failed to save rate card. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async () => {
        if (!window.confirm('Are you sure you want to archive this rate card?')) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await rateCardService.deleteRateCard(initialData.id);
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError( "ERROR: " +
            (Array.isArray(err.response?.data?.errors.error) 
                ? err.response.data.errors.error.join(', ')
                : err.response?.data?.errors.error) 
            || err.response?.data?.message 
            || 'Failed to archive rate card. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? 'Edit Rate Card' : 'Add Rate Card'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                        type="datetime-local"
                        id="start_date"
                        name="start_date"
                        required
                        value={formData.start_date}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                    />
                </div>

                <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                        type="datetime-local"
                        id="end_date"
                        name="end_date"
                        required
                        value={formData.end_date}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                    />
                </div>

                <div className="flex items-center justify-between pt-4">
                    {isEdit ? (
                        <button
                            type="button"
                            onClick={handleArchive}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-2 rounded transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Archive
                        </button>
                    ) : (
                        <div />
                    )}

                    <div className="flex space-x-3">
                        <button
                            type="button"
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (isEdit ? 'Update Rate Card' : 'Add Rate Card')}
                        </button>
                    </div>
                </div>
            </form>
        </ModalWrapper>
    );
}
