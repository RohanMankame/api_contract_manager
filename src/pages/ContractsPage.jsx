import { TopNavbar, Sidebar } from '../components/nav';
import AgGridTable from '../components/AgGridTable';
import { contractService } from '../services';

export default function ContractsPage() {
  const fetchContracts = async () => {
    const res = await contractService.listContracts();
    // Envelope { data: { contracts: [...] } }
    return (res?.data?.data?.contracts) || [];
  };

  const contractCols = [
    { field: 'id', headerName: 'ID', flex: 2 },
    { field: 'contract_name', headerName: 'Contract Name', flex: 2 },
    { field: 'client_id', headerName: 'Client ID', flex: 2 },
    { field: 'start_date', headerName: 'Start Date', flex: 1 },
    { field: 'end_date', headerName: 'End Date', flex: 1 },
    
  ];

  return (
    <div className="min-h-screen bg-gray-50 pl-6">
      <TopNavbar />
      <Sidebar />
      <div className="ml-20 mt-20 p-8">
        <h1 className="text-3xl font-bold text-gray-900">Contracts</h1>
        <div className="mt-6">
          <AgGridTable fetcher={fetchContracts} colDefs={contractCols} />
        </div>
      </div>
    </div>
  );
}