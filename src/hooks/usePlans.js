import { useEffect, useState } from 'react';
import apiClient from '../api/client.js';
import { plans as planDetails } from '../data/plans.js';
import { applyPrices } from '../utils/planPrices.js';

let cached;
let pending;
const CACHE_MS = 60000;
async function loadPrices() {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.plans;
  if (!pending) {
    pending = (async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        // Public pricing must not trigger authentication or refresh requests.
        const base = apiClient.defaults.baseURL.replace(/\/$/, '');
        const response = await fetch(`${base}/subscription/plans`, { signal: controller.signal, credentials: 'omit' });
        if (!response.ok) throw new Error('Prices unavailable');
        const result = applyPrices(planDetails, (await response.json()).data);
        cached = { plans: result, at: Date.now() };
        return result;
      } finally {
        clearTimeout(timeout);
        pending = null;
      }
    })();
  }
  return pending;
}
export default function usePlans() {
  const [plans, setPlans] = useState(() => cached && Date.now() - cached.at < CACHE_MS ? cached.plans : planDetails);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    loadPrices().then(value => { if (active) setPlans(value); })
      .catch(() => { if (active) { setPlans(planDetails); setError('Prices could not be loaded. Please try again.'); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);
  return { plans, loading, error, retry: () => setAttempt(value => value + 1) };
}
