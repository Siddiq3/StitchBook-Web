import { AlertCircle, CheckCircle2, CreditCard, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { clearAuthSession } from '../api/authApi.js';
import Button from '../components/Button.jsx';
import PageShell from '../components/PageShell.jsx';
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
  if (!value) return '—';
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
  const statusLabel = error && !subscription ? 'Status unavailable' : isActive
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
      if (!session?.upgradeUrl) throw new Error('Unable to prepare checkout.');
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
    <PageShell>
      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col gap-4 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow">Subscription & billing</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">A plan that fits your shop.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                Your subscription controls StitchBook app access. Choose the staff capacity you need today and change plans as your shop grows.
              </p>
            </div>
            <Button onClick={loadStatus} variant="secondary" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={17} /> : <RefreshCw size={17} />}
              Refresh status
            </Button>
          </header>

          {needsLogin ? (
            <section className="surface-card mt-7 rounded-3xl p-6 sm:p-8">
              <p className="section-eyebrow">Sign in required</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">Sign in before changing your subscription.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                We need to reconnect this billing page to your StitchBook account before showing plan status or starting checkout.
              </p>
              <Button className="mt-6" to="/login?redirect=/billing" variant="primary">Sign in and continue</Button>
            </section>
          ) : null}

          {!needsLogin ? (
            <>
              <section className="mt-7 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div className="surface-card rounded-3xl p-5 sm:p-7">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-white">
                      <CreditCard size={22} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">Current account access</p>
                      <p className="mt-1 text-sm leading-6 text-muted">Your subscription status updates after payment verification.</p>
                    </div>
                  </div>

                  {loading ? (
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {[1, 2, 3].map((item) => <div className="h-24 animate-pulse rounded-2xl bg-bone" key={item} />)}
                    </div>
                  ) : (
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-border bg-bone p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Status</p>
                        <p className={'mt-2 text-xl font-semibold ' + (isActive || isTrial ? 'text-sage' : 'text-clay')}>{statusLabel}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-bone p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Plan</p>
                        <p className="mt-2 text-xl font-semibold capitalize text-ink">{subscription?.planType || (error ? '—' : 'free')}</p>
                      </div>
                      <div className="rounded-2xl border border-border bg-bone p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Valid until</p>
                        <p className="mt-2 text-xl font-semibold text-ink">{formatDate(subscription?.endDate || subscription?.trialEndDate)}</p>
                      </div>
                    </div>
                  )}
                </div>

                <aside className="rounded-3xl border border-border bg-linen p-5 sm:p-6">
                  <ShieldCheck className="text-saffron" size={24} />
                  <h2 className="mt-4 text-xl font-semibold text-ink">Included with StitchBook</h2>
                  <div className="mt-4 grid gap-3">
                    {features.map((feature) => (
                      <div className="flex items-start gap-2 text-sm leading-5 text-muted" key={feature}>
                        <CheckCircle2 className="mt-0.5 shrink-0 text-sage" size={16} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </aside>
              </section>

              <section className="mt-10">
                <div>
                  <p className="section-eyebrow">Choose your plan</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink">Pay only for the team access you need.</h2>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  {Object.entries(plans).map(([key, plan]) => (
                    <article
                      className={'relative rounded-3xl border p-5 sm:p-6 ' + (key === 'team' ? 'border-brass/30 bg-mist shadow-[0_18px_45px_rgba(47,91,211,.09)]' : 'border-border bg-white')}
                      key={key}
                    >
                      {plan.badge ? <span className="absolute right-5 top-5 rounded-full bg-brass px-3 py-1 text-[11px] font-bold text-white">{plan.badge}</span> : null}
                      <p className="text-lg font-semibold text-ink">{plan.planName}</p>
                      <p className="mt-2 min-h-[3rem] pr-14 text-sm leading-6 text-muted">{plan.description}</p>
                      <p className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-ink">{plan.display}</p>
                      <Button
                        className="mt-6 w-full"
                        disabled={Boolean(checkoutPlan)}
                        onClick={() => startUpgrade(key)}
                        variant={key === 'team' ? 'primary' : 'secondary'}
                      >
                        {checkoutPlan === key ? <Loader2 className="animate-spin" size={17} /> : <ShieldCheck size={17} />}
                        {checkoutPlan === key ? 'Preparing checkout' : 'Choose ' + plan.planName}
                      </Button>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          {error ? (
            <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl border border-rosewood/20 bg-red-50 p-4 text-sm font-semibold text-rosewood">
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <span>{error}</span>
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}

export default BillingPage;
