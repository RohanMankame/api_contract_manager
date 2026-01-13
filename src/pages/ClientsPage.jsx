import { TopNavbar, Sidebar } from '../components/nav';
import AgGridTable from '../components/AgGridTable';
import { clientService } from '../services';

export default function ClientsPage() {
  const fetchClients = async () => {
    const res = await clientService.listClients();
    return (res?.data?.data?.clients) || [];
  };

  const clientCols = [
    { field: 'id', headerName: 'ID', width: 110 },
    { field: 'company_name', headerName: 'Company', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone_number', headerName: 'Phone', width: 160 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'is_archived', headerName: 'Archived', width: 120 },
  ];

    return (
      <div className="min-h-screen bg-gray-50">
        <TopNavbar />
        <Sidebar />
  
        <div className="mt-16 text-left ">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Clients</h1>
            <p>Client Page. Use table below to manage clients.</p>
          </div>
  
          <div className="mt-6 w-full">
            <AgGridTable fetcher={fetchClients} colDefs={clientCols} gridHeight="600px" />
          </div>
        </div>
      </div>
    );
  }