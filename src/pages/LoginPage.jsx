import { useEffect, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, LockKeyhole, Scissors, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogoMark } from '../components/Logo.jsx';
import { getAuthToken, loginWithPassword } from '../api/authApi.js';

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (getAuthToken()) navigate('/dashboard', { replace: true });
  }, [navigate]);

  const set = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.identifier.trim() || !form.password) {
      setError('Enter your email or mobile number and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await loginWithPassword(form.identifier.trim(), form.password, {
        name: navigator.userAgent,
      });

      const redirectTo = searchParams.get('redirect');
      const isPublicUpgradeFlow = redirectTo?.startsWith('/upgrade/session/');
      const isSafeRedirect =
        redirectTo?.startsWith('/') &&
        !redirectTo.startsWith('//') &&
        !redirectTo.startsWith('/\\');

      navigate(isSafeRedirect && !isPublicUpgradeFlow ? redirectTo : '/dashboard', {
        replace: true,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email/mobile number or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="brand-soft min-h-screen text-ink">
      <section className="auth-layout">
        <aside className="auth-story brand-solid">
          <img
            alt="Tailoring workspace"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
            src="/images/tailoring-craft.webp"
          />
          <div className="auth-story-content">
            <div className="flex items-center gap-3">
              <LogoMark />
              <div>
                <p className="font-serif text-3xl leading-none">StitchBook</p>
                <p className="mt-1 text-sm text-white/65">Tailoring shop manager</p>
              </div>
            </div>

            <div className="max-w-lg">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
                <Scissors size={16} />
                Built for tailoring businesses
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                Pick up exactly where your shop left off.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-white/72">
                One account connects your StitchBook mobile workspace with subscription and billing on the web.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm font-semibold text-white/72">
              <LockKeyhole size={18} />
              Secure password sign in
            </div>
          </div>
        </aside>

        <form onSubmit={submit} className="auth-card surface-card">
          <p className="auth-badge"><ShieldCheck size={14} /> Secure sign in</p>
          <h2 className="auth-title">Welcome back.</h2>
          <p className="auth-subtitle">
            Sign in with the email address or mobile number connected to your StitchBook account.
          </p>

          <div className="auth-form">
            <label className="form-label">
              <span>Email or mobile number</span>
              <input
                autoComplete="username"
                autoCapitalize="none"
                className="form-input"
                value={form.identifier}
                onChange={set('identifier')}
                placeholder="you@example.com or 98765 43210"
              />
            </label>

            <label className="form-label">
              <span>Password</span>
              <div className="form-input-group">
                <input
                  autoComplete="current-password"
                  className="form-input min-w-0 flex-1"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Enter your password"
                />
                <button
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="rounded-lg p-2 text-muted transition hover:bg-bone hover:text-ink"
                  onClick={() => setShowPassword((value) => !value)}
                  type="button"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </label>

            <div className="flex justify-end">
              <Link className="inline-flex min-h-10 items-center text-sm font-semibold text-brass hover:underline" to="/forgot-password">
                Forgot password?
              </Link>
            </div>
          </div>

          {searchParams.get('reset') === 'success' ? (
            <div className="auth-message auth-message-success mt-5 flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
              <span>Password reset successfully. Sign in with your new password.</span>
            </div>
          ) : null}

          {error ? <div role="alert" className="auth-message auth-message-error mt-5">{error}</div> : null}

          <button
            className="mt-6 min-h-12 w-full rounded-xl bg-brass px-5 py-3 font-semibold text-white shadow-[0_8px_22px_rgba(47,91,211,.20)] transition hover:bg-midnight disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="mt-6 text-center text-sm text-muted">
            New to StitchBook?{' '}
            <Link className="font-semibold text-brass hover:underline" to="/register">
              Create an account
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;
