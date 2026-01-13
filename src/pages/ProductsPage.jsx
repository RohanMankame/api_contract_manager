import { TopNavbar, Sidebar } from '../components/nav';
import AgGridTable from '../components/AgGridTable';
import { productService } from '../services';

export default function ProductsPage() {
  const fetchProducts = async () => {
    const res = await productService.listProducts();
    // Envelope { data: { products: [...] } }
    return (res?.data?.data?.products) || [];
  };

  const productCols = [
    { field: 'id', headerName: 'ID', width: 110 },
    { field: 'api_name', headerName: 'API Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'is_archived', headerName: 'Archived', width: 120 },
  ];

    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavbar />
        <Sidebar />
  
        <div className="mt-16 text-left ">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Products</h1>
            <p>Product Page. Use table below to manage Products.</p>
          </div>
  
          <div className="mt-6 w-full">
            <AgGridTable fetcher={fetchProducts} colDefs={productCols} gridHeight="600px" />
          </div>
        </div>
      </div>
    );
  } 