import React, { useState, useEffect } from 'react';
import { productService, contractService, subscriptionService } from '../../services';
import ModalWrapper from '../ModalWrapper';

export default function SubscriptionModal({ isOpen, onClose, contractId, onSuccess, initialData = null }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: '',
    pricing_type: 'Fixed',
    strategy: 'Fixed'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!initialData;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.listProducts();
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
          product_id: initialData.product_id || '',
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

    if (name === 'pricing_type') {
      if (value === 'Fixed') {
        newFormData.strategy = 'Fixed';
      } else if (value === 'Variable') {
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
      setError(err.response?.data?.errors.error || err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} subscription.`);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!window.confirm('Are you sure you want to archive this subscription?')) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await subscriptionService.deleteSubscription(initialData.id);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.errors.error || err.response?.data?.message || 'Failed to archive subscription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Subscription' : 'Add Subscription'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="product_id" className="block text-sm font-medium text-gray-700 mb-1">Product</label>
          <select
            id="product_id"
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            required
            disabled={isEdit}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
          >
            <option value="">Select a Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.api_name}</option>
            ))}
          </select>
          {isEdit && <p className="text-xs text-gray-500 mt-1">Product cannot be changed once created.</p>}
        </div>

        <div>
          <label htmlFor="pricing_type" className="block text-sm font-medium text-gray-700 mb-1">Pricing Type</label>
          <select
            id="pricing_type"
            name="pricing_type"
            value={formData.pricing_type}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
          >
            <option value="Fixed">Fixed</option>
            <option value="Variable">Variable</option>
          </select>
        </div>

        <div>
          <label htmlFor="strategy" className="block text-sm font-medium text-gray-700 mb-1">Strategy</label>
          <select
            id="strategy"
            name="strategy"
            value={formData.strategy}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
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
              {loading ? 'Saving...' : (isEdit ? 'Update Subscription' : 'Add Subscription')}
            </button>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
}
