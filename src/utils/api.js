import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auto-inject Authorization Token and Tenant ID into headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('astra_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const activeTenant = localStorage.getItem('crm_active_tenant');
  if (activeTenant) {
    config.headers['x-tenant-id'] = activeTenant;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
