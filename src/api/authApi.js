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

export function getSavedUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
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
