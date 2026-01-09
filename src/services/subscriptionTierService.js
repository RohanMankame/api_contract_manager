import apiClient from '../config/api';

const subscriptionTierService = {
  listSubscriptionTiers: () =>
    apiClient.get('/subscription-tiers'),

  createSubscriptionTier: (tierData) =>
    apiClient.post('/subscription-tiers', tierData),

  getSubscriptionTierById: (id) =>
    apiClient.get(`/subscription-tiers/${id}`),

  updateSubscriptionTier: (id, tierData) =>
    apiClient.put(`/subscription-tiers/${id}`, tierData),

  partialUpdateSubscriptionTier: (id, tierData) =>
    apiClient.patch(`/subscription-tiers/${id}`, tierData),

  deleteSubscriptionTier: (id) =>
    apiClient.delete(`/subscription-tiers/${id}`),

  getSubscriptionTierSubscription: (id) =>
    apiClient.get(`/subscription-tiers/${id}/subscriptions`),
};

export default subscriptionTierService;