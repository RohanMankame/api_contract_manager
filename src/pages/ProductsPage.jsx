import { useState, useCallback } from 'react';
import AgGridTable from '../components/AgGridTable';
import ProductModal from '../components/modals/ProductModal';
import { productService } from '../services';

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchProducts = useCallback(async () => {
    const res = await productService.listProducts();
    // Envelope { data: { products: [...] } }
    return (res?.data?.data?.products) || [];
  }, [refreshTrigger]);

  const handleAddClick = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleRowClick = (event) => {
    setSelectedProduct(event.data);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const productCols = [
    { field: 'api_name', headerName: 'API Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 ">
      <div className="mt-16 text-left ">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-900 ">Products</h1>
            <p className="text-gray-500 text-sm">Manage your API Products.</p>
          </div>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Product
          </button>
        </div>

        <div className="mt-6 w-full">
          <AgGridTable
            fetcher={fetchProducts}
            colDefs={productCols}
            gridHeight="500px"
            onRowClicked={handleRowClick}
          />
        </div>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
        onSuccess={handleSuccess}
      />
    </div>
  );
}