import { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, KeyRound, MailCheck, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset, resetPasswordWithOtp } from '../api/authApi.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [form, setForm] = useState({ email: '', otp: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cleanEmail = form.email.trim().toLowerCase();
  const set = (key) => (event) => {
    const value = key === 'otp'
      ? event.target.value.replace(/\D/g, '').slice(0, 6)
      : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const sendCode = async (event) => {
    event?.preventDefault();
    if (!EMAIL_RE.test(cleanEmail)) {
      setError('Enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await requestPasswordReset(cleanEmail);
      setStep('code');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to request a reset code.');
    } finally {
      setLoading(false);
    }
  };

  const continueCode = (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(form.otp)) {
      setError('Enter the 6-digit verification code.');
      return;
    }
    setError('');
    setStep('password');
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    if (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      setError('Password must be at least 8 characters and include a letter and a number.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await resetPasswordWithOtp({
        email: cleanEmail,
        otp: form.otp,
        newPassword: form.password,
      });
      navigate('/login?reset=success', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid or expired verification code.';
      setError(message);
      if (message.toLowerCase().includes('verification code')) setStep('code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page auth-recovery brand-soft min-h-screen text-ink">
      <section className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-8 sm:px-6">
        <div className="w-full">
          <Link
            className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-muted transition hover:bg-white hover:text-ink"
            to="/login"
          >
            <ArrowLeft size={18} />
            Back to sign in
          </Link>

          <div className="surface-card rounded-3xl bg-white p-6 sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linen text-brass">
              <KeyRound size={26} />
            </div>
            <h1 className="mt-6 text-3xl font-semibold leading-tight">Reset your password</h1>
            <p className="mt-3 text-sm leading-6 text-muted">
              {step === 'email' && 'Enter the email address linked to your StitchBook account.'}
              {step === 'code' && `Enter the 6-digit code sent to ${cleanEmail}.`}
              {step === 'password' && 'Create a new password for your StitchBook account.'}
            </p>

            {step === 'email' ? (
              <form className="mt-7 space-y-5" onSubmit={sendCode}>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Email address</span>
                  <input
                    autoComplete="email"
                    autoCapitalize="none"
                    className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-base outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
                    onChange={set('email')}
                    placeholder="you@example.com"
                    type="email"
                    value={form.email}
                  />
                </label>
                <p className="text-xs leading-5 text-muted">
                  For privacy, StitchBook shows the same confirmation whether or not an account exists.
                </p>
                {error ? <div role="alert" className="rounded-xl border border-rosewood/20 bg-rosewood/10 p-4 text-sm font-semibold text-rosewood">{error}</div> : null}
                <button className="min-h-12 w-full rounded-xl bg-brass px-5 py-3 font-semibold text-white transition hover:brightness-95 disabled:opacity-60" disabled={loading} type="submit">
                  {loading ? 'Sending…' : 'Send verification code'}
                </button>
              </form>
            ) : null}

            {step === 'code' ? (
              <form className="mt-7 space-y-5" onSubmit={continueCode}>
                <div className="rounded-2xl border border-ink/10 bg-linen/60 p-4">
                  <div className="flex items-center gap-3">
                    <MailCheck className="text-brass" size={20} />
                    <div>
                      <p role="status" className="text-sm font-semibold">If an account uses this email, a verification code has been sent.</p>
                      <p className="mt-1 text-xs leading-5 text-muted">The code expires shortly. Check spam if it is not in your inbox.</p>
                    </div>
                  </div>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Verification code</span>
                  <input
                    autoComplete="one-time-code"
                    className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-center text-2xl font-semibold tracking-[0.35em] outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
                    inputMode="numeric"
                    maxLength={6}
                    onChange={set('otp')}
                    placeholder="123456"
                    value={form.otp}
                  />
                </label>
                {error ? <div role="alert" className="rounded-xl border border-rosewood/20 bg-rosewood/10 p-4 text-sm font-semibold text-rosewood">{error}</div> : null}
                <button className="min-h-12 w-full rounded-xl bg-brass px-5 py-3 font-semibold text-white" disabled={loading} type="submit">Continue</button>
                <button className="min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-brass transition hover:bg-linen disabled:opacity-60" disabled={loading} onClick={sendCode} type="button">
                  {loading ? 'Sending…' : 'Send code again'}
                </button>
                <button className="min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-muted transition hover:bg-bone" disabled={loading} onClick={() => { setStep('email'); setForm((prev) => ({ ...prev, otp: '' })); setError(''); }} type="button">
                  Use a different email
                </button>
              </form>
            ) : null}

            {step === 'password' ? (
              <form className="mt-7 space-y-5" onSubmit={resetPassword}>
                <div className="flex items-center gap-2 rounded-xl bg-linen px-4 py-3 text-sm font-semibold text-brass">
                  <ShieldCheck size={18} />
                  Choose a new secure password
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">New password</span>
                  <div className="flex items-center rounded-xl border border-ink/15 bg-white pr-3 focus-within:border-brass focus-within:ring-4 focus-within:ring-brass/10">
                    <input
                      autoComplete="new-password"
                      className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3.5 text-base outline-none"
                      onChange={set('password')}
                      placeholder="At least 8 characters"
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                    />
                    <button aria-label={showPassword ? 'Hide password' : 'Show password'} className="rounded-lg p-2 text-muted hover:bg-bone hover:text-ink" onClick={() => setShowPassword((value) => !value)} type="button">
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Confirm new password</span>
                  <input
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3.5 text-base outline-none transition focus:border-brass focus:ring-4 focus:ring-brass/10"
                    onChange={set('confirm')}
                    placeholder="Repeat your password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirm}
                  />
                </label>
                <p className="text-xs leading-5 text-muted">Use 8 to 128 characters with at least one letter and one number.</p>
                {error ? <div role="alert" className="rounded-xl border border-rosewood/20 bg-rosewood/10 p-4 text-sm font-semibold text-rosewood">{error}</div> : null}
                <button className="min-h-12 w-full rounded-xl bg-brass px-5 py-3 font-semibold text-white transition hover:brightness-95 disabled:opacity-60" disabled={loading} type="submit">
                  {loading ? 'Resetting…' : 'Reset password'}
                </button>
                <button className="min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-muted transition hover:bg-bone" disabled={loading} onClick={() => { setStep('code'); setError(''); }} type="button">
                  Back to verification code
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

export default ForgotPasswordPage;
