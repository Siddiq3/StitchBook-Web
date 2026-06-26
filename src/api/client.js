import axios from 'axios';

const PRODUCTION_API_BASE_URL = 'https://stitchbook-backend.onrender.com/api';

const getDefaultApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return PRODUCTION_API_BASE_URL;
  }

  const { hostname } = window.location;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  return isLocalhost ? 'http://localhost:5002/api' : PRODUCTION_API_BASE_URL;
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || getDefaultApiBaseUrl(),
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'x-client-platform': 'web'
  }
});

apiClient.interceptors.request.use((config) => {
  // Public endpoints that should NOT receive auth tokens
  const publicEndpoints = [
  '/subscription/upgrade-session/'];


  const isPublicEndpoint = publicEndpoints.some((endpoint) => config.url?.includes(endpoint));

  // Only add auth token if not a public endpoint
  if (!isPublicEndpoint) {
    const token =
    config.authToken ||
    sessionStorage.getItem('stitchbook_auth_token') ||
    localStorage.getItem('stitchbook_auth_token') ||
    sessionStorage.getItem('stitchbook_payment_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {

  }

  delete config.authToken;
  return config;
});

export default apiClient;
