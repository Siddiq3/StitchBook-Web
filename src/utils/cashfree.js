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
  if (!paymentSessionId || !['sandbox', 'production'].includes(mode)) throw new Error('Payment details are incomplete. Please start again.');
  const loaded = await loadCashfreeScript();
  if (!loaded || !window.Cashfree) throw new Error('Unable to load Cashfree checkout. Please try again.');
  return window.Cashfree({ mode }).checkout({ paymentSessionId, redirectTarget: '_modal' });
}
