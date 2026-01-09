import apiClient from '../config/api';

const clientService = {
  listClients: () =>
    apiClient.get('/clients'),

  createClient: (clientData) =>
    apiClient.post('/clients', clientData),

  getClientById: (id) =>
    apiClient.get(`/clients/${id}`),

  updateClient: (id, clientData) =>
    apiClient.put(`/clients/${id}`, clientData),

  partialUpdateClient: (id, clientData) =>
    apiClient.patch(`/clients/${id}`, clientData),

  deleteClient: (id) =>
    apiClient.delete(`/clients/${id}`),

  getClientContracts: (id) =>
    apiClient.get(`/clients/${id}/contracts`),
};

export default clientService;