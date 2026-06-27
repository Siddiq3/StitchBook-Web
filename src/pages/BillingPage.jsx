import { CheckCircle2, CreditCard, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { clearAuthSession } from '../api/authApi.js';
import Button from '../components/Button.jsx';
import { LogoMark } from '../components/Logo.jsx';
import { createUpgradeSession, getSubscriptionStatus } from '../api/subscriptionApi.js';

const plans = {
  basic: {
    label: 'Basic',
    planName: 'Basic',
    amount: 299,
    display: '₹299 / month',
    description: 'Owner-only access for customers, orders, measurements, payments and bills.',
  },
  team: {
    label: 'Team',
    planName: 'Team',
    amount: 399,
    display: '₹399 / month',
    description: 'Owner plus 2 staff users for cutter/stitcher login and assignment.',
    badge: 'Most useful',
  },
  pro: {
    label: 'Pro',
    planName: 'Pro',
    amount: 599,
    display: '₹599 / month',
    description: 'Owner plus 5 staff users with earnings and production tracking.',
    badge: 'Best for teams',
  },
};

const features = [
  'Order management',
  'Customer measurements',
  'Staff access on Team/Pro',
  'Staff and earnings tracking',
  'Business dashboard',
  'Payment tracking',
  'Bill sharing',
  'Multi-language support',
];

function consumeMobileAuthToken() {
  const url = new URL(window.location.href);
  const hashParams = new URLSearchParams(url.hash.replace(/^#/, ''));
  const token =
    url.searchParams.get('token') ||
    url.searchParams.get('authToken') ||
    url.searchParams.get('accessToken') ||
    hashParams.get('token') ||
    hashParams.get('authToken') ||
    hashParams.get('accessToken');

  if (!token) return;

  sessionStorage.setItem('stitchbook_auth_token', token);
  url.searchParams.delete('token');
  url.searchParams.delete('authToken');
  url.searchParams.delete('accessToken');
  hashParams.delete('token');
  hashParams.delete('authToken');
  hashParams.delete('accessToken');
  url.hash = hashParams.toString() ? `#${hashParams.toString()}` : '';
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function BillingPage() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState('');

  useEffect(() => {
    consumeMobileAuthToken();
  }, []);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const status = await getSubscriptionStatus();
      setSubscription(status);
      setNeedsLogin(false);
    } catch (err) {
      if (err.response?.status === 401) {
        clearAuthSession();
        setNeedsLogin(true);
        setError('');
        return;
      }
      setError(err.response?.data?.message || err.message || 'Unable to load subscription.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const isActive = subscription?.isActive && subscription?.status === 'active';
  const isTrial = subscription?.status === 'trial' && subscription?.isActive;
  const isTrialExpired = subscription?.status === 'trial_expired';
  const statusLabel = isActive
    ? 'Active plan'
    : isTrial
    ? 'Free trial active'
    : isTrialExpired
    ? 'Trial completed'
    : 'No active plan';

  const startUpgrade = async (plan) => {
    setCheckoutPlan(plan);
    setError('');
    try {
      const session = await createUpgradeSession(plan);
      if (!session?.upgradeUrl) {
        throw new Error('Unable to create checkout link.');
      }
      window.location.href = session.upgradeUrl;
    } catch (err) {
      if (err.response?.status === 401) {
        clearAuthSession();
        setNeedsLogin(true);
        return;
      }
      setError(err.response?.data?.message || err.message || 'Unable to start subscription checkout.');
    } finally {
      setCheckoutPlan('');
    }
  };

  return (
    <main className="min-h-screen bg-bone px-4 py-8 text-ink sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="font-serif text-3xl font-semibold leading-none">StitchBook</p>
              <p className="mt-1 text-sm font-bold text-ink/55">Subscription status</p>
            </div>
          </div>
          <Button onClick={loadStatus} variant="secondary">
            {loading ? <Loader2 className="animate-spin" size={17} /> : <RefreshCw size={17} />}
            Refresh Status
          </Button>
        </header>

        {needsLogin ? (
          <section className="mt-10 rounded-lg border border-ink/10 bg-white p-6 shadow-soft sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brass">Billing login required</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight">Sign in to continue subscription</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/62">
              Your billing session expired. Sign in to view status and continue secure Razorpay checkout.
            </p>
            <Button className="mt-6" to="/login?redirect=/billing" variant="primary">
              Sign in and continue
            </Button>
          </section>
        ) : null}

        {!needsLogin ? (
        <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-bone">
                <CreditCard size={22} />
              </span>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brass">Subscription</p>
                <h1 className="mt-2 font-serif text-5xl font-semibold leading-none">Choose your StitchBook plan</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/62">
                  Every new shop gets a 10-day free trial. Payments are completed on this secure website with Razorpay, while daily shop work stays inside the mobile app.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {Object.entries(plans).map(([key, plan]) => (
                <div className="rounded-lg border border-ink/10 bg-bone p-5" key={key}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-extrabold">{plan.planName}</p>
                      <p className="mt-2 text-sm leading-6 text-ink/58">{plan.description}</p>
                    </div>
                    {plan.badge ? (
                      <span className="rounded-full bg-mist px-3 py-1 text-xs font-extrabold text-sage">{plan.badge}</span>
                    ) : null}
                  </div>
                  <p className="mt-6 font-serif text-4xl font-semibold">{plan.display}</p>
                  <Button
                    className="mt-6 w-full"
                    disabled={checkoutPlan === key}
                    onClick={() => startUpgrade(key)}
                    variant={key === 'team' ? 'brass' : 'primary'}
                  >
                    {checkoutPlan === key ? <Loader2 className="animate-spin" size={17} /> : <ShieldCheck size={17} />}
                    {checkoutPlan === key ? 'Creating checkout' : 'Buy Now'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <aside className="grid gap-5">
            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brass">Current Status</p>
              {loading ? (
                <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-ink/60">
                  <Loader2 className="animate-spin text-brass" size={18} />
                  Loading subscription
                </div>
              ) : (
                <div className="mt-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={isActive || isTrial ? 'text-sage' : 'text-clay'} size={20} />
                    <p className="text-xl font-extrabold">{statusLabel}</p>
                  </div>
                  <div className="mt-5 grid gap-3 text-sm">
                    <div className="flex justify-between gap-4 border-b border-ink/10 pb-3">
                      <span className="text-ink/55">Plan</span>
                      <span className="font-bold">{subscription?.planType || 'free'}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-ink/10 pb-3">
                      <span className="text-ink/55">Valid until</span>
                      <span className="font-bold">{formatDate(subscription?.endDate)}</span>
                    </div>
                    {subscription?.trialEndDate ? (
                      <div className="flex justify-between gap-4 border-b border-ink/10 pb-3">
                        <span className="text-ink/55">Trial ends</span>
                        <span className="font-bold">{formatDate(subscription.trialEndDate)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between gap-4">
                      <span className="text-ink/55">Days remaining</span>
                      <span className="font-bold">{subscription?.daysRemaining ?? 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brass">Included</p>
              <div className="mt-5 grid gap-3">
                {features.map((feature) => (
                  <div className="flex items-center gap-3 text-sm font-semibold text-ink/70" key={feature}>
                    <CheckCircle2 className="text-sage" size={17} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-lg border border-clay/25 bg-clay/10 p-4 text-sm font-semibold text-ink/75">{error}</div>
        ) : null}
      </div>
    </main>
  );
}

export default BillingPage;
