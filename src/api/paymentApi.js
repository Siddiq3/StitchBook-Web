import apiClient from './client.js';

export async function getCashfreeCheckoutSession(checkoutToken) {
  const response = await apiClient.get(`/payment/checkout-session/${checkoutToken}`);
  return response.data;
}

export async function verifyCashfreeOrderPayment(payload) {
  const response = await apiClient.post('/payment/cashfree/verify-payment', payload);
  return response.data;
}
