import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Clock3, Ruler, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogoMark } from '../components/Logo.jsx';
import { getAuthToken, loginWithGoogle } from '../api/authApi.js';

const configuredGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const googleClientId = configuredGoogleClientId && !configuredGoogleClientId.startsWith('your-') ? configuredGoogleClientId : '';

const trustItems = [
  { icon: Users, label: 'Customers' },
  { icon: Ruler, label: 'Measurements' },
  { icon: Clock3, label: 'Orders due' },
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve(existing);
        return;
      }
      existing.addEventListener('load', () => resolve(existing), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Could not load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve(script);
    };
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.appendChild(script);
  });
}

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const googleButtonRef = useRef(null);
  const [loading, setLoading] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const completeLogin = (result, label) => {
    setMessage(`${label} successful. Welcome ${result.user?.name || result.user?.phone || 'back'}.`);
    setError('');
    const redirectTo = searchParams.get('redirect');
    const isPublicUpgradeFlow = redirectTo?.startsWith('/upgrade/session/');

    // Same-origin paths only: "//host" and "/\\host" are treated as external URLs.
    const isSafeRedirect = redirectTo?.startsWith('/') && !redirectTo.startsWith('//') && !redirectTo.startsWith('/\\');

    if (isSafeRedirect && !isPublicUpgradeFlow) {
      setTimeout(() => navigate(redirectTo, { replace: true }), 400);
    } else {
      setTimeout(() => navigate('/dashboard', { replace: true }), 400);
    }
  };

  useEffect(() => {
    if (getAuthToken()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!googleClientId) { setError('Google sign-in is not configured. Please contact support.'); return; }
    if (!googleButtonRef.current) return;

    loadScript('https://accounts.google.com/gsi/client')
      .then(() => {
        if (!window.google?.accounts?.id) {
          throw new Error('Google login is unavailable. Please refresh or use mobile login.');
        }

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async ({ credential }) => {
            try {
              setLoading('google');
              const result = await loginWithGoogle(credential, {
                name: navigator.userAgent,
              });
              completeLogin(result, 'Google login');
            } catch (err) {
              setError(err.response?.data?.message || err.message || 'Google login failed');
            } finally {
              setLoading('');
            }
          },
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'continue_with',
          width: Math.min(320, googleButtonRef.current?.clientWidth || 320),
        });
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleMobileLogin = async () => {
    setError('Mobile OTP login is disabled in this build.');
    setLoading('');
  };

  return (
    <main className="brand-soft min-h-screen text-ink">
      <section aria-busy={Boolean(loading)} className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
        <div className="brand-solid relative overflow-hidden rounded-2xl p-6 text-white sm:p-8 lg:min-h-[32rem]">
          <img
            alt="Tailoring workspace"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.34]"
            src="/images/stitch-hero.png"
          />
          <div className="absolute inset-0 bg-brass/72" />

          <div className="relative flex h-full min-h-[16rem] lg:min-h-[30rem] flex-col justify-between">
            <div className="flex items-center gap-3">
              <LogoMark />
              <div>
                <p className="text-3xl font-semibold leading-none">StitchBook</p>
                <p className="mt-1 text-sm font-semibold text-white/72">Tailoring shop manager</p>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/14 px-4 py-2 text-sm font-semibold text-white/88">
                <Sparkles size={16} className="text-white" />
                Subscription and account access
              </div>
              <h1 className="text-balance mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
                Sign in to manage your StitchBook plan
              </h1>
              <p className="mt-5 text-base leading-7 text-white/78 sm:text-lg">
                Use the website for subscription, billing, and account access. Open the mobile app for customers, measurements, orders, and payments.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {trustItems.map(({ icon: Icon, label }) => (
                <div className="rounded-2xl border border-white/16 bg-white/14 p-4" key={label}>
                  <Icon className="text-white" size={20} />
                  <p className="mt-3 text-sm font-semibold text-white/90">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="surface-card rounded-2xl bg-white p-5 sm:p-7 lg:p-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-linen px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brass">
              <ShieldCheck size={14} />
              Secure sign in
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-tight">Continue to StitchBook</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Choose the sign-in method you use for your shop account.
            </p>
          </div>

          <div className="mt-7 rounded-xl border border-ink/10 bg-bone p-4">
            {googleClientId ? (
              <div ref={googleButtonRef} />
            ) : (
              <p className="rounded-md border border-ink/10 bg-ink/[0.03] px-3 py-2 text-sm font-medium text-muted">
                Google login is not configured.
              </p>
            )}
          </div>

          {message ? (
            <div role="status" className="mt-5 flex items-start gap-3 rounded-xl border border-sage/20 bg-mist p-4 text-sm font-semibold text-ink">
              <CheckCircle2 className="mt-0.5 text-sage" size={18} />
              <span>{message}</span>
            </div>
          ) : null}

          {error ? (
            <div role="alert" className="mt-5 rounded-xl border border-rosewood/20 bg-rosewood/10 p-4 text-sm font-semibold text-rosewood">
              {error}
            </div>
          ) : null}

          <p className="mt-6 text-center text-xs font-semibold leading-5 text-muted">
            By continuing, you confirm this account belongs to your tailoring business.
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
