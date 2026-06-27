import apiClient from './client.js';

export async function getSubscriptionStatus() {
  const response = await apiClient.get('/subscription/status');
  return response.data?.data || response.data;
}

export async function createUpgradeSession(plan = 'basic') {
  const response = await apiClient.post('/subscription/create-upgrade-session', { plan });
  return response.data?.data || response.data;
}

export async function getUpgradeSession(sessionId) {
  const response = await apiClient.get(`/subscription/upgrade-session/${sessionId}`);
  return response.data?.data || response.data;
}

export async function createUpgradeCheckout(sessionId) {
  const response = await apiClient.post(`/subscription/upgrade-session/${sessionId}/checkout`);
  return response.data?.data || response.data;
}

export async function verifyUpgradeCheckout(sessionId, payload) {
  const response = await apiClient.post(`/subscription/upgrade-session/${sessionId}/verify`, payload);
  return response.data?.data || response.data;
}
