import { useEffect, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
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
      setError(
        err.response?.data?.message ||
        'Invalid email/mobile number or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="brand-soft min-h-screen text-ink">
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div className="brand-solid relative overflow-hidden rounded-3xl p-7 text-white sm:p-9 lg:min-h-[34rem]">
          <img
            alt="Tailoring workspace"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.3]"
            src="/images/tailoring-craft.webp"
          />
          <div className="absolute inset-0 bg-brass/72" />
          <div className="relative flex h-full min-h-[28rem] flex-col justify-between">
            <div className="flex items-center gap-3">
              <LogoMark />
              <div>
                <p className="text-3xl font-semibold leading-none">StitchBook</p>
                <p className="mt-1 text-sm font-semibold text-white/72">Tailoring shop manager</p>
              </div>
            </div>

            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/14 px-4 py-2 text-sm font-semibold text-white/88">
                <ShieldCheck size={16} />
                Secure account access
              </span>
              <h1 className="mt-6 text-4xl font-semibold leading-tight">
                One StitchBook account for mobile and web.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-white/80">
                Sign in with either your email address or mobile number and your password.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm font-semibold text-white/82">
              <LockKeyhole size={18} />
              Password credentials are verified only by the StitchBook backend.
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="surface-card rounded-3xl bg-white p-6 sm:p-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-linen px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brass">
            <ShieldCheck size={14} />
            Secure sign in
          </p>
          <h2 className="mt-5 text-4xl font-semibold leading-tight">Welcome back</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Use the email address or mobile number connected to your StitchBook account.
          </p>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Email or mobile number</span>
              <input
                autoComplete="username"
                autoCapitalize="none"
                className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-base outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
                value={form.identifier}
                onChange={set('identifier')}
                placeholder="you@example.com or 98765 43210"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Password</span>
              <div className="flex items-center rounded-xl border border-ink/15 bg-white pr-3 focus-within:border-brass focus-within:ring-4 focus-within:ring-brass/10">
                <input
                  autoComplete="current-password"
                  className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3.5 text-base outline-none"
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
              <Link className="inline-flex min-h-10 items-center px-1 text-sm font-semibold text-brass hover:underline" to="/forgot-password">
                Forgot password?
              </Link>
            </div>
          </div>

          {searchParams.get('reset') === 'success' ? (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-600/20 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
              Password reset successfully. Sign in with your new password.
            </div>
          ) : null}

          {error ? (
            <div role="alert" className="mt-5 rounded-xl border border-rosewood/20 bg-rosewood/10 p-4 text-sm font-semibold text-rosewood">
              {error}
            </div>
          ) : null}

          <button
            className="mt-6 min-h-12 w-full rounded-xl bg-brass px-5 py-3 font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
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
