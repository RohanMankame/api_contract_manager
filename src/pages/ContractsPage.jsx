import AgGridTable from '../components/AgGridTable';
import { contractService } from '../services';

export default function ContractsPage() {
  const fetchContracts = async () => {
    const res = await contractService.listContracts();
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
        <div className="mt-4 text-left">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Contracts</h1>
            <p>Contracts Page. Use table below to manage Contracts.</p>
          </div>

          <div className="mt-6 w-full">
            <AgGridTable
              fetcher={fetchContracts}
              colDefs={contractCols}
              gridHeight="400px"
            />
          </div>
        </div>
    );

  } 