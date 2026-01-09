import apiClient from '../config/api';

const authService = {
  login: (email, password) =>
    apiClient.post('/login', { email, password }),

  getProtected: () =>
    apiClient.get('/protected'),

  createFirstUser: (userData) =>
    apiClient.post('/users-first', userData),
};

export default authService;