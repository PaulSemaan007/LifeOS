import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Education API
export const educationAPI = {
  getAll: () => api.get('/education'),
  create: (data) => api.post('/education', data),
  update: (id, data) => api.put(`/education/${id}`, data),
  delete: (id) => api.delete(`/education/${id}`),
};

// Finances API
export const financesAPI = {
  getAll: () => api.get('/finances'),
  getSummary: () => api.get('/finances/summary'),
  create: (data) => api.post('/finances', data),
  update: (id, data) => api.put(`/finances/${id}`, data),
  delete: (id) => api.delete(`/finances/${id}`),
};

// Fitness API
export const fitnessAPI = {
  getAll: () => api.get('/fitness'),
  getStats: () => api.get('/fitness/stats'),
  create: (data) => api.post('/fitness', data),
  update: (id, data) => api.put(`/fitness/${id}`, data),
  delete: (id) => api.delete(`/fitness/${id}`),
};

// Career API
export const careerAPI = {
  getAll: () => api.get('/career'),
  getByStatus: (status) => api.get(`/career/status/${status}`),
  create: (data) => api.post('/career', data),
  update: (id, data) => api.put(`/career/${id}`, data),
  delete: (id) => api.delete(`/career/${id}`),
};

export default api;