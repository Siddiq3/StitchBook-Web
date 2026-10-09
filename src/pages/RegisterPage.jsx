import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Check, CheckCircle2, Circle, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { registerWithPassword } from '../api/authApi.js';
import '../styles/landing.css';

const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
const validPhone = (value) => String(value || '').replace(/\D/g, '').length === 10;
const checks = (value) => ({ length: value.length >= 8, letter: /[A-Za-z]/.test(value), number: /\d/.test(value) });

// One question per screen, the same flow as the app: email, name, mobile, password.
const STEPS = [
  { key: 'email', title: "What's your email?", sub: "You'll use it to sign in and to reset your password." },
  { key: 'name', title: 'What should we call you?', sub: "The shop owner's name, as staff and customers know you." },
  { key: 'phone', title: 'Your mobile number', sub: 'You can also sign in with this number.' },
  { key: 'password', title: 'Create a password', sub: "It keeps your shop's orders and payments safe." },
];
const STITCHES = 24;

// Progress drawn as a seam: finished steps sewn in solid stitches, a needle at the current one
function StitchProgress({ step, total }) {
  const reduce = useReducedMotion();
  const sewn = Math.round(((step + 1) / total) * STITCHES);
  return (
    <div className="su-seam" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1} aria-label={`Step ${step + 1} of ${total}`}>
      {Array.from({ length: STITCHES }).map((_, i) => (
        <motion.span
          key={i}
          className="su-stitch"
          initial={false}
          animate={{ backgroundColor: i < sewn ? 'var(--sb-brand)' : '#CFE3FA', scaleY: i < sewn ? 1.4 : 1 }}
          transition={{ duration: reduce ? 0 : 0.25, delay: reduce ? 0 : Math.max(0, i - sewn + 6) * 0.02 }}
        />
      ))}
      <motion.span
        className="su-needle"
        aria-hidden="true"
        initial={false}
        animate={{ left: `calc(${(sewn / STITCHES) * 100}% - 8px)` }}
        transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 3 6 15l-2 6 6-2L22 7" /><path d="M16 5l3 3" /></svg>
      </motion.span>
    </div>
  );
}

