import apiClient from './client.js';

export async function getRazorpayCheckoutSession(checkoutToken) {
  const response = await apiClient.get(`/payment/checkout-session/${checkoutToken}`);
  return response.data;
}

export async function verifyRazorpayOrderPayment(payload) {
  const response = await apiClient.post('/payment/razorpay/verify-payment', payload);
  return response.data;
}
