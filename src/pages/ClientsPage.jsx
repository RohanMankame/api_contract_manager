import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AgGridTable from '../components/AgGridTable';
import ClientModal from '../components/modals/ClientModal';
import ActionModal from '../components/modals/ActionModal';
import { clientService } from '../services';
import { PlusIcon } from '../components/icons';

export default function ClientsPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchClients = useCallback(async () => {
    const res = await clientService.listClients();
    return (res?.data?.data?.clients) || [];
  }, [refreshTrigger]);

  const handleAddClick = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleRowClick = (event) => {
    setSelectedClient(event.data);
    setIsActionModalOpen(true);
  };

  const handleActionViewDetails = () => {
    if (selectedClient) {
      navigate(`/clients/${selectedClient.id || selectedClient.client_id}`);
    }
  };

  const handleActionQuickEdit = () => {
    setIsActionModalOpen(false);
    setIsModalOpen(true);
  };

  const handleActionClose = () => {
    setIsActionModalOpen(false);
    setSelectedClient(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const clientCols = [
    { field: 'company_name', headerName: 'Company', flex: 2 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone_number', headerName: 'Phone', width: 150 },
    { field: 'address', headerName: 'Address', flex: 3 },
  ];

  return (
    <div className="mt-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm">Manage clients. Click on table rows for actions.</p>
        </div>
      </div>

      <div className="mt-6 w-full">
        <AgGridTable
          fetcher={fetchClients}
          colDefs={clientCols}
          gridHeight="500px"
          onRowClicked={handleRowClick}
          onViewDetails={(data) => navigate(`/clients/${data.id || data.client_id}`)}
          headerActions={
            <button
              onClick={handleAddClick}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-indigo-100 duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              New Client
            </button>
          }
        />
      </div>

      <ClientModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        client={selectedClient}
        onSuccess={handleSuccess}
      />

      <ActionModal
        isOpen={isActionModalOpen}
        onClose={handleActionClose}
        title="Client Actions"
        entityData={selectedClient ? { name: selectedClient.company_name, id: selectedClient.id || selectedClient.client_id } : null}
        onViewDetails={handleActionViewDetails}
        onQuickEdit={handleActionQuickEdit}
      />
    </div>
  );
}