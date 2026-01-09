import apiClient from '../config/api';

const contractService = {
  listContracts: () =>
    apiClient.get('/contracts'),

  createContract: (contractData) =>
    apiClient.post('/contracts', contractData),

  getContractById: (id) =>
    apiClient.get(`/contracts/${id}`),

  updateContract: (id, contractData) =>
    apiClient.put(`/contracts/${id}`, contractData),

  partialUpdateContract: (id, contractData) =>
    apiClient.patch(`/contracts/${id}`, contractData),

  deleteContract: (id) =>
    apiClient.delete(`/contracts/${id}`),

  getContractProduct: (id) =>
    apiClient.get(`/contracts/${id}/product`),

  getContractSubscriptions: (id) =>
    apiClient.get(`/contracts/${id}/subscriptions`),

  createSubscriptionUnderContract: (contractId, subscriptionData) =>
    apiClient.post(`/contracts/${contractId}/subscriptions`, subscriptionData),
};

export default contractService;