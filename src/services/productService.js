import apiClient from '../config/api';

const productService = {
  listProducts: () =>
    apiClient.get('/products'),

  createProduct: (productData) =>
    apiClient.post('/products', productData),

  getProductById: (id) =>
    apiClient.get(`/products/${id}`),

  updateProduct: (id, productData) =>
    apiClient.put(`/products/${id}`, productData),

  partialUpdateProduct: (id, productData) =>
    apiClient.patch(`/products/${id}`, productData),

  deleteProduct: (id) =>
    apiClient.delete(`/products/${id}`),

  getProductContracts: (id) =>
    apiClient.get(`/products/${id}/contracts`),
};

export default productService;