import apiClient from './client.js';

const AUTH_TOKEN_KEY = 'stitchbook_auth_token';
const REFRESH_TOKEN_KEY = 'stitchbook_refresh_token';
const USER_KEY = 'stitchbook_user';

export function saveAuthSession({ token, refreshToken, user }) {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthToken() {
  return sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getSavedUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearAuthSession() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem('stitchbook_payment_token');
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function getProfile() {
  const res = await apiClient.get('/auth/profile');
  const user = res.data?.data || res.data;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  return user;
}

export async function logout() {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    clearAuthSession();
  }
}

export async function loginWithGoogle(idToken, device = {}) {
  const res = await apiClient.post('/auth/google', {
    idToken,
    platform: 'web',
    device,
  });
  saveAuthSession(res.data.data);
  return res.data.data;
}

export async function loginWithMsg91Widget(accessToken, device = {}) {
  const res = await apiClient.post('/auth/msg91-widget', {
    accessToken,
    platform: 'web',
    device,
  });
  saveAuthSession(res.data.data);
  return res.data.data;
}
