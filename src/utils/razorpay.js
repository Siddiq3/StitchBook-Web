const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';
const RAZORPAY_SCRIPT_TIMEOUT_MS = 12000;

export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existing) {
      const timeoutId = window.setTimeout(() => resolve(Boolean(window.Razorpay)), RAZORPAY_SCRIPT_TIMEOUT_MS);
      existing.addEventListener('load', () => {
        window.clearTimeout(timeoutId);
        resolve(true);
      }, { once: true });
      existing.addEventListener('error', () => {
        window.clearTimeout(timeoutId);
        resolve(false);
      }, { once: true });
      return;
    }

    const script = document.createElement('script');
    const timeoutId = window.setTimeout(() => {
      script.onerror = null;
      script.onload = null;
      resolve(false);
    }, RAZORPAY_SCRIPT_TIMEOUT_MS);
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      window.clearTimeout(timeoutId);
      resolve(true);
    };
    script.onerror = () => {
      window.clearTimeout(timeoutId);
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(options) {
  const loaded = await loadRazorpayScript();

  if (!loaded || !window.Razorpay) {
    throw new Error('Unable to load Razorpay checkout. Please check your connection.');
  }

  const razorpay = new window.Razorpay(options);
  razorpay.open();
  return razorpay;
}
