import { CheckCircle2, Clock3, CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createUpgradeCheckout, getUpgradeSession, verifyUpgradeCheckout } from '../api/subscriptionApi.js';
import Button from '../components/Button.jsx';
import { LogoMark } from '../components/Logo.jsx';
import { openRazorpayCheckout } from '../utils/razorpay.js';

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
  if (!value) return '-';
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function UpgradeSessionPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Log for debugging
  useEffect(() => {



  }, [sessionId]);

  const loadSession = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await getUpgradeSession(sessionId);
      setSession(payload);
    } catch (err) {
      // Only show error, never redirect to login
      const message = err.response?.data?.message ||
      err.message ||
      'This upgrade session is no longer valid. Sessions expire after 2 hours.';
      setError(message);

    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const planDetails = useMemo(() => PLAN_DETAILS[session?.plan] || PLAN_DETAILS.basic, [session?.plan]);
  const planLabel = planDetails.label;
  const planAmount = planDetails.amount;

  const handleCheckout = async () => {
    if (!sessionId || checkingOut) return;

    setCheckingOut(true);
    setError('');
    try {
      const order = await createUpgradeCheckout(sessionId);
      if (!order?.orderId || !order?.keyId) {
        throw new Error('Unable to begin checkout right now.');
      }

      const paymentResponse = await new Promise((resolve, reject) => {
        openRazorpayCheckout({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency || 'INR',
          name: 'StitchBook',
          description: `${planLabel} upgrade`,
          order_id: order.orderId,
          prefill: {
            name: session?.user?.name || '',
            email: session?.user?.email || '',
            contact: session?.user?.phone || ''
          },
          notes: {
            stitch_upgrade_session_id: sessionId,
            stitch_plan: session?.plan
          },
          theme: { color: '#2b2b2b' },
          handler: resolve,
          modal: {
            ondismiss: () => reject(new Error('Payment window was closed before completion.'))
          }
        }).then((razorpay) => {
          razorpay.on('payment.failed', (response) => {
            const reason = response?.error?.description || 'Payment was not completed. Please try again.';
            reject(new Error(reason));
          });
        }).catch(reject);
      });

      await verifyUpgradeCheckout(sessionId, {
        razorpay_order_id: paymentResponse.razorpay_order_id || order.orderId,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        plan: session?.plan
      });

      setPaymentSuccess(true);
    } catch (err) {
      const backendMessage = err?.response?.data?.error || err?.response?.data?.message || err?.message;
      setError(backendMessage || 'Unable to start payment.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-bone px-4 py-8 text-ink sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="font-serif text-2xl font-semibold leading-none">StitchBook</p>
              <p className="mt-1 text-sm font-bold text-ink/55">Secure upgrade checkout</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-mist px-3 py-1 text-sm font-semibold text-sage">
            <ShieldCheck size={16} />
            Razorpay secured
          </div>
        </header>

        {loading ?
        <section className="rounded-2xl border border-ink/10 bg-white p-8 text-center shadow-soft">
            <Loader2 className="mx-auto animate-spin text-brass" size={28} />
            <p className="mt-4 text-sm font-semibold text-ink/65">Preparing your secure checkout...</p>
          </section> :
        null}

        {!loading && error ?
        <section className="rounded-2xl border border-clay/30 bg-clay/10 p-6 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-clay">Upgrade unavailable</p>
            <h1 className="mt-3 font-serif text-3xl font-semibold">This upgrade link is no longer valid</h1>
            <p className="mt-3 text-sm leading-6 text-ink/70">{error}</p>
          </section> :
        null}

        {!loading && !error && !paymentSuccess ?
        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-bone">
                  <CreditCard size={22} />
                </div>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brass">Plan upgrade</p>
                  <h1 className="mt-1 font-serif text-3xl font-semibold">Continue with {planLabel} access</h1>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-ink/10 bg-bone p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-extrabold">{planLabel} plan</p>
                    <p className="mt-2 text-sm leading-6 text-ink/65">{planDetails.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-2xl font-semibold">{planAmount}</p>
                  </div>
                </div>
              </div>

              <Button className="mt-6 w-full" onClick={handleCheckout} disabled={checkingOut} variant="primary">
                {checkingOut ? <Loader2 className="animate-spin" size={17} /> : <ShieldCheck size={17} />}
                {checkingOut ? 'Please wait...' : 'Pay securely with Razorpay'}
              </Button>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-soft">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brass">Session details</p>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-ink/55">User</span>
                  <span className="font-semibold text-right">{session?.user?.name || '—'}</span>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-ink/55">Email</span>
                  <span className="font-semibold text-right">{session?.user?.email || '—'}</span>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-ink/55">Phone</span>
                  <span className="font-semibold text-right">{session?.user?.phone || '—'}</span>
                </div>
                <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-ink/55">Expires</span>
                  <span className="font-semibold text-right">{formatDate(session?.expiresAt)}</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-mist/70 px-3 py-2 text-sm font-semibold text-sage">
                  <Clock3 size={15} />
                  The link is valid for 2 hours.
                </div>
              </div>
            </div>
          </section> :
        null}

        {!loading && !error && paymentSuccess ?
        <section className="rounded-2xl border border-sage/30 bg-sage/10 p-8 text-center shadow-soft">
            <CheckCircle2 className="mx-auto text-sage" size={36} />
            <h1 className="mt-4 font-serif text-3xl font-semibold">Payment received</h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-ink/70">
              Your payment is being confirmed securely. Please return to the StitchBook app and refresh your subscription status to continue using your upgraded plan.
            </p>
          </section> :
        null}
      </div>
    </main>);

}

export default UpgradeSessionPage;
