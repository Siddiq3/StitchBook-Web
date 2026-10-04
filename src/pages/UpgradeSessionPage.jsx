import { formatPrice } from '../utils/planPrices.js';
import { ArrowRight, CheckCircle2, Clock3, CreditCard, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { createUpgradeCheckout, getUpgradeSession, verifyUpgradeCheckout } from '../api/subscriptionApi.js';
import Button from '../components/Button.jsx';
import Logo from '../components/Logo.jsx';
import { openCashfreeCheckout } from '../utils/cashfree.js';

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function UpgradeSessionPage() {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const [customerPhone, setCustomerPhone] = useState('');
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const loadSession = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await getUpgradeSession(sessionId);
      setSession(payload);
      setCheckoutError('');
    } catch (err) {
      // Only show error, never redirect to login
      const message = err.response?.data?.message ||
      err.message ||
      'This checkout link has expired. Please start again from your account.';
      setError(message);

    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (!paymentSuccess) return undefined;

    const timer = window.setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [navigate, paymentSuccess]);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    if (!orderId || !session) return;
    setCheckingOut(true);
    verifyUpgradeCheckout(sessionId, {cashfree_order_id:orderId})
      .then(() => setPaymentSuccess(true))
      .catch(err => setCheckoutError(err.response?.data?.error || err.response?.data?.message || err.message))
      .finally(() => setCheckingOut(false));
  }, [searchParams, sessionId, session]);

  const planLabel = { basic: 'Basic', monthly: 'Basic', team: 'Team', pro: 'Pro', annual: 'Annual Pro' }[session?.plan] || 'Subscription';
  const validPrice = Number.isFinite(session?.amount) && session.amount > 0 && session.currency === 'INR';
  const planAmount = validPrice ? `${formatPrice(session.amount)} / ${session.duration === 'year' ? 'year' : 'month'}` : 'Price unavailable';

  const handleCheckout = async () => {
    if (!sessionId || checkingOut || !validPrice) return;

    setCheckingOut(true);
    setCheckoutError('');
    try {
      const order = await createUpgradeCheckout(sessionId, customerPhone);
      if (!order?.orderId || !order?.paymentSessionId) {
        throw new Error('Unable to begin checkout right now.');
      }

      if (order.amount !== session.amount || order.currency !== session.currency) {
        setSession(value => ({ ...value, amount: order.amount, currency: order.currency }));
        throw new Error('The checkout price has changed. Please review the updated amount and select Pay again.');
      }
      const result = await openCashfreeCheckout({
        paymentSessionId: order.paymentSessionId,
        mode: order.mode,
      });

      // With redirectTarget="_self", a successful Cashfree launch normally
      // navigates away before this line runs. If the SDK resolves in-place,
      // only verify when it did not report an error.
      if (result?.redirect) return;

      await verifyUpgradeCheckout(sessionId, {
        cashfree_order_id: order.orderId,
      });

      setPaymentSuccess(true);
    } catch (err) {
      const providerCode = err?.code ? ` (${err.code})` : '';
      const checkoutMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message;

      setCheckoutError(
        `${checkoutMessage || 'Unable to start payment. Please try again.'}${providerCode}`
      );

      // Keep the provider-side details visible in the browser console for
      // debugging without exposing API credentials.
      if (err?.details) {
        console.error('Cashfree checkout error details:', err.details);
      } else {
        console.error('Checkout error:', err);
      }
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <main className="upgrade-page min-h-screen bg-bone px-4 py-8 text-ink sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="surface-card flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          <div className="flex items-center gap-2 rounded-full bg-mist px-3 py-1 text-sm font-semibold text-sage">
            <ShieldCheck size={16} />
            Secure payment
          </div>
        </header>

        {loading ?
        <section role="status" aria-busy="true" className="rounded-2xl border border-ink/10 bg-white p-8 text-center">
            <Loader2 className="mx-auto animate-spin text-brass" size={28} />
            <p className="mt-4 text-sm font-semibold text-muted">Preparing your plan checkout...</p>
          </section> :
        null}

        {!loading && error ?
        <section role="alert" className="rounded-2xl border border-clay/30 bg-clay/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-clay">Checkout unavailable</p>
            <h1 className="mt-3 font-sans text-3xl font-semibold">This checkout link is no longer available</h1>
            <p className="mt-3 text-sm leading-6 text-muted">{error}</p>
          </section> :
        null}

        {!loading && !error && !paymentSuccess ?
        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="surface-card rounded-2xl border border-ink/10 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-bone">
                  <CreditCard size={22} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brass">Subscription plan</p>
                  <h1 className="mt-1 font-sans text-3xl font-semibold">Activate {planLabel} plan</h1>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-ink/10 bg-bone p-4">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold">{planLabel} plan</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{'Manage your shop with the selected subscription plan.'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-2xl font-semibold">{planAmount}</p>
                  </div>
                </div>
              </div>

              {!session?.user?.phone && (
                <label className="mt-6 block text-sm font-semibold">
                  Mobile number for payment
                  <input type="tel" autoComplete="tel" inputMode="tel" value={customerPhone}
                    onChange={event => setCustomerPhone(event.target.value)} placeholder="10-digit mobile number"
                    className="mt-2 w-full rounded-xl border border-ink/20 px-4 py-3" />
                </label>
              )}
              <Button className="mt-6 w-full" onClick={handleCheckout} disabled={checkingOut || !validPrice} variant="primary">
                {checkingOut ? <Loader2 className="animate-spin" size={17} /> : <ShieldCheck size={17} />}
                {checkingOut ? 'Please wait...' : 'Pay now'}
              </Button>
              {checkoutError ? (
                <div role="alert" className="mt-4 rounded-2xl border border-clay/25 bg-clay/10 p-4 text-sm font-semibold leading-6 text-ink/75">
                  {checkoutError}
                </div>
              ) : null}
            </div>

            <div className="surface-card rounded-2xl border border-ink/10 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-brass">Checkout details</p>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-muted">User</span>
                  <span className="font-semibold text-right">{session?.user?.name || '—'}</span>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-muted">Email</span>
                  <span className="font-semibold text-right">{session?.user?.email || '—'}</span>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-muted">Phone</span>
                  <span className="font-semibold text-right">{session?.user?.phone || '—'}</span>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-muted">Link valid until</span>
                  <span className="font-semibold text-right">{formatDate(session?.expiresAt)}</span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-mist/70 px-3 py-2 text-sm font-semibold text-sage">
                  <Clock3 size={15} />
                  For your safety, checkout links expire automatically.
                </div>
              </div>
            </div>
          </section> :
        null}

        {!loading && !error && paymentSuccess ?
        <section role="status" className="relative overflow-hidden rounded-2xl border border-sage/30 bg-white p-8 text-center">
            <div className="relative">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sage/12 text-sage">
                <CheckCircle2 size={44} />
              </div>
              <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-brass">
                <Sparkles size={17} />
                Payment successful
              </div>
              <h1 className="mt-3 font-sans text-4xl font-semibold">Your StitchBook plan is active</h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
                We have activated your subscription. You will be redirected to your dashboard in a few seconds.
              </p>
              <Button className="mt-7" onClick={() => navigate('/dashboard', { replace: true })} variant="brass">
                Go to dashboard
                <ArrowRight size={17} />
              </Button>
            </div>
          </section> :
        null}
      </div>
    </main>);

}

export default UpgradeSessionPage;
