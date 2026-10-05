import { AlertTriangle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import api from '../api/client.js';
import { clearAuthSession, getAuthToken, getSavedUser } from '../api/authApi.js';

export default function DeleteAccountForm() {
  const [proof, setProof] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [completed, setCompleted] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      let token = sessionStorage.getItem('stitchbook_deletion_token');

      if (!token) {
        const result = await api.post('/user/delete-account', { password: proof, confirmation });
        token = result.data.data.deletionToken;
        sessionStorage.setItem('stitchbook_deletion_token', token);
        sessionStorage.setItem('stitchbook_deletion_user', String(getSavedUser()?.id));
      }

      for (let count = 0; count < 30; count += 1) {
        setMessage('Deletion is in progress. Keep this page open.');
        const result = await api.post('/user/delete-account', {}, { headers: { 'x-deletion-token': token } });

        if (result.data.data.complete) {
          sessionStorage.removeItem('stitchbook_deletion_token');
          sessionStorage.removeItem('stitchbook_deletion_user');
          clearAuthSession();
          setCompleted(true);
          setMessage('Your account and owned shop data have been deleted.');
          return;
        }
      }

      setMessage('Cleanup is still in progress. Continue to resume safely.');
    } catch (error) {
      if ([400, 401].includes(error.response?.status)) {
        sessionStorage.removeItem('stitchbook_deletion_token');
        setProof('');
      }
      setMessage(error.response?.data?.message || 'Could not finish deletion. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (completed) {
    return <p role="status" className="mt-8 rounded-2xl border border-border bg-bone p-5 text-sm leading-6">{message}</p>;
  }

  if (!getAuthToken() && !sessionStorage.getItem('stitchbook_deletion_token')) {
    return (
      <div className="mt-8 rounded-2xl border border-border bg-bone p-5">
        <p className="text-sm leading-6 text-muted">Sign in first if you want to use the in-app deletion flow.</p>
        <a className="mt-2 inline-flex min-h-10 items-center font-semibold text-brass underline" href="/login?redirect=%2Fdelete-account">Sign in to delete your account</a>
      </div>
    );
  }

  return (
    <section className="mt-9 border-t border-border pt-8">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-rosewood">
          <AlertTriangle size={19} />
        </span>
        <div>
          <h2 className="text-xl font-semibold text-ink">Permanently delete account</h2>
          <p className="mt-2 leading-7 text-muted">Your profile and owned shop data will be permanently removed. Confirm with your password. Staff deletion preserves the shop’s business records.</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-bone p-5">
        <label className="form-label" htmlFor="deletion-password">
          <span>1. Enter your password</span>
          <input
            className="form-input"
            id="deletion-password"
            type="password"
            value={proof}
            onChange={(event) => setProof(event.target.value)}
            autoComplete="current-password"
            disabled={busy}
          />
        </label>

        <label className="form-label mt-6" htmlFor="deletion-confirmation">
          <span>2. Type DELETE to confirm</span>
          <input
            className="form-input"
            id="deletion-confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete="off"
            disabled={busy}
            placeholder="DELETE"
          />
        </label>

        {message ? <p className="mt-4 rounded-xl bg-white p-3 text-sm leading-6 text-muted" role="status">{message}</p> : null}

        <button
          className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-rosewood px-5 font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={busy || confirmation !== 'DELETE' || (!proof && !sessionStorage.getItem('stitchbook_deletion_token'))}
          onClick={run}
          type="button"
        >
          <Trash2 size={17} />
          {busy ? 'Deleting…' : 'Delete account'}
        </button>
      </div>
    </section>
  );
}
