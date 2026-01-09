import apiClient from '../config/api';

const userService = {
  listUsers: () =>
    apiClient.get('/users'),

  createUser: (userData) =>
    apiClient.post('/users', userData),

  getUserById: (id) =>
    apiClient.get(`/users/${id}`),

  updateUser: (id, userData) =>
    apiClient.put(`/users/${id}`, userData),

  partialUpdateUser: (id, userData) =>
    apiClient.patch(`/users/${id}`, userData),

  deleteUser: (id) =>
    apiClient.delete(`/users/${id}`),
};

export default userService;