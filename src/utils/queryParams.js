export function getPaymentDetails(searchParams, routeState = {}) {
  const value = (...keys) => {
    for (const key of keys) {
      if (routeState[key]) return routeState[key];

      const match = searchParams.get(key);
      if (match) return match;
    }

    return '';
  };

  const amountValue = value('amount', 'totalAmount', 'payableAmount');
  const amountPaiseValue = value('amountPaise', 'amount_paise', 'amountInPaise');
  const amount = amountPaiseValue ? Number(amountPaiseValue) / 100 : Number(amountValue || 0);

  return {
    checkoutToken: value('checkoutToken', 'checkout_token'),
    orderId: value('orderId', 'order_id', 'id'),
    razorpayOrderId: value('razorpayOrderId', 'razorpay_order_id', 'rpOrderId'),
    amount,
    currency: value('currency') || 'INR',
    keyId: value('keyId', 'razorpayKeyId', 'razorpay_key_id'),
    name: value('name', 'customerName', 'customer_name'),
    email: value('email', 'customerEmail', 'customer_email'),
    phone: value('phone', 'contact', 'customerPhone', 'customer_phone'),
    token: value('token', 'authToken', 'accessToken'),
    description: value('description') || 'StitchBook tailoring order payment',
  };
}

export function toPaise(amount) {
  return Math.round(Number(amount || 0) * 100);
}
