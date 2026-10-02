const SCRIPT_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';
let loading;

export function loadCashfreeScript() {
  if (window.Cashfree) return Promise.resolve(true);
  if (loading) return loading;
  loading = new Promise(resolve => {
    let script = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    const created = !script;
    if (created) { script = document.createElement('script'); script.src = SCRIPT_URL; script.async = true; }
    const finish = success => {
      window.clearTimeout(timer);
      script.removeEventListener('load', loaded);
      script.removeEventListener('error', failed);
      if (!success) script.remove();
      resolve(success);
    };
    const loaded = () => finish(Boolean(window.Cashfree));
    const failed = () => finish(false);
    const timer = window.setTimeout(failed, 12000);
    script.addEventListener('load', loaded, {once:true});
    script.addEventListener('error', failed, {once:true});
    if (created) document.body.appendChild(script);
  }).finally(() => { loading = undefined; });
  return loading;
}

export async function openCashfreeCheckout({ paymentSessionId, mode }) {
  if (!paymentSessionId || !['sandbox', 'production'].includes(mode)) {
    const error = new Error('Payment details are incomplete. Please start again.');
    error.code = 'CASHFREE_INVALID_SESSION';
    throw error;
  }

  const loaded = await loadCashfreeScript();
  if (!loaded || !window.Cashfree) {
    const error = new Error('Unable to load Cashfree checkout. Please try again.');
    error.code = 'CASHFREE_SDK_LOAD_FAILED';
    throw error;
  }

  try {
    const cashfree = window.Cashfree({ mode });
    const result = await cashfree.checkout({
      paymentSessionId,
      redirectTarget: '_self',
    });

    if (result?.error) {
      const message =
        result.error.message ||
        result.error.description ||
        result.error.code ||
        'Cashfree could not open checkout.';
      const error = new Error(message);
      error.code = result.error.code || 'CASHFREE_CHECKOUT_FAILED';
      error.details = result.error;
      throw error;
    }

    return result;
  } catch (error) {
    if (error?.code) throw error;
    const wrapped = new Error(error?.message || 'Cashfree checkout failed. Please try again.');
    wrapped.code = 'CASHFREE_CHECKOUT_FAILED';
    wrapped.details = error;
    throw wrapped;
  }
}
