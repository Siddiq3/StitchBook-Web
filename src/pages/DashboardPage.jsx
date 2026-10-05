import usePlans from '../hooks/usePlans.js';
import PriceStatus from '../components/PriceStatus.jsx';
import {
  AlertCircle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Crown,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearAuthSession, getSavedUser, getProfile, logout } from '../api/authApi.js';
import { createUpgradeSession, getSubscriptionStatus } from '../api/subscriptionApi.js';
import Button from '../components/Button.jsx';
import PageShell from '../components/PageShell.jsx';

const appActions = [
  'Install the mobile app for daily shop work',
  'Use this website to buy or renew plans',
  'Open the app for orders, measurements, and staff work',
  'Check account and subscription status here',
];

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusLabel(subscription) {
  if (!subscription) return 'Loading';
  if (subscription.isActive && subscription.status === 'active') return 'Active plan';
  if (subscription.isActive && subscription.status === 'trial') return 'Free trial active';
  if (subscription.status === 'trial_expired') return 'Trial completed';
  return 'No active plan';
}

function DashboardPage() {
  const pricing = usePlans();
  const plans = Object.entries(pricing.plans).map(([key, plan]) => ({ ...plan, key, name: plan.label, period: '/ month', highlighted: key === 'team', note: plan.bestFor }));
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(() => getSavedUser());
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState('');
  const [error, setError] = useState('');

  const loadAccount = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [profile, status] = await Promise.all([
        getProfile(),
        getSubscriptionStatus(),
      ]);
      setUser(profile);
      setSubscription(status);
    } catch (err) {
      if (err.response?.status === 401) {
        clearAuthSession();
        navigate('/login?redirect=/dashboard', { replace: true });
        return;
      }
      setError(err.response?.data?.message || err.message || "We couldn't load your account details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadAccount();
  }, [loadAccount]);

  const statusLabel = getStatusLabel(subscription);
  const statusTone = subscription?.isActive ? 'text-sage' : 'text-clay';
  const planName = subscription?.planType || subscription?.billingCycle || (loading || error ? '—' : 'free');
  const initials = useMemo(() => {
    const source = user?.name || user?.email || user?.phone || 'SB';
    return source
      .split(/[\s@]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // The local session is cleared even when the server cannot be reached.
      navigate('/login?logout=local', { replace: true });
      return;
    }
    navigate('/login', { replace: true });
  };

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
      setError(err.response?.data?.message || err.message || 'Unable to start checkout. Please try again.');
    } finally {
      setCheckoutPlan('');
    }
  };

  return (
    <PageShell>
      <section className="dashboard-page bg-bone px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl" aria-busy={loading}>
          {location.state?.accountCreated && <p role="status" className="mb-5 rounded-xl bg-emerald-50 p-4 text-sage">Your account has been created. Welcome to StitchBook.</p>}
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)]">
            <div className="surface-card rounded-2xl border border-ink/10 bg-white p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink text-xl font-semibold text-bone">
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brass">Account</p>
                    <h1 className="mt-2 font-sans text-4xl font-semibold leading-tight sm:text-3xl">
                      Welcome, {user?.name || 'StitchBook user'}
                    </h1>
                    <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-muted">
                      {user?.email ? (
                        <span className="rounded-full border border-ink/10 bg-bone px-3 py-1">{user.email}</span>
                      ) : null}
                      {user?.phone ? (
                        <span className="rounded-full border border-ink/10 bg-bone px-3 py-1">{user.phone}</span>
                      ) : null}
                      <span className="rounded-full border border-ink/10 bg-bone px-3 py-1 capitalize">{user?.role || 'owner'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button disabled={loading} onClick={loadAccount} variant="secondary">
                    {loading ? <Loader2 className="animate-spin" size={17} /> : <RefreshCw size={17} />}
                    Refresh
                  </Button>
                  <Button onClick={handleLogout} variant="secondary">
                    <LogOut size={17} />
                    Logout
                  </Button>
                </div>
              </div>

              {error ? (
                <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl border border-clay/25 bg-clay/10 p-4 text-sm font-semibold text-ink/75">
                  <AlertCircle className="mt-0.5 text-clay" size={18} />
                  {error}
                </div>
              ) : null}

              <div className="mt-7 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-ink/10 bg-bone p-4">
                  <CalendarClock className="text-brass" size={22} />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">Status</p>
                  <p className={`mt-2 text-xl font-extrabold ${statusTone}`}>{statusLabel}</p>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-bone p-4">
                  <Crown className="text-brass" size={22} />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">Current Plan</p>
                  <p className="mt-2 text-xl font-semibold capitalize">{planName}</p>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-bone p-4">
                  <ShieldCheck className="text-brass" size={22} />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">Valid Until</p>
                  <p className="mt-2 text-xl font-semibold">{formatDate(subscription?.endDate || subscription?.trialEndDate)}</p>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-ink/10 bg-ink p-5 text-bone sm:p-7">
              <ClipboardList className="text-brass" size={26} />
              <h2 className="mt-5 font-sans text-4xl font-semibold leading-tight">Your shop subscription</h2>
              <p className="mt-4 text-sm leading-6 text-bone/70">
                The full tailoring workflow is inside the StitchBook app. Use this website for plan changes, checkout, and account status.
              </p>
              <div className="mt-6 grid gap-3">
                {appActions.map((action) => (
                  <div className="flex items-center gap-3 text-sm font-semibold text-bone/80" key={action}>
                    <CheckCircle2 className="text-sage" size={17} />
                    {action}
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <section className="surface-card mt-8 rounded-2xl border border-ink/10 bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brass">Subscription</p>
                <h2 className="mt-2 font-sans text-4xl font-semibold">Choose the plan for your app access</h2>
              </div>
              <Button to="/billing" variant="secondary">
                Billing details
                <ArrowRight size={17} />
              </Button>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              <div className="col-span-full"><PriceStatus {...pricing} /></div>
              {plans.map((plan) => (
                <article
                  className={`rounded-2xl border p-5 ${
                    plan.highlighted
                      ? 'border-brass/40 bg-mist'
                      : 'border-ink/10 bg-bone'
                  }`}
                  key={plan.key}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xl font-semibold">{plan.name}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{plan.description}</p>
                    </div>
                    {plan.highlighted ? (
                      <span className="rounded-full bg-brass px-3 py-1 text-xs font-semibold text-white">Popular</span>
                    ) : null}
                  </div>
                  <div className="mt-6 flex items-end gap-1">
                    <span className="font-sans text-3xl font-semibold leading-none">{plan.price}</span>
                    <span className="pb-1 text-sm font-semibold text-muted">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">{plan.note}</p>
                  <Button
                    className="mt-6 w-full"
                    disabled={Boolean(checkoutPlan) || pricing.loading || Boolean(pricing.error)}
                    onClick={() => startUpgrade(plan.key)}
                    variant={plan.highlighted ? 'brass' : 'primary'}
                  >
                    {checkoutPlan === plan.key ? <Loader2 className="animate-spin" size={17} /> : <CreditCard size={17} />}
                    {checkoutPlan === plan.key ? 'Creating checkout' : 'Buy Now'}
                  </Button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </PageShell>
  );
}

export default DashboardPage;
