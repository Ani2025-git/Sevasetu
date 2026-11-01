import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sevaqueue_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized states
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthPath = window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/observer');
      if (isAuthPath) {
        localStorage.removeItem('sevaqueue_token');
        localStorage.removeItem('sevaqueue_user');
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const publicService = {
  getCentres: (params) => api.get('/centres', { params }),
  getCentre: (id) => api.get(`/centres/${id}`),
  getCentreServices: (id, params) => api.get(`/centres/${id}/services`, { params }),
  getCentreQueue: (id) => api.get(`/centres/${id}/queue`),
  getAllServices: (params) => api.get('/services', { params }),
  submitAnonymousObservation: (data) => api.post('/public/observations', data),
  getDisclaimer: () => api.get('/public/disclaimer'),
};

export const observerService = {
  submitObservation: (data) => api.post('/observations', data),
  getMyObservations: () => api.get('/observations/my'),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  // Centres
  createCentre: (data) => api.post('/admin/centres', data),
  updateCentre: (id, data) => api.put(`/admin/centres/${id}`, data),
  deleteCentre: (id) => api.delete(`/admin/centres/${id}`),
  // Services
  createService: (data) => api.post('/admin/services', data),
  updateService: (id, data) => api.put(`/admin/services/${id}`, data),
  deleteService: (id) => api.delete(`/admin/services/${id}`),
  // Observations review
  getObservations: (params) => api.get('/admin/observations', { params }),
  reviewObservation: (id, data) => api.post(`/admin/observations/${id}/review`, data),
  // Publish queue
  publishQueueUpdate: (data) => api.post('/admin/queue-updates', data),
  // History & Audit
  getHistory: (params) => api.get('/admin/history', { params }),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  // Users
  getUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.put('/admin/settings', data),
};

export default api;

