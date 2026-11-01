import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl !== '/api') {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }

  if (typeof window !== 'undefined') {
    // 1. Allow runtime configuration via localStorage (e.g. if Render service URL differs)
    const customUrl = localStorage.getItem('sevasetu_api_url');
    if (customUrl) {
      return customUrl.endsWith('/api') ? customUrl : `${customUrl.replace(/\/$/, '')}/api`;
    }

    // 2. On local dev, use relative /api (proxied by Vite to 127.0.0.1:5000)
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return '/api';
    }
  }

  // 3. In deployed production without explicit env variable, route to Render backend service
  return 'https://sevasetu-backend.onrender.com/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

const getToken = () => localStorage.getItem('sevasetu_token') || localStorage.getItem('sevaqueue_token');

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
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
      const isAuthPath =
        window.location.pathname.startsWith('/admin') ||
        window.location.pathname.startsWith('/observer') ||
        window.location.pathname.startsWith('/dashboard');
      if (isAuthPath) {
        localStorage.removeItem('sevasetu_token');
        localStorage.removeItem('sevasetu_user');
        localStorage.removeItem('sevaqueue_token');
        localStorage.removeItem('sevaqueue_user');
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) =>
    api.post('/auth/login', {
      email: (email || '').trim().toLowerCase(),
      password,
    }),
  register: (fullName, email, password, confirmPassword) =>
    api.post('/auth/register', {
      name: (fullName || '').trim(),
      full_name: (fullName || '').trim(),
      email: (email || '').trim().toLowerCase(),
      password,
      confirm_password: confirmPassword,
    }),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

export const publicService = {
  getCentres: (params) => api.get('/centres', { params }),
  getCentre: (id) => api.get(`/centres/${id}`),
  getCentreServices: (id, params) => api.get(`/centres/${id}/services`, { params }),
  getCentreQueue: (id) => api.get(`/centres/${id}/queue`),
  getAllServices: (params) => api.get('/services', { params }),
  getService: (id) => api.get(`/services/${id}`),
  getSavedServices: () => api.get('/saved-services'),
  saveService: (service_id) => api.post('/saved-services', { service_id }),
  removeSavedService: (service_id) => api.delete(`/saved-services/${service_id}`),
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
