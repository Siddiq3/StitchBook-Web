import { CheckCircle2, CreditCard, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { clearAuthSession } from '../api/authApi.js';
import Button from '../components/Button.jsx';
import { LogoMark } from '../components/Logo.jsx';
import { createUpgradeSession, getSubscriptionStatus } from '../api/subscriptionApi.js';

import { plans } from '../data/plans.js';

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
      setError(err.response?.data?.message || err.message || "We couldn't load your subscription. Please try again.");
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
  const statusLabel = error && !subscription ? "Status unavailable" : isActive
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
        throw new Error('Unable to prepare checkout.');
      }
      window.location.href = session.upgradeUrl;
    } catch (err) {
      if (err.response?.status === 401) {
        clearAuthSession();
        setNeedsLogin(true);
        return;
      }
      setError(err.response?.data?.message || err.message || 'Unable to start checkout. Please try again.');
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
              <p className="font-sans text-3xl font-semibold leading-none">StitchBook</p>
              <p className="mt-1 text-sm font-semibold text-muted">Subscription status</p>
            </div>
          </div>
          <Button onClick={loadStatus} variant="secondary">
            {loading ? <Loader2 className="animate-spin" size={17} /> : <RefreshCw size={17} />}
            Refresh Status
          </Button>
        </header>

        {needsLogin ? (
          <section className="surface-card mt-10 rounded-2xl border border-ink/10 bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-brass">Billing login required</p>
            <h1 className="mt-3 font-sans text-4xl font-semibold leading-tight">Sign in to continue subscription</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Please sign in again to view your plan and continue payment.
            </p>
            <Button className="mt-6" to="/login?redirect=/billing" variant="primary">
              Sign in and continue
            </Button>
          </section>
        ) : null}

        {!needsLogin ? (
        <section className="mt-10 grid gap-6">
          <div className="surface-card rounded-2xl border border-ink/10 bg-white p-5 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-bone">
                <CreditCard size={22} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brass">Subscription</p>
                <h1 className="mt-2 font-sans text-2xl font-semibold leading-tight">Choose your StitchBook plan</h1>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
                  Choose the plan that matches your shop size. After payment, continue daily work in the StitchBook mobile app.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {Object.entries(plans).map(([key, plan]) => (
                <div className="rounded-2xl border border-ink/10 bg-bone p-5" key={key}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{plan.planName}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{plan.description}</p>
                    </div>
                    {plan.badge ? (
                      <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-sage">{plan.badge}</span>
                    ) : null}
                  </div>
                  <p className="mt-6 font-sans text-2xl font-semibold">{plan.display}</p>
                  <Button
                    className="mt-6 w-full"
                    disabled={Boolean(checkoutPlan)}
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

          <aside className="grid gap-5 md:grid-cols-2">
            <div className="surface-card rounded-2xl border border-ink/10 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brass">Current Status</p>
              {loading ? (
                <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-muted">
                  <Loader2 className="animate-spin text-brass" size={18} />
                  Loading subscription
                </div>
              ) : (
                <div className="mt-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={isActive || isTrial ? 'text-sage' : 'text-clay'} size={20} />
                    <p className="text-xl font-semibold">{statusLabel}</p>
                  </div>
                  <div className="mt-5 grid gap-3 text-sm">
                    <div className="flex justify-between gap-4 border-b border-ink/10 pb-3">
                      <span className="text-muted">Plan</span>
                      <span className="font-semibold">{subscription?.planType || (error ? '—' : 'free')}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-ink/10 pb-3">
                      <span className="text-muted">Valid until</span>
                      <span className="font-semibold">{formatDate(subscription?.endDate)}</span>
                    </div>
                    {subscription?.trialEndDate ? (
                      <div className="flex justify-between gap-4 border-b border-ink/10 pb-3">
                        <span className="text-muted">Trial ends</span>
                        <span className="font-semibold">{formatDate(subscription.trialEndDate)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between gap-4">
                      <span className="text-muted">Days remaining</span>
                      <span className="font-semibold">{subscription?.daysRemaining ?? (error ? "—" : 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="surface-card rounded-2xl border border-ink/10 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brass">App access includes</p>
              <div className="mt-5 grid gap-3">
                {features.map((feature) => (
                  <div className="flex items-center gap-3 text-sm font-semibold text-muted" key={feature}>
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
          <div role="alert" className="mt-6 rounded-2xl border border-clay/25 bg-clay/10 p-4 text-sm font-semibold text-ink/75">{error}</div>
        ) : null}
      </div>
    </main>
  );
}

export default BillingPage;
