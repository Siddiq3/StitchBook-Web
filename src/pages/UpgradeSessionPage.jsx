import { ArrowRight, CheckCircle2, Clock3, CreditCard, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { createUpgradeCheckout, getUpgradeSession, verifyUpgradeCheckout } from '../api/subscriptionApi.js';
import Button from '../components/Button.jsx';
import Logo from '../components/Logo.jsx';
import { openCashfreeCheckout } from '../utils/cashfree.js';

const PLAN_DETAILS = {
  basic: {
    label: 'Basic',
    amount: '₹299 / month',
    description: 'Owner-only access for customers, orders, measurements, payments and bills.'
  },
  monthly: {
    label: 'Basic',
    amount: '₹299 / month',
    description: 'Owner-only access for customers, orders, measurements, payments and bills.'
  },
  team: {
    label: 'Team',
    amount: '₹399 / month',
    description: 'Owner plus 2 staff users for cutter/stitcher login and work assignment.'
  },
  pro: {
    label: 'Pro',
    amount: '₹599 / month',
    description: 'Owner plus 5 staff users with staff earnings and production tracking.'
  },
  annual: {
    label: 'Annual Pro',
    amount: '₹1,800 / year',
    description: 'Legacy annual access for active tailoring businesses.'
  }
};

function formatDate(value) {
  if (!value) return '—';
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
      setError(err.response?.data?.message || err.message || 'This checkout link has expired. Please start again from your account.');
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
    verifyUpgradeCheckout(sessionId, { cashfree_order_id: orderId })
      .then(() => setPaymentSuccess(true))
      .catch((err) => setCheckoutError(err.response?.data?.error || err.response?.data?.message || err.message))
      .finally(() => setCheckingOut(false));
  }, [searchParams, sessionId, session]);

  const planDetails = useMemo(() => PLAN_DETAILS[session?.plan] || PLAN_DETAILS.basic, [session?.plan]);

  const handleCheckout = async () => {
    if (!sessionId || checkingOut) return;

    setCheckingOut(true);
    setCheckoutError('');
    try {
      const order = await createUpgradeCheckout(sessionId, customerPhone);
      if (!order?.orderId || !order?.paymentSessionId) {
        throw new Error('Unable to begin checkout right now.');
      }

      const result = await openCashfreeCheckout({
        paymentSessionId: order.paymentSessionId,
        mode: order.mode,
      });

      if (result?.redirect) return;

      await verifyUpgradeCheckout(sessionId, {
        cashfree_order_id: order.orderId,
      });

      setPaymentSuccess(true);
    } catch (err) {
      const providerCode = err?.code ? ' (' + err.code + ')' : '';
      const checkoutMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message;
      setCheckoutError((checkoutMessage || 'Unable to start payment. Please try again.') + providerCode);

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
    <main className="brand-soft min-h-screen px-4 py-6 text-ink sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Logo />
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-sage shadow-sm">
            <ShieldCheck size={15} />
            Secure plan checkout
          </span>
        </header>

        <div className="py-8 sm:py-12">
          {loading ? (
            <section role="status" aria-busy="true" className="surface-card rounded-3xl p-10 text-center">
              <Loader2 className="mx-auto animate-spin text-brass" size={30} />
              <p className="mt-4 text-sm font-semibold text-muted">Preparing your plan checkout…</p>
            </section>
          ) : null}

          {!loading && error ? (
            <section role="alert" className="surface-card rounded-3xl p-7 sm:p-9">
              <p className="section-eyebrow text-rosewood">Checkout unavailable</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">This checkout link is no longer available.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{error}</p>
              <Button className="mt-6" to="/dashboard" variant="secondary">Return to dashboard</Button>
            </section>
          ) : null}

          {!loading && !error && !paymentSuccess ? (
            <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,.75fr)]">
              <div className="surface-card rounded-3xl p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-white">
                    <CreditCard size={22} />
                  </span>
                  <div>
                    <p className="section-eyebrow">Subscription plan</p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Activate {planDetails.label}.</h1>
                    <p className="mt-2 text-sm leading-6 text-muted">{planDetails.description}</p>
                  </div>
                </div>

                <div className="mt-7 rounded-2xl border border-border bg-bone p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-ink">{planDetails.label} plan</p>
                      <p className="mt-1 text-sm text-muted">StitchBook app access</p>
                    </div>
                    <p className="text-3xl font-semibold tracking-[-0.04em] text-ink">{planDetails.amount}</p>
                  </div>
                </div>

                {!session?.user?.phone ? (
                  <label className="form-label mt-6">
                    <span>Mobile number for payment</span>
                    <input
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={customerPhone}
                      onChange={(event) => setCustomerPhone(event.target.value)}
                      placeholder="10-digit mobile number"
                      className="form-input"
                    />
                  </label>
                ) : null}

                <Button className="mt-6 w-full" onClick={handleCheckout} disabled={checkingOut} variant="primary">
                  {checkingOut ? <Loader2 className="animate-spin" size={17} /> : <ShieldCheck size={17} />}
                  {checkingOut ? 'Please wait…' : 'Continue to payment'}
                </Button>

                {checkoutError ? (
                  <div role="alert" className="mt-4 rounded-2xl border border-rosewood/20 bg-red-50 p-4 text-sm font-semibold leading-6 text-rosewood">
                    {checkoutError}
                  </div>
                ) : null}
              </div>

              <aside className="rounded-3xl border border-border bg-linen p-6 sm:p-7">
                <p className="section-eyebrow">Checkout details</p>
                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-start justify-between gap-4 border-b border-[#DDD5C8] pb-3">
                    <span className="text-muted">User</span>
                    <span className="text-right font-semibold">{session?.user?.name || '—'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-[#DDD5C8] pb-3">
                    <span className="text-muted">Email</span>
                    <span className="max-w-[65%] break-words text-right font-semibold">{session?.user?.email || '—'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-[#DDD5C8] pb-3">
                    <span className="text-muted">Phone</span>
                    <span className="text-right font-semibold">{session?.user?.phone || '—'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-[#DDD5C8] pb-3">
                    <span className="text-muted">Link valid until</span>
                    <span className="text-right font-semibold">{formatDate(session?.expiresAt)}</span>
                  </div>
                  <div className="flex items-start gap-2 rounded-2xl bg-white/70 px-3 py-3 text-sm font-semibold text-sage">
                    <Clock3 className="mt-0.5 shrink-0" size={15} />
                    <span>Checkout links expire automatically for your safety.</span>
                  </div>
                </div>
              </aside>
            </section>
          ) : null}

          {!loading && !error && paymentSuccess ? (
            <section role="status" className="surface-card rounded-3xl p-8 text-center sm:p-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-sage">
                <CheckCircle2 size={42} />
              </div>
              <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brass">
                <Sparkles size={16} />
                Payment successful
              </div>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em]">Your StitchBook plan is active.</h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
                Your subscription has been activated. You will return to the dashboard automatically in a few seconds.
              </p>
              <Button className="mt-7" onClick={() => navigate('/dashboard', { replace: true })} variant="primary">
                Go to dashboard
                <ArrowRight size={17} />
              </Button>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default UpgradeSessionPage;