// The account being made, filling in as questions are answered
function AccountCard({ rows, current }) {
  return (
    <div className="su-card" aria-label="Your StitchBook account">
      <div className="su-card-head"><span className="su-card-icon"><User size={15} /></span>Your StitchBook account</div>
      {rows.map((row, index) => {
        const Icon = row.icon;
        const active = index === current;
        return (
          <div key={row.key} className={`su-row ${active ? 'is-active' : ''}`}>
            <Icon size={16} aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              {row.value ? (
                <motion.span key={row.value} className={`su-value ${row.big ? 'is-big' : ''}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>{row.value}</motion.span>
              ) : active ? (
                <motion.span key="ph" className="su-placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{row.placeholder}</motion.span>
              ) : (
                <span key="bar" className={`su-bar ${row.big ? 'is-big' : ''}`} />
              )}
            </AnimatePresence>
            {row.value && !active ? (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 380, damping: 18 }}>
                <CheckCircle2 size={18} className="su-tick" />
              </motion.span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, error, hint, prefix, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <span className={`su-input ${error ? 'has-error' : ''}`}>
        {prefix ? <span className="su-prefix">{prefix}</span> : null}
        {children}
      </span>
      <AnimatePresence initial={false}>
        {error ? (
          <motion.span key="e" role="alert" className="mt-2 block text-sm font-semibold text-danger" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{error}</motion.span>
        ) : hint ? <span className="mt-2 block text-sm text-success">{hint}</span> : null}
      </AnimatePresence>
    </label>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState({ email: '', name: '', phone: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, [step]);

  const set = (key) => (event) => {
    const value = key === 'phone' ? event.target.value.replace(/\D/g, '').slice(-10) : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setError('');
  };
  const go = (next) => { setDirection(next > step ? 1 : -1); setErrors({}); setError(''); setStep(next); };

  const stepErrors = (index) => {
    const e = {};
    if (index === 0 && !validEmail(form.email)) e.email = 'Enter a valid email address.';
    if (index === 1 && form.name.trim().length < 2) e.name = 'Enter your name.';
    if (index === 2 && !validPhone(form.phone)) e.phone = 'Enter a valid 10-digit mobile number.';
    if (index === 3) {
      const c = checks(form.password);
      if (!c.length || !c.letter || !c.number) e.password = 'Password must be at least 8 characters with a letter and a number.';
      else if (form.password !== form.confirm) e.confirm = "Passwords don't match.";
    }
    return e;
  };

  const submit = async (event) => {
    event.preventDefault();
    const invalid = stepErrors(step);
    setErrors(invalid);
    if (Object.keys(invalid).length) return;
    if (step < STEPS.length - 1) { go(step + 1); return; }
    setLoading(true);
    try {
      await registerWithPassword({ name: form.name.trim(), email: form.email.trim().toLowerCase(), phone: form.phone, password: form.password }, { name: navigator.userAgent });
      navigate('/dashboard', { replace: true, state: { accountCreated: true } });
    } catch (err) {
      const message = err.response?.data?.message || err.message || '';
      if (/exists|already/i.test(message)) {
        setDirection(-1); setStep(0);
        setErrors({ email: 'An account already exists with this email or mobile number. Sign in instead.' });
      } else setError(message || 'Could not create your account.');
    } finally { setLoading(false); }
  };

  const done = (index, value) => (index < step ? value : '');
  const rows = [
    { key: 'email', icon: Mail, placeholder: 'Email address', value: done(0, form.email.trim().toLowerCase()) },
    { key: 'name', icon: User, placeholder: 'Your name', value: done(1, form.name.trim()), big: true },
    { key: 'phone', icon: Phone, placeholder: 'Mobile number', value: done(2, form.phone && `+91 ${form.phone.slice(0, 5)} ${form.phone.slice(5)}`) },
    { key: 'password', icon: Lock, placeholder: 'Password', value: done(3, '••••••••') },
  ];
  const current = STEPS[step];
  const c = checks(form.password);
  const slide = reduce ? {} : {
    initial: { opacity: 0, x: 32 * direction },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -32 * direction },
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  };
  const inputClass = 'min-w-0 flex-1 bg-transparent px-4 py-3.5 outline-none';

  return (
    <main className="su-page min-h-screen text-ink">
      <div className="mx-auto grid min-h-screen max-w-5xl gap-10 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
        <section className="flex flex-col">
          <div className="flex items-center gap-3">
            {step > 0 ? (
              <button type="button" onClick={() => go(step - 1)} className="su-back" aria-label="Previous step"><ArrowLeft size={20} /></button>
            ) : (
              <Link to="/login" className="su-back" aria-label="Back to sign in"><ArrowLeft size={20} /></Link>
            )}
            <div className="flex-1"><Logo /></div>
            <span className="text-sm font-semibold text-muted">{step + 1} of {STEPS.length}</span>
          </div>
          <div className="mt-5"><StitchProgress step={step} total={STEPS.length} /></div>

          <form onSubmit={submit} noValidate className="mt-10 flex flex-1 flex-col">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={step} {...slide}>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{current.title}</h1>
                <p className="mt-2 text-muted">{current.sub}</p>
                <div className="mt-8 space-y-4">
                  {step === 0 && <Field label="Email address" error={errors.email}><input ref={inputRef} className={inputClass} type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@example.com" /></Field>}
                  {step === 1 && <Field label="Your name" error={errors.name}><input ref={inputRef} className={inputClass} autoComplete="name" value={form.name} onChange={set('name')} placeholder="Enter your name" /></Field>}
                  {step === 2 && <Field label="Mobile number" error={errors.phone} prefix="+91"><input ref={inputRef} className={inputClass} inputMode="numeric" autoComplete="tel-national" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile number" /></Field>}
                  {step === 3 && <>
                    <Field label="Password" error={errors.password}>
                      <input ref={inputRef} className={inputClass} type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={set('password')} placeholder="Create a password" />
                      <button type="button" className="mr-2 rounded-lg p-2 text-muted hover:bg-bone" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((v) => !v)}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>
                    </Field>
                    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm" aria-label="Password rules">
                      {[['length', 'At least 8 characters'], ['letter', 'A letter'], ['number', 'A number']].map(([key, label]) => (
                        <li key={key} className={`flex items-center gap-1.5 transition-colors ${c[key] ? 'text-success' : 'text-muted'}`}>
                          <motion.span initial={false} animate={{ scale: c[key] ? 1 : 0.85 }}>{c[key] ? <Check size={15} /> : <Circle size={13} />}</motion.span>{label}
                        </li>
                      ))}
                    </ul>
                    <Field label="Confirm password" error={errors.confirm} hint={form.confirm && form.confirm === form.password ? 'Passwords match' : ''}>
                      <input className={inputClass} type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={form.confirm} onChange={set('confirm')} placeholder="Re-enter your password" />
                    </Field>
                  </>}
                </div>
                {error ? <p role="alert" className="mt-4 rounded-xl bg-danger/10 p-3 text-sm font-semibold text-danger">{error}</p> : null}
              </motion.div>
            </AnimatePresence>

            <div className="mt-auto pt-10">
              <button className="su-primary" disabled={loading} type="submit">
                {loading ? 'Creating account…' : step === STEPS.length - 1 ? 'Create account' : 'Continue'}
              </button>
              <p className="mt-4 text-center text-sm text-muted">Already have an account? <Link className="font-semibold text-brand hover:underline" to="/login">Sign in</Link></p>
              {step === STEPS.length - 1 && <p className="mt-3 text-center text-xs text-muted">By creating an account, you agree to the <a className="font-semibold text-brand underline" href="/terms">Terms of service</a> and <a className="font-semibold text-brand underline" href="/privacy">Privacy policy</a>.</p>}
            </div>
          </form>
        </section>

        <aside className="hidden lg:block" aria-hidden="true">
          <AccountCard rows={rows} current={step} />
          <ol className="su-next">
            <li className={step < 4 ? 'is-now' : ''}><span>1</span>Create your account</li>
            <li><span>2</span>Get the app and sign in</li>
            <li><span>3</span>Set up your shop in the app</li>
          </ol>
        </aside>
      </div>
    </main>
  );
}
