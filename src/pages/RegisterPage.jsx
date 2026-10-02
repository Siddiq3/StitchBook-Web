import { useState } from 'react';
import { Check, Eye, EyeOff, Scissors, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LogoMark } from '../components/Logo.jsx';
import { registerWithPassword } from '../api/authApi.js';

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
const validPhone = (value) => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length === 10 || (digits.length === 12 && digits.startsWith('91'));
};
const validPassword = (value) => String(value || '').length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setError('');
  };

  const submit = async (event) => {
    event.preventDefault();
    if (form.name.trim().length < 2) { setError('Enter your name.'); return; }
    if (!validEmail(form.email)) { setError('Enter a valid email address.'); return; }
    if (!validPhone(form.phone)) { setError('Enter a valid 10-digit mobile number.'); return; }
    if (!validPassword(form.password)) { setError('Password must be at least 8 characters with a letter and a number.'); return; }
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }

    setLoading(true);
    setError('');
    try {
      await registerWithPassword({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
      }, { name: navigator.userAgent });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="brand-soft min-h-screen text-ink">
      <section className="auth-layout">
        <form className="auth-card surface-card" onSubmit={submit}>
          <div className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="font-serif text-2xl leading-none">StitchBook</p>
              <p className="mt-1 text-sm text-muted">Create your shop account</p>
            </div>
          </div>

          <h1 className="auth-title">Start with one secure account.</h1>
          <p className="auth-subtitle">
            Use the same email, mobile number and password on StitchBook mobile and web.
          </p>

          <div className="auth-form">
            <label className="form-label">
              <span>Your name</span>
              <input className="form-input" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Full name" />
            </label>
            <label className="form-label">
              <span>Email address</span>
              <input className="form-input" autoComplete="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
            </label>
            <label className="form-label">
              <span>Mobile number</span>
              <input className="form-input" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set('phone')} placeholder="98765 43210" />
            </label>
            <label className="form-label">
              <span>Password</span>
              <div className="form-input-group">
                <input className="form-input min-w-0 flex-1" autoComplete="new-password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Create a password" />
                <button
                  type="button"
                  className="rounded-lg p-2 text-muted transition hover:bg-bone hover:text-ink"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted">Use at least 8 characters with a letter and a number.</p>
            </label>
            <label className="form-label">
              <span>Confirm password</span>
              <input className="form-input" autoComplete="new-password" type={showPassword ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')} placeholder="Re-enter your password" />
            </label>
          </div>

          {error ? <div role="alert" className="auth-message auth-message-error mt-5">{error}</div> : null}

          <button
            className="mt-6 min-h-12 w-full rounded-xl bg-brass px-5 py-3 font-semibold text-white shadow-[0_8px_22px_rgba(47,91,211,.20)] transition hover:bg-midnight disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account? <Link className="font-semibold text-brass hover:underline" to="/login">Sign in</Link>
          </p>
        </form>

        <aside className="auth-story brand-solid">
          <div className="auth-story-content">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
              <ShieldCheck size={17} />
              Secure account setup
            </div>

            <div className="max-w-lg">
              <Scissors className="text-white/65" size={30} strokeWidth={1.5} />
              <h2 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
                Your shop details, ready when the next customer walks in.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-white/72">
                Build one reliable workspace for customers, measurements, orders, payments and your team.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-white/78">
              {['One account for mobile and web', 'Plans that grow with your staff', 'Your business records stay connected'].map((item) => (
                <div className="flex items-center gap-2" key={item}><Check size={16} className="text-[#7AD7B3]" />{item}</div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
