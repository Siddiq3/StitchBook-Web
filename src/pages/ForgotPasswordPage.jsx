import { useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff, KeyRound, MailCheck, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset, resetPasswordWithOtp } from '../api/authApi.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const steps = ['Email', 'Verify', 'Password'];

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [form, setForm] = useState({ email: '', otp: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cleanEmail = form.email.trim().toLowerCase();
  const activeStep = step === 'email' ? 0 : step === 'code' ? 1 : 2;

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
    <main className="brand-soft min-h-screen text-ink">
      <section className="mx-auto flex min-h-screen max-w-2xl items-center px-4 py-8 sm:px-6">
        <div className="w-full">
          <Link className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-sm font-semibold text-muted transition hover:text-ink" to="/login">
            <ArrowLeft size={18} />
            Back to sign in
          </Link>

          <div className="auth-card surface-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-brass">
                <KeyRound size={23} />
              </div>
              <span className="auth-badge"><ShieldCheck size={14} /> Account recovery</span>
            </div>

            <h1 className="auth-title">Reset your password.</h1>
            <p className="auth-subtitle">
              {step === 'email' && 'Start with the email address linked to your StitchBook account.'}
              {step === 'code' && 'Enter the 6-digit code we sent to ' + cleanEmail + '.'}
              {step === 'password' && 'Create a new password for your StitchBook account.'}
            </p>

            <div className="mt-6 grid grid-cols-3 gap-2" aria-label="Password reset progress">
              {steps.map((label, index) => (
                <div className="flex items-center gap-2" key={label}>
                  <span className={'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ' + (index < activeStep ? 'bg-sage text-white' : index === activeStep ? 'bg-brass text-white' : 'bg-bone text-muted')}>
                    {index < activeStep ? <Check size={14} /> : index + 1}
                  </span>
                  <span className={'hidden text-xs font-semibold sm:block ' + (index <= activeStep ? 'text-ink' : 'text-muted')}>{label}</span>
                </div>
              ))}
            </div>

            {step === 'email' ? (
              <form className="auth-form mt-7" onSubmit={sendCode}>
                <label className="form-label">
                  <span>Email address</span>
                  <input
                    autoComplete="email"
                    autoCapitalize="none"
                    className="form-input"
                    onChange={set('email')}
                    placeholder="you@example.com"
                    type="email"
                    value={form.email}
                  />
                </label>
                <p className="text-xs leading-5 text-muted">
                  For privacy, StitchBook shows the same confirmation whether or not an account exists.
                </p>
                {error ? <div role="alert" className="auth-message auth-message-error">{error}</div> : null}
                <button className="min-h-12 w-full rounded-xl bg-brass px-5 py-3 font-semibold text-white transition hover:bg-midnight disabled:opacity-60" disabled={loading} type="submit">
                  {loading ? 'Sending…' : 'Send verification code'}
                </button>
              </form>
            ) : null}

            {step === 'code' ? (
              <form className="auth-form mt-7" onSubmit={continueCode}>
                <div className="rounded-2xl border border-border bg-bone p-4">
                  <div className="flex items-start gap-3">
                    <MailCheck className="mt-0.5 shrink-0 text-brass" size={20} />
                    <div>
                      <p className="text-sm font-semibold">Check your email</p>
                      <p className="mt-1 text-xs leading-5 text-muted">The code expires shortly. Check spam if it is not in your inbox.</p>
                    </div>
                  </div>
                </div>
                <label className="form-label">
                  <span>Verification code</span>
                  <input
                    autoComplete="one-time-code"
                    className="form-input text-center text-2xl font-semibold tracking-[0.3em]"
                    inputMode="numeric"
                    maxLength={6}
                    onChange={set('otp')}
                    placeholder="123456"
                    value={form.otp}
                  />
                </label>
                {error ? <div role="alert" className="auth-message auth-message-error">{error}</div> : null}
                <button className="min-h-12 w-full rounded-xl bg-brass px-5 py-3 font-semibold text-white" type="submit">Continue</button>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button className="min-h-11 rounded-xl px-4 text-sm font-semibold text-brass transition hover:bg-mist disabled:opacity-60" disabled={loading} onClick={sendCode} type="button">
                    {loading ? 'Sending…' : 'Send code again'}
                  </button>
                  <button className="min-h-11 rounded-xl px-4 text-sm font-semibold text-muted transition hover:bg-bone" onClick={() => { setStep('email'); setForm((prev) => ({ ...prev, otp: '' })); setError(''); }} type="button">
                    Use another email
                  </button>
                </div>
              </form>
            ) : null}

            {step === 'password' ? (
              <form className="auth-form mt-7" onSubmit={resetPassword}>
                <div className="rounded-xl bg-mist px-4 py-3 text-sm font-semibold text-brass">
                  Choose a password with at least 8 characters, one letter and one number.
                </div>
                <label className="form-label">
                  <span>New password</span>
                  <div className="form-input-group">
                    <input
                      autoComplete="new-password"
                      className="form-input min-w-0 flex-1"
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
                <label className="form-label">
                  <span>Confirm new password</span>
                  <input
                    autoComplete="new-password"
                    className="form-input"
                    onChange={set('confirm')}
                    placeholder="Repeat your password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirm}
                  />
                </label>
                {error ? <div role="alert" className="auth-message auth-message-error">{error}</div> : null}
                <button className="min-h-12 w-full rounded-xl bg-brass px-5 py-3 font-semibold text-white transition hover:bg-midnight disabled:opacity-60" disabled={loading} type="submit">
                  {loading ? 'Resetting…' : 'Reset password'}
                </button>
                <button className="min-h-11 w-full rounded-xl px-4 text-sm font-semibold text-muted transition hover:bg-bone" onClick={() => { setStep('code'); setError(''); }} type="button">
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
