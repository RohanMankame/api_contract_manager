import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AgGridTable from '../components/AgGridTable';
import ProductModal from '../components/modals/ProductModal';
import ActionModal from '../components/modals/ActionModal';
import { productService } from '../services';
import { PlusIcon } from '../components/icons';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
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
    setIsActionModalOpen(true);
  };

  const handleActionViewDetails = () => {
    if (selectedProduct) {
      navigate(`/products/${selectedProduct.id || selectedProduct.product_id}`);
    }
  };

  const handleActionQuickEdit = () => {
    setIsActionModalOpen(false);
    setIsModalOpen(true);
  };

  const handleActionClose = () => {
    setIsActionModalOpen(false);
    setSelectedProduct(null);
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
    <div className="mt-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">Double click on table rows for actions.</p>
        </div>
      </div>

      <div className="mt-6 w-full">
        <AgGridTable
          fetcher={fetchProducts}
          colDefs={productCols}
          gridHeight="500px"
          onRowDoubleClicked={handleRowClick}
          onViewDetails={(data) => navigate(`/products/${data.id || data.product_id}`)}
          onEditRow={(data) => {
            setSelectedProduct(data);
            setIsModalOpen(true);
          }}
          headerActions={
            <button
              onClick={handleAddClick}
              className="group inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 focus:outline-none"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5 transition-colors duration-200" />
              Add Product
            </button>
          }
        />
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={selectedProduct}
        onSuccess={handleSuccess}
      />

      <ActionModal
        isOpen={isActionModalOpen}
        onClose={handleActionClose}
        title="Product Actions"
        entityData={selectedProduct ? { name: selectedProduct.api_name, id: selectedProduct.id || selectedProduct.product_id } : null}
        onViewDetails={handleActionViewDetails}
        onQuickEdit={handleActionQuickEdit}
      />
    </div>
  );
}