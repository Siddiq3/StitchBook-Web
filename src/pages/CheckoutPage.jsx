import { AlertCircle, CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getCashfreeCheckoutSession, verifyCashfreeOrderPayment } from '../api/paymentApi.js';
import Button from '../components/Button.jsx';
import { getPaymentDetails } from '../utils/queryParams.js';
import { openCashfreeCheckout } from '../utils/cashfree.js';

function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const hasAutoOpened = useRef(false);
  const requestDetails = useMemo(() => getPaymentDetails(searchParams, location.state || {}), [location.state, searchParams]);
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const details = checkoutDetails || requestDetails;
  const paymentSessionId = checkoutDetails?.paymentSessionId;

  const canPay = Boolean(requestDetails.checkoutToken && paymentSessionId && details.orderId && details.amount > 0);

  useEffect(() => {
    const loadCheckoutSession = async () => {
      if (!requestDetails.checkoutToken) {
        setStatus('error');
        setMessage('This payment link is no longer available. Please start the payment again.');
        return;
      }

      setStatus('loading');
      setMessage('Preparing your payment.');

      try {
        const response = await getCashfreeCheckoutSession(requestDetails.checkoutToken);
        const session = response.data;

        setCheckoutDetails({
          checkoutToken: requestDetails.checkoutToken,
          orderId: session.orderId,
          orderNumber: session.orderNumber,
          cashfreeOrderId: session.cashfreeOrderId,
          amount: Number(session.amount || 0),
          currency: session.currency || 'INR',
          paymentSessionId: session.paymentSessionId,
          mode: session.mode,
          name: session.customer?.name || '',
          email: session.customer?.email || '',
          phone: session.customer?.phone || '',
          description: 'StitchBook tailoring order payment',
        });
        setStatus('idle');
        setMessage('');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || error.message || 'This payment link has expired or is no longer available.');
      }
    };

    loadCheckoutSession();
  }, [requestDetails.checkoutToken]);

  const handleSuccess = useCallback(
    async () => {
      setStatus('confirming');
      setMessage('Confirming your payment.');

      try {
        const paymentResult = await verifyCashfreeOrderPayment({
          checkoutToken: details.checkoutToken,
          cashfree_order_id: details.cashfreeOrderId,
        });

        const recordedPaymentId = paymentResult?.data?.payment?.id || '';
        navigate(`/payment-success?orderId=${encodeURIComponent(details.orderId)}&paymentId=${encodeURIComponent(paymentResult?.data?.cashfreePaymentId || "")}&recordedPaymentId=${encodeURIComponent(recordedPaymentId)}`, {
          replace: true,
        });
      } catch (error) {
        const reason = error.response?.data?.message || error.message || 'Payment received, but we could not update the order yet.';
        setStatus('error');
        setMessage(reason);
      }
    },
    [details, navigate]
  );

  const startPayment = useCallback(async () => {
    if (!canPay) {
      setStatus('error');
      setMessage('Payment details are incomplete. Please start the payment again.');
      return;
    }

    setStatus('loading');
    setMessage('Opening payment window.');

    try {
      const result = await openCashfreeCheckout({ paymentSessionId, mode: details.mode });
      if (result?.redirect) return;
      // Cashfree modal completion is not proof of payment. Always ask the server.
      await handleSuccess();
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  }, [canPay, details.mode, handleSuccess, paymentSessionId]);

  useEffect(() => {
    if (!hasAutoOpened.current && checkoutDetails && searchParams.get('order_id') && status === 'idle') {
      hasAutoOpened.current = true;
      handleSuccess();
    }
  }, [checkoutDetails, searchParams, handleSuccess, status]);

  return (
    <main className="checkout-page min-h-screen bg-bone px-4 py-8 text-ink sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="surface-card w-full rounded-2xl border border-ink/10 bg-white p-5 sm:p-6 md:p-8"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="grid gap-8 md:grid-cols-[1fr_0.9fr] md:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brass text-white">
                <CreditCard size={22} />
              </div>
              <h1 className="text-balance mt-6 font-sans text-4xl font-semibold leading-tight sm:text-3xl md:text-4xl">
                StitchBook payment
              </h1>
              <p className="mt-4 text-sm leading-6 text-muted">
                Review the order amount and complete your payment safely.
              </p>

              <div role={status === "error" ? "alert" : "status"} aria-live="polite" className="mt-7 flex items-start gap-3 rounded-2xl border border-ink/10 bg-bone p-4">
                {status === 'confirming' || status === 'loading' ? (
                  <Loader2 className="mt-0.5 animate-spin text-brass" size={19} />
                ) : status === 'error' ? (
                  <AlertCircle className="mt-0.5 text-clay" size={19} />
                ) : (
                  <CheckCircle2 className="mt-0.5 text-sage" size={19} />
                )}
                <p className="text-sm leading-6 text-muted">
                  {message || 'Select Pay now to open secure Cashfree checkout.'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-bone p-5 text-ink">
              <p className="text-xs font-semibold uppercase tracking-wide text-brass">Order summary</p>
              <div className="mt-6 grid gap-4 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-muted">Order ID</span>
                  <span className="min-w-0 break-all text-right font-semibold">{details.orderNumber || details.orderId || 'Missing'}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-muted">Customer</span>
                  <span className="text-right font-semibold">{details.name || 'Guest'}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-muted">Contact</span>
                  <span className="text-right font-semibold">{details.phone || details.email || 'Not provided'}</span>
                </div>
                <div className="flex items-end justify-between gap-4 pt-2">
                  <span className="text-muted">Payable</span>
                  <span className="font-sans text-3xl font-semibold sm:text-4xl">₹{Number(details.amount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {!paymentSessionId && (
                <p className="mt-5 rounded-2xl border border-clay/30 bg-clay/15 p-3 text-xs leading-5 text-ink/75">
                  Payment details are incomplete. Please start again.
                </p>
              )}

              {status === 'error' && checkoutDetails && (
                <Button className="mt-5 w-full" onClick={handleSuccess} variant="secondary">Check payment status</Button>
              )}
              <Button className="mt-7 w-full" disabled={!canPay || status === 'loading' || status === 'confirming'} onClick={startPayment} variant="brass">
                {status === 'loading' || status === 'confirming' ? 'Please wait' : 'Pay now'}
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default CheckoutPage;
