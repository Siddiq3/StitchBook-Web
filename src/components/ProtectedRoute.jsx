import { useEffect, useState } from 'react';
import { restoreWebSession } from '../api/client.js';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken, getSavedUser } from '../api/authApi.js';
import { Loader2, WifiOff } from 'lucide-react';
import PageShell from './PageShell.jsx';
import Button from './Button.jsx';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
  const loginUrl = `/login?redirect=${redirect}`;
  const [status, setStatus] = useState(() => getAuthToken() || !getSavedUser() ? 'ready' : 'loading');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (getAuthToken()) return;
    let mounted = true;
    restoreWebSession().then(() => { if (mounted) setStatus('ready'); }).catch(error => {
      if (mounted) setStatus([401, 403].includes(error.response?.status) ? 'ready' : 'error');
    });
    return () => { mounted = false; };
  }, [attempt]);
  if (status === 'loading' || status === 'error') return (
    <PageShell>
      <section className="mx-auto flex min-h-[65vh] max-w-xl items-center px-4 py-16 sm:px-6">
        <div className="surface-card w-full rounded-3xl bg-white p-8 text-center sm:p-10" role={status === 'error' ? 'alert' : 'status'}>
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-linen text-brass">
            {status === 'loading' ? <Loader2 className="animate-spin" size={28} /> : <WifiOff size={28} />}
          </div>
          <p className="eyebrow">YOUR STITCHBOOK ACCOUNT</p>
          <h1 className="mt-4 text-3xl font-semibold">{status === 'loading' ? 'Welcome back' : 'Let’s reconnect'}</h1>
          <p className="mt-4 text-sm leading-7 text-muted">{status === 'loading' ? 'We’re securely restoring your session. This will only take a moment.' : 'We couldn’t reach your account. Check your connection and try again, or sign in to continue.'}</p>
          {status === 'error' && <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => { setStatus('loading'); setAttempt(value => value + 1); }}>Try again</Button>
            <Button to={loginUrl} variant="secondary">Sign in</Button>
          </div>}
          <Button className="mt-5" to="/" variant="ghost">Back to home</Button>
        </div>
      </section>
    </PageShell>
  );

  if (!getAuthToken()) {
    return <Navigate replace to={loginUrl} />;
  }

  return children;
}

export default ProtectedRoute;
