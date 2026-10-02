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
  Smartphone,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuthSession, getSavedUser, getProfile, logout } from '../api/authApi.js';
import { createUpgradeSession, getSubscriptionStatus } from '../api/subscriptionApi.js';
import Button from '../components/Button.jsx';
import PageShell from '../components/PageShell.jsx';

const plans = [
  {
    key: 'basic',
    name: 'Basic',
    price: '₹299',
    period: '/ month',
    description: 'Owner-only access for orders, customers, measurements, payments and bills.',
    note: 'Best for single-owner shops',
  },
  {
    key: 'team',
    name: 'Team',
    price: '₹399',
    period: '/ month',
    description: 'Owner plus 2 staff users for cutter/stitcher login and assignment.',
    note: 'Popular for growing shops',
    highlighted: true,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '₹599',
    period: '/ month',
    description: 'Owner plus 5 staff users with staff earnings and production tracking.',
    note: 'For busy tailoring teams',
  },
];

const appActions = [
  'Install the mobile app for daily shop work',
  'Manage customers, measurements and orders in the app',
  'Use this website for plans, renewals and checkout',
  'Return here whenever you need your subscription status',
];

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusLabel(subscription) {
  if (!subscription) return 'Loading';
  if (subscription.isActive && subscription.status === 'active') return 'Active';
  if (subscription.isActive && subscription.status === 'trial') return 'Trial active';
  if (subscription.status === 'trial_expired') return 'Trial ended';
  return 'Inactive';
}

function DashboardPage() {
  const navigate = useNavigate();
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
  const planName = subscription?.planType || subscription?.billingCycle || (loading || error ? '—' : 'free');
  const activeSubscription = Boolean(subscription?.isActive);
  const validity = formatDate(subscription?.endDate || subscription?.trialEndDate);
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
    await logout();
    navigate('/login', { replace: true });
  };

  const startUpgrade = async (plan) => {
    setCheckoutPlan(plan);
    setError('');
    try {
      const session = await createUpgradeSession(plan);
      if (!session?.upgradeUrl) throw new Error('Unable to prepare checkout.');
      window.location.href = session.upgradeUrl;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to start checkout. Please try again.');
    } finally {
      setCheckoutPlan('');
    }
  };

  return (
    <PageShell>
      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-7xl" aria-busy={loading}>
          <header className="flex flex-col gap-5 border-b border-border pb-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-eyebrow">Account workspace</p>
              <h1 className="mt-3 text-4xl font-semibold leading-[1.06] tracking-[-0.045em] text-ink sm:text-5xl">
                Good to see you, {user?.name || 'StitchBook user'}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                Keep an eye on your StitchBook access here. Your customers, measurements, orders and production work stay in the mobile app.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={loadAccount} variant="secondary" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={17} /> : <RefreshCw size={17} />}
                Refresh
              </Button>
              <Button to="/billing" variant="primary">
                Manage billing
                <ArrowRight size={17} />
              </Button>
              <Button onClick={handleLogout} variant="ghost">
                <LogOut size={17} />
                Logout
              </Button>
            </div>
          </header>

          {error ? (
            <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl border border-rosewood/20 bg-red-50 p-4 text-sm font-semibold text-rosewood">
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
              <span>{error}</span>
            </div>
          ) : null}

          <div className="mt-7 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)]">
            <section className="surface-card rounded-3xl p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink text-lg font-bold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{user?.name || 'StitchBook account'}</p>
                    <p className="mt-1 truncate text-sm text-muted">{user?.email || user?.phone || 'Owner account'}</p>
                  </div>
                </div>
                <span className={'inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ' + (activeSubscription ? 'bg-emerald-50 text-sage' : 'bg-amber-50 text-clay')}>
                  <span className={'h-2 w-2 rounded-full ' + (activeSubscription ? 'bg-sage' : 'bg-clay')} />
                  {loading ? 'Checking access' : statusLabel}
                </span>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-bone p-4">
                  <Crown className="text-brass" size={21} />
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Current plan</p>
                  {loading ? <div className="mt-2 h-7 w-24 animate-pulse rounded-lg bg-border/70" /> : <p className="mt-2 text-2xl font-semibold capitalize text-ink">{planName}</p>}
                </div>
                <div className="rounded-2xl border border-border bg-bone p-4">
                  <CalendarClock className="text-brass" size={21} />
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Valid until</p>
                  {loading ? <div className="mt-2 h-7 w-32 animate-pulse rounded-lg bg-border/70" /> : <p className="mt-2 text-2xl font-semibold text-ink">{validity}</p>}
                </div>
                <div className="rounded-2xl border border-border bg-bone p-4">
                  <ShieldCheck className="text-brass" size={21} />
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Account role</p>
                  {loading ? <div className="mt-2 h-7 w-20 animate-pulse rounded-lg bg-border/70" /> : <p className="mt-2 text-2xl font-semibold capitalize text-ink">{user?.role || 'owner'}</p>}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Smartphone className="mt-0.5 shrink-0 text-saffron" size={21} />
                  <div>
                    <p className="text-sm font-semibold text-ink">Daily shop work stays in the StitchBook app</p>
                    <p className="mt-1 text-sm leading-6 text-muted">Use the web account as your subscription and billing control centre.</p>
                  </div>
                </div>
                <Button to="/billing" variant="secondary">View billing</Button>
              </div>
            </section>

            <aside className="rounded-3xl bg-ink p-6 text-white shadow-soft sm:p-7">
              <ClipboardList className="text-[#AFC4FF]" size={26} />
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-white/50">How StitchBook fits your day</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em]">One account. Two focused places.</h2>
              <div className="mt-6 grid gap-4">
                {appActions.map((action) => (
                  <div className="flex items-start gap-3 text-sm leading-6 text-white/75" key={action}>
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[#7AD7B3]" size={17} />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <section className="mt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-eyebrow">Plans</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-ink">Choose access that matches your shop.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Start with owner-only access or add staff as your production team grows.</p>
              </div>
              <Button to="/billing" variant="ghost">
                Full billing details
                <ArrowRight size={17} />
              </Button>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {plans.map((plan) => (
                <article
                  className={'relative rounded-3xl border p-5 sm:p-6 ' + (plan.highlighted ? 'border-brass/30 bg-mist shadow-[0_18px_45px_rgba(47,91,211,.09)]' : 'border-border bg-white')}
                  key={plan.key}
                >
                  {plan.highlighted ? (
                    <span className="absolute right-5 top-5 rounded-full bg-brass px-3 py-1 text-[11px] font-bold text-white">Popular</span>
                  ) : null}
                  <p className="text-lg font-semibold text-ink">{plan.name}</p>
                  <p className="mt-2 min-h-[3rem] pr-14 text-sm leading-6 text-muted">{plan.description}</p>
                  <div className="mt-6 flex items-end gap-2">
                    <span className="text-4xl font-semibold tracking-[-0.05em] text-ink">{plan.price}</span>
                    <span className="pb-1 text-sm text-muted">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.11em] text-taupe">{plan.note}</p>
                  <Button
                    className="mt-6 w-full"
                    disabled={Boolean(checkoutPlan)}
                    onClick={() => startUpgrade(plan.key)}
                    variant={plan.highlighted ? 'primary' : 'secondary'}
                  >
                    {checkoutPlan === plan.key ? <Loader2 className="animate-spin" size={17} /> : <CreditCard size={17} />}
                    {checkoutPlan === plan.key ? 'Preparing checkout' : 'Choose ' + plan.name}
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
