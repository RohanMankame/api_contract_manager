import { useState, useEffect } from 'react';
import ModalWrapper from '../ModalWrapper';
import { productService } from '../../services';

export default function ProductModal({ isOpen, onClose, product, onSuccess }) {
    const [formData, setFormData] = useState({
        api_name: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            if (product) {
                setFormData({
                    api_name: product.api_name || '',
                    description: product.description || '',
                });
            } else {
                setFormData({
                    api_name: '',
                    description: '',
                });
            }
        }
    }, [product, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (product) {
                await productService.updateProduct(product.id, formData);
            } else {
                await productService.createProduct(formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleArchive = async () => {
        if (!window.confirm('Are you sure you want to archive this product?')) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await productService.deleteProduct(product.id);
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to archive product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title={product ? 'Edit Product' : 'Add New Product'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="api_name" className="block text-sm font-medium text-gray-700 mb-1">
                        API Name *
                    </label>
                    <input
                        type="text"
                        id="api_name"
                        name="api_name"
                        required
                        value={formData.api_name}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
                        placeholder="e.g. Billing V2"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
                        placeholder="Details about this API product..."
                    />
                </div>

                <div className="flex items-center justify-between pt-4">
                    {product ? (
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
                            {loading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </div>
            </form>
        </ModalWrapper>
    );
}
