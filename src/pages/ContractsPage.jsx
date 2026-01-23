import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AgGridTable from '../components/AgGridTable';
import ContractModal from '../components/modals/ContractModal';
import ActionModal from '../components/modals/ActionModal';
import { contractService, clientService } from '../services';
import { PlusIcon } from '../components/icons';

export default function ContractsPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchContracts = useCallback(async () => {
    const contractsRes = await contractService.listContracts();
    const contracts = contractsRes?.data?.data?.contracts || [];

    // Fetch client details for each contract individually
    const contractsWithClients = await Promise.all(
      contracts.map(async (contract) => {
        if (contract.client_id) {
          try {
            const clientRes = await clientService.getClientById(contract.client_id);
            const client = clientRes.data?.data?.client || clientRes.data?.data || clientRes.data;
            return {
              ...contract,
              client_name: client.company_name || 'Unknown Client'
            };
          } catch (err) {
            console.error(`Failed to fetch client ${contract.client_id}:`, err);
            return {
              ...contract,
              client_name: 'Unknown Client'
            };
          }
        }
        return {
          ...contract,
          client_name: 'No Client'
        };
      })
    );

    return contractsWithClients;
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
    { field: 'client_name', headerName: 'Client Name', flex: 1.5 },
    { field: 'start_date', headerName: 'Start Date', flex: 1, valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
    { field: 'end_date', headerName: 'End Date', flex: 1, valueFormatter: (params) => new Date(params.value).toLocaleDateString() },
  ];

  return (
    <div className="mt-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Contracts</h1>
          <p className="text-gray-500 text-sm">Double click on table rows for actions.</p>
        </div>
      </div>

      <div className="mt-6 w-full">
        <AgGridTable
          fetcher={fetchContracts}
          colDefs={contractCols}
          gridHeight="500px"
          onRowDoubleClicked={handleRowClick}
          onViewDetails={(data) => navigate(`/contracts/${data.id || data.contract_id}`)}
          onEditRow={(data) => {
            setSelectedContract(data);
            setIsModalOpen(true);
          }}
          headerActions={
            <button
              onClick={handleAddClick}
              className="group inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 focus:outline-none"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5 transition-colors duration-200" />
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