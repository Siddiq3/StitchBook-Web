import { motion, useReducedMotion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Check,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { clearAuthSession, getSavedUser, getProfile, logout } from '../api/authApi.js';
import { createUpgradeSession, getSubscriptionStatus } from '../api/subscriptionApi.js';
import Button from '../components/Button.jsx';
import PageShell from '../components/PageShell.jsx';
import { plans } from '../data/plans.js';
import '../styles/dashboard.css';

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

// Same app link the landing page uses; falls back to emailing for access
const appDownloadUrl = (() => {
  for (const value of [import.meta.env.VITE_APP_DOWNLOAD_URL, import.meta.env.VITE_GOOGLE_PLAY_URL]) {
    try { const url = new URL(value); if (url.protocol === 'https:' && url.hostname !== 'example.com') return url.href; } catch { /* not set */ }
  }
  return 'mailto:stitchbook3@gmail.com?subject=StitchBook%20app%20download';
})();

function DashboardPage() {
  const reduceMotion = useReducedMotion();
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
  const statusTone = subscription?.isActive ? 'is-active' : 'is-inactive';
  const planName = subscription?.planType || subscription?.billingCycle || (loading || error ? 'Unavailable' : 'free');
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
      <section className="dashboard-page db">
        <div className="db-container" aria-busy={loading}>
          {location.state?.accountCreated && (
            <motion.div role="status" className="db-notice"
              initial={reduceMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}>
              <CheckCircle2 size={22} aria-hidden="true" />
              <div><strong>Your account is ready.</strong><p>Get the StitchBook app and sign in with the same email or mobile number to set up your shop.</p></div>
              <Button href={appDownloadUrl}><Smartphone size={17} />Get the app</Button>
            </motion.div>
          )}

          <header className="db-header">
            <div className="db-identity">
              <span className="db-avatar" aria-hidden="true">{initials}</span>
              <div><p className="db-eyebrow">Your account</p><h1>Welcome, {user?.name || 'StitchBook user'}</h1><p>Manage your plan. Keep your shop moving.</p></div>
            </div>
            <div className="db-toolbar">
              <Button disabled={loading} onClick={loadAccount} variant="secondary">
                {loading ? <Loader2 className="animate-spin" size={17} /> : <RefreshCw size={17} />}Refresh
              </Button>
              <Button onClick={handleLogout} variant="ghost"><LogOut size={17} />Sign out</Button>
            </div>
          </header>

          {error && <div role="alert" className="db-error"><AlertCircle size={20} aria-hidden="true" /><p>{error}</p><button type="button" disabled={loading} onClick={loadAccount}>Try again</button></div>}

          <div className="db-overview">
            <section className="db-card db-subscription" aria-labelledby="subscription-heading">
              <div className="db-card-heading"><h2 id="subscription-heading">Your subscription</h2>
                <span className={`db-status ${loading || (!subscription && error) ? 'is-loading' : statusTone}`}>
                  {loading ? 'Updating…' : !subscription && error ? 'Unavailable' : statusLabel}
                </span>
              </div>
              <p className="db-description">Your current plan and account details, in one place.</p>
              <dl className="db-stats">
                <div><dt>Current plan</dt><dd className="db-capitalize">{loading ? 'Loading…' : planName}</dd></div>
                <div><dt>Valid until</dt><dd>{loading ? 'Loading…' : formatDate(subscription?.endDate || subscription?.trialEndDate)}</dd></div>
              </dl>
              <dl className="db-account-details">
                {user?.email && <div><dt>Email</dt><dd>{user.email}</dd></div>}
                {user?.phone && <div><dt>Mobile</dt><dd>{user.phone}</dd></div>}
                <div><dt>Account role</dt><dd className="db-capitalize">{user?.role || 'owner'}</dd></div>
              </dl>
              <div className="db-card-footer"><Button to="/billing" variant="secondary">Billing details<ArrowRight size={16} /></Button><a href="#dashboard-plans">View plans</a></div>
            </section>

            <aside className="db-card db-app" aria-labelledby="app-heading">
              <span className="db-app-icon"><Smartphone size={23} aria-hidden="true" /></span>
              <h2 id="app-heading">Your shop goes with you.</h2>
              <p>Orders, measurements, payments and staff work are together in the StitchBook app.</p>
              <ul><li><Check size={16} aria-hidden="true" />Use your same account to sign in</li><li><Check size={16} aria-hidden="true" />Buy or renew your plan on this website</li></ul>
              <Button href={appDownloadUrl}><Smartphone size={17} />{appDownloadUrl.startsWith('mailto:') ? 'Request app access' : 'Get the app'}<ArrowRight size={16} /></Button>
              <a className="db-help" href="mailto:stitchbook3@gmail.com">Need help getting started?</a>
            </aside>
          </div>

          <section className="db-pricing" id="dashboard-plans" aria-labelledby="plans-heading">
            <div className="db-pricing-heading"><div><p className="db-eyebrow">Plans for your shop</p><h2 id="plans-heading">A plan for every stage.</h2><p>Choose the access your shop needs. Payments are handled securely with Cashfree.</p></div><span className="db-secure"><ShieldCheck size={16} aria-hidden="true" />Secure checkout</span></div>
            <div className="db-plans">
              {Object.entries(plans).map(([key, plan]) => (
                <article className={`db-card db-plan ${key === 'team' ? 'db-plan-featured' : ''}`} key={key}>
                  <div className="db-plan-heading"><h3>{plan.label}</h3>{key === 'team' && <span className="db-plan-badge">Most popular</span>}</div>
                  <p className="db-plan-description">{plan.description}</p>
                  <p className="db-price">₹{plan.amount}<span>/month</span></p>
                  <p className="db-plan-access">{plan.access}</p>
                  <ul className="db-features" aria-label={`${plan.label} plan features`}>
                    {plan.featureRows.map(feature => (
                      <li key={feature.label} className={feature.included ? 'is-included' : 'is-excluded'}>
                        {feature.included ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
                        <span className="db-feature-label">{feature.label}{feature.planned && <small>Planned feature</small>}</span>
                        <span className="db-feature-value">{feature.value}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="db-buy" disabled={Boolean(checkoutPlan)} onClick={() => startUpgrade(key)} variant={key === 'team' ? 'primary' : 'secondary'}>
                    {checkoutPlan === key ? <Loader2 className="animate-spin" size={17} /> : <CreditCard size={17} />}
                    {checkoutPlan === key ? 'Creating checkout' : `Choose ${plan.label}`}
                  </Button>
                </article>
              ))}
            </div>
            <p className="db-billing-note">Plans run for 30 days and never renew automatically.</p>
          </section>
        </div>
      </section>
    </PageShell>
  );
}

export default DashboardPage;
