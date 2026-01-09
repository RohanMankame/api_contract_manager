import apiClient from '../config/api';

const subscriptionService = {
  listSubscriptions: () =>
    apiClient.get('/subscriptions'),

  createSubscription: (subscriptionData) =>
    apiClient.post('/subscriptions', subscriptionData),

  getSubscriptionById: (id) =>
    apiClient.get(`/subscriptions/${id}`),

  updateSubscription: (id, subscriptionData) =>
    apiClient.put(`/subscriptions/${id}`, subscriptionData),

  partialUpdateSubscription: (id, subscriptionData) =>
    apiClient.patch(`/subscriptions/${id}`, subscriptionData),

  deleteSubscription: (id) =>
    apiClient.delete(`/subscriptions/${id}`),

  getSubscriptionTiers: (id) =>
    apiClient.get(`/subscriptions/${id}/tiers`),
};

export default subscriptionService;