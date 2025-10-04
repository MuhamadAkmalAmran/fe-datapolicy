import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ambil data kategori dengan filter (GET pakai query params)
export const getCategories = (filter = {}) => {
  return api.get('/categories', { params: filter });
};

// Tambah kategori baru (POST)
export const createCategory = (data) => {
  return api.post('/categories', data);
};

// Update kategori (PUT)
export const updateCategory = (id, data) => {
  return api.put(`/categories/${id}`, data);
};

// Hapus kategori (DELETE)
export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};


// Ambil data visualisasi dengan parameter (GET)
export const getData = (params) => {
  return api.get('/data', { params });
};

// Tambah data baru (POST)
export const addData = (data) => {
  return api.post('/data', data);
};

// Update data (PUT)
export const updateData = (id, data) => {
  return api.put(`/data/${id}`, data);
};

// Hapus data (DELETE)
export const deleteData = (id) => {
  return api.delete(`/data/${id}`);
};

// Login function
export const login = (credentials) => {
  return api.post('/login', credentials);
};

export default api;
