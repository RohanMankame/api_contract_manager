import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AgGridTable from '../components/AgGridTable';
import ContractModal from '../components/modals/ContractModal';
import ActionModal from '../components/modals/ActionModal';
import { contractService } from '../services';

export default function ContractsPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchContracts = useCallback(async () => {
    const res = await contractService.listContracts();
    return (res?.data?.data?.contracts) || [];
  }, [refreshTrigger]);

  const handleAddClick = () => {
    setSelectedContract(null);
    setIsModalOpen(true);
  };

  const handleRowClick = (event) => {
    setSelectedContract(event.data);
    setIsActionModalOpen(true);
  };

  const handleActionViewDetails = () => {
    if (selectedContract) {
      navigate(`/contracts/${selectedContract.id || selectedContract.contract_id}`);
    }
  };

  const handleActionQuickEdit = () => {
    setIsActionModalOpen(false);
    setIsModalOpen(true);
  };

  const handleActionClose = () => {
    setIsActionModalOpen(false);
    setSelectedContract(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedContract(null);
  };

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const contractCols = [
    { field: 'contract_name', headerName: 'Contract Name', flex: 2 },
    { field: 'start_date', headerName: 'Start Date', flex: 1, valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    { field: 'end_date', headerName: 'End Date', flex: 1, valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    { field: 'client_id', headerName: 'Client ID', flex: 1, hide: true }, // Hidden or displayed if needed
  ];

  return (
    <div className="mt-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Contracts</h1>
          <p className="text-gray-500 text-sm">Manage your contracts.</p>
        </div>
      </div>

      <div className="mt-6 w-full">
        <AgGridTable
          fetcher={fetchContracts}
          colDefs={contractCols}
          gridHeight="500px"
          onRowClicked={handleRowClick}
          headerActions={
            <button
              onClick={handleAddClick}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Contract
            </button>
          }
        />
      </div>

      <ContractModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        contract={selectedContract}
        onSuccess={handleSuccess}
      />

      <ActionModal
        isOpen={isActionModalOpen}
        onClose={handleActionClose}
        title="Contract Actions"
        entityData={selectedContract ? { name: selectedContract.contract_name, id: selectedContract.id || selectedContract.contract_id } : null}
        onViewDetails={handleActionViewDetails}
        onQuickEdit={handleActionQuickEdit}
      />
    </div>
  );
}