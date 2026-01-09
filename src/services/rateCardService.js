import apiClient from '../config/api';

const rateCardService = {
  listRateCards: () =>
    apiClient.get('/rate-cards'),

  createRateCard: (rateCardData) =>
    apiClient.post('/rate-cards', rateCardData),

  getRateCardById: (id) =>
    apiClient.get(`/rate-cards/${id}`),

  updateRateCard: (id, rateCardData) =>
    apiClient.put(`/rate-cards/${id}`, rateCardData),

  partialUpdateRateCard: (id, rateCardData) =>
    apiClient.patch(`/rate-cards/${id}`, rateCardData),

  deleteRateCard: (id) =>
    apiClient.delete(`/rate-cards/${id}`),

  getRateCardSubscriptionTiers: (id) =>
    apiClient.get(`/rate-cards/${id}/subscription-tiers`),
};

export default rateCardService;