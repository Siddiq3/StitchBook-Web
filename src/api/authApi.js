import apiClient from './client.js';

export {saveSession as saveAuthSession,getToken as getAuthToken,getUser as getSavedUser,clearSession as clearAuthSession} from './authSession.js';
import {saveSession as saveAuthSession,clearSession as clearAuthSession} from './authSession.js';
const USER_KEY='stitchbook_user';

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
