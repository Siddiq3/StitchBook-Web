import { useEffect, useState } from 'react';
import { restoreWebSession } from '../api/client.js';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '../api/authApi.js';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState(getAuthToken() ? 'ready' : 'loading');
  useEffect(() => {
    if (getAuthToken()) return;
    let mounted = true;
    restoreWebSession().then(() => { if (mounted) setStatus('ready'); }).catch(error => {
      if (mounted) setStatus([401, 403].includes(error.response?.status) ? 'ready' : 'error');
    });
    return () => { mounted = false; };
  }, []);
  if (status === 'loading') return <main className="p-8" role="status">Restoring your account…</main>;
  if (status === 'error') return <main className="p-8"><h1>Could not restore your account</h1><p>Please check your connection.</p><button className="min-h-11 underline" onClick={() => window.location.reload()}>Try again</button></main>;

  if (!getAuthToken()) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate replace to={`/login?redirect=${redirect}`} />;
  }

  return children;
}

export default ProtectedRoute;
