import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck, Smartphone } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { LogoMark } from '../components/Logo.jsx';
import { loginWithGoogle, loginWithMsg91Widget } from '../api/authApi.js';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const msg91WidgetId = import.meta.env.VITE_MSG91_WIDGET_ID;
const msg91TokenAuth = import.meta.env.VITE_MSG91_WIDGET_TOKEN_AUTH;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve(existing);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.appendChild(script);
  });
}

function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const googleButtonRef = useRef(null);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const completeLogin = (result, label) => {
    setMessage(`${label} successful. Welcome ${result.user?.name || result.user?.phone || 'back'}.`);
    setError('');
    const redirectTo = searchParams.get('redirect');
    const isPublicUpgradeFlow = redirectTo?.startsWith('/upgrade/session/');

    if (redirectTo?.startsWith('/') && !isPublicUpgradeFlow) {
      setTimeout(() => navigate(redirectTo, { replace: true }), 400);
    }
  };

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return;

    loadScript('https://accounts.google.com/gsi/client')
      .then(() => {
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
          width: 320,
        });
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleMobileLogin = async () => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (cleanPhone.length < 10) {
      setError('Enter a valid mobile number.');
      return;
    }

    if (!msg91WidgetId || !msg91TokenAuth) {
      setError('MSG91 widget is not configured. Add VITE_MSG91_WIDGET_ID and VITE_MSG91_WIDGET_TOKEN_AUTH.');
      return;
    }

    try {
      setLoading('mobile');
      setError('');
      await loadScript('https://verify.msg91.com/otp-provider.js');

      if (typeof window.initSendOTP !== 'function') {
        throw new Error('MSG91 OTP widget did not initialize.');
      }

      window.initSendOTP({
        widgetId: msg91WidgetId,
        tokenAuth: msg91TokenAuth,
        identifier: cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`,
        exposeMethods: true,
        success: async (data) => {
          try {
            const accessToken = data?.message || data?.token || data?.accessToken;
            const result = await loginWithMsg91Widget(accessToken, {
              name: navigator.userAgent,
            });
            completeLogin(result, 'Mobile login');
          } catch (err) {
            setError(err.response?.data?.message || err.message || 'Mobile login failed');
          } finally {
            setLoading('');
          }
        },
        failure: (err) => {
          setError(err?.message || err?.type || 'MSG91 OTP verification failed');
          setLoading('');
        },
      });
    } catch (err) {
      setError(err.message || 'Could not open MSG91 OTP widget');
      setLoading('');
    }
  };

  return (
    <main className="min-h-screen bg-bone text-ink">
      <section className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <div className="mb-7 flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="font-serif text-3xl font-semibold leading-none">StitchBook</p>
              <p className="mt-1 text-sm font-semibold text-ink/55">Tailor shop manager</p>
            </div>
          </div>
          <h1 className="max-w-xl font-serif text-5xl font-semibold leading-tight sm:text-6xl">
            Sign in to manage your shop
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-ink/62">
            Use Google first for zero OTP cost. Mobile OTP stays available as a fallback for staff and shop owners.
          </p>
          <div className="mt-8 grid max-w-lg gap-3 sm:grid-cols-3">
            {['90-day trusted device', 'JWT refresh rotation', 'Redis sessions'].map((item) => (
              <div className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm" key={item}>
                <ShieldCheck className="mb-3 text-brass" size={19} />
                <p className="text-sm font-bold leading-5 text-ink/75">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-soft sm:p-7">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brass">Secure login</p>
            <h2 className="mt-3 text-2xl font-bold">Continue to StitchBook</h2>
            <p className="mt-2 text-sm leading-6 text-ink/58">No email passwords. No Firebase OTP dependency.</p>
          </div>

          <div className="mt-7">
            {googleClientId ? (
              <div ref={googleButtonRef} />
            ) : (
              <p className="rounded-md border border-ink/10 bg-ink/[0.03] px-3 py-2 text-sm font-medium text-ink/55">
                Google login is not configured.
              </p>
            )}
          </div>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-ink/10" />
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-ink/35">or</span>
            <div className="h-px flex-1 bg-ink/10" />
          </div>

          <div>
            <label className="text-sm font-bold text-ink/70" htmlFor="mobile">
              Continue with Mobile Number
            </label>
            <div className="mt-3 flex overflow-hidden rounded-lg border border-ink/12 bg-bone focus-within:ring-2 focus-within:ring-brass/35">
              <span className="inline-flex items-center border-r border-ink/10 px-4 text-sm font-bold text-ink/55">+91</span>
              <input
                className="min-h-12 flex-1 bg-transparent px-4 text-base font-semibold outline-none"
                id="mobile"
                inputMode="tel"
                maxLength={10}
                onChange={(event) => {
                  setPhone(event.target.value);
                  setError('');
                }}
                placeholder="9705116606"
                value={phone}
              />
            </div>
            <Button className="mt-4 w-full" disabled={loading === 'mobile'} onClick={handleMobileLogin} variant="brass">
              {loading === 'mobile' ? <Loader2 className="animate-spin" size={17} /> : <Smartphone size={17} />}
              Send WhatsApp/SMS OTP <ArrowRight size={17} />
            </Button>
          </div>

          {message ? (
            <div className="mt-5 flex items-start gap-3 rounded-lg border border-sage/20 bg-mist p-4 text-sm font-semibold text-ink">
              <CheckCircle2 className="mt-0.5 text-sage" size={18} />
              <span>{message}</span>
            </div>
          ) : null}

          {error ? (
            <div className="mt-5 rounded-lg border border-rosewood/20 bg-rosewood/10 p-4 text-sm font-semibold text-rosewood">
              {error}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
