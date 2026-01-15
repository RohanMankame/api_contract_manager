// Reusable modal for Adding/Editing Subscriptions
import React, { useState, useEffect } from 'react';
import { productService, contractService, subscriptionService } from '../../services';

export default function SubscriptionModal({ isOpen, onClose, contractId, onSuccess, initialData = null }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: '',
    pricing_type: 'Fixed',
    strategy: 'Fixed' // Default strategy for Fixed
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!initialData;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        // Adjust depending on API structure
        setProducts(response.data?.data?.products || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };

    if (isOpen) {
      fetchProducts();
      setError(null);
      if (initialData) {
        setFormData({
          product_id: initialData.product_id || '', // Note: API might return product object, careful with ID
          pricing_type: initialData.pricing_type || 'Fixed',
          strategy: initialData.strategy || 'Fixed'
        });
      } else {
        setFormData({
          product_id: '',
          pricing_type: 'Fixed',
          strategy: 'Fixed'
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    // ... (logic for strategy enforcement)
    if (name === 'pricing_type') {
      if (value === 'Fixed') {
        newFormData.strategy = 'Fixed';
      } else if (value === 'Variable') {
        // If switching TO Variable, default to Pick if current is Fixed
        if (newFormData.strategy === 'Fixed') {
          newFormData.strategy = 'Pick';
        }
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        // Implement Update Logic - Assuming updateSubscription exists or using generic update
        // await subscriptionService.updateSubscription(initialData.id, formData);
        // For now, let's assume update is not fully exposed or use a placeholder if service missing
        await subscriptionService.updateSubscription(initialData.id, formData);
      } else {
        await contractService.createSubscriptionUnderContract(contractId, {
          contract_id: contractId,
          ...formData
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} subscription.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {isEdit ? 'Edit Subscription' : 'Add Subscription'}
              </h3>

              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {/* Product Selection - Disabled if Edit? Usually products aren't changed easily on an existing sub */}
                <div>
                  <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Product</label>
                  <select
                    id="product_id"
                    name="product_id"
                    value={formData.product_id}
                    onChange={handleChange}
                    required
                    disabled={isEdit}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                  >
                    <option value="">Select a Product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.api_name}</option>
                    ))}
                  </select>
                  {isEdit && <p className="text-xs text-gray-500 mt-1">Product cannot be changed once created.</p>}
                </div>

                <div>
                  <label htmlFor="pricing_type" className="block text-sm font-medium text-gray-700">Pricing Type</label>
                  <select
                    id="pricing_type"
                    name="pricing_type"
                    value={formData.pricing_type}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                  >
                    <option value="Fixed">Fixed</option>
                    <option value="Variable">Variable</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="strategy" className="block text-sm font-medium text-gray-700">Strategy</label>
                  <select
                    id="strategy"
                    name="strategy"
                    value={formData.strategy}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                  >
                    {formData.pricing_type === 'Fixed' ? (
                      <option value="Fixed">Fixed</option>
                    ) : (
                      <>
                        <option value="Pick">Pick</option>
                        <option value="Fill">Fill</option>
                        <option value="Flat">Flat</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Saving...' : (isEdit ? 'Update Subscription' : 'Add Subscription')}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
