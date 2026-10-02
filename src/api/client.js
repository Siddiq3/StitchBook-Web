import {getToken as getStoredToken,saveTokens,clearSession as clearStoredSession} from './authSession.js';
import axios from 'axios';

const PRODUCTION_API_BASE_URL = 'https://stitchbook-backend.onrender.com/api';
const AUTH_TOKEN_KEY = 'stitchbook_auth_token';
const REFRESH_TOKEN_KEY = 'stitchbook_refresh_token';
const PAYMENT_TOKEN_KEY = 'stitchbook_payment_token';

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
  timeout: 30000,
  withCredentials: true,
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
    getStoredToken() ||
    sessionStorage.getItem(PAYMENT_TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {

  }

  delete config.authToken;
  return config;
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url || '';
    const isRefreshRequest = requestUrl.includes('/auth/refresh-token');
    const isLoginRequest =
      requestUrl.includes('/auth/google') ||
      requestUrl.includes('/auth/msg91-widget') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/login');

    if (status !== 401 || !originalRequest || originalRequest._retry || isRefreshRequest || isLoginRequest) {
      return Promise.reject(error);
    }


    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh-token`, {

      }, {
        withCredentials: true,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'x-client-platform': 'web',
        },
      });

      const nextToken = response.data?.data?.token;
      const nextRefreshToken = response.data?.data?.refreshToken;

      if (!nextToken) {
        throw new Error('Refresh response is missing tokens');
      }

      saveTokens({ token: nextToken, refreshToken: nextRefreshToken });
      originalRequest.headers.Authorization = `Bearer ${nextToken}`;
      processQueue(null, nextToken);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      if ([401, 403].includes(refreshError.response?.status)) clearStoredSession();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;

async function restoreSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  if (getStoredToken()) return;
  const response = await apiClient.post('/auth/refresh-token', {});
  if (response.data?.data?.token) saveTokens(response.data.data);
}

let restoring;
export function restoreWebSession() {
  if (!restoring) restoring = restoreSession().finally(() => { restoring = null; });
  return restoring;
}
