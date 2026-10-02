import { AlertCircle, CheckCircle2, CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getCashfreeCheckoutSession, verifyCashfreeOrderPayment } from '../api/paymentApi.js';
import Button from '../components/Button.jsx';
import Logo from '../components/Logo.jsx';
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

  const handleSuccess = useCallback(async () => {
    setStatus('confirming');
    setMessage('Confirming your payment.');

    try {
      const paymentResult = await verifyCashfreeOrderPayment({
        checkoutToken: details.checkoutToken,
        cashfree_order_id: details.cashfreeOrderId,
      });

      const recordedPaymentId = paymentResult?.data?.payment?.id || '';
      navigate('/payment-success?orderId=' + encodeURIComponent(details.orderId) + '&paymentId=' + encodeURIComponent(paymentResult?.data?.cashfreePaymentId || '') + '&recordedPaymentId=' + encodeURIComponent(recordedPaymentId), {
        replace: true,
      });
    } catch (error) {
      const reason = error.response?.data?.message || error.message || 'Payment received, but we could not update the order yet.';
      setStatus('error');
      setMessage(reason);
    }
  }, [details, navigate]);

  const startPayment = useCallback(async () => {
    if (!canPay) {
      setStatus('error');
      setMessage('Payment details are incomplete. Please start the payment again.');
      return;
    }

    setStatus('loading');
    setMessage('Opening secure payment.');

    try {
      const result = await openCashfreeCheckout({ paymentSessionId, mode: details.mode });
      if (result?.redirect) return;
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
    <main className="brand-soft min-h-screen px-4 py-6 text-ink sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between gap-4">
          <Logo />
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-sage shadow-sm">
            <ShieldCheck size={15} />
            Secure checkout
          </span>
        </header>

        <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center py-8">
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className="surface-card w-full overflow-hidden rounded-3xl"
            initial={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="grid md:grid-cols-[1.05fr_.95fr]">
              <div className="p-6 sm:p-8 md:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white">
                  <CreditCard size={22} />
                </div>
                <p className="section-eyebrow mt-7">Order payment</p>
                <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-5xl">
                  A clear final check before you pay.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-muted sm:text-base">
                  Review the order details, then continue to Cashfree to complete payment securely.
                </p>

                <div
                  role={status === 'error' ? 'alert' : 'status'}
                  aria-live="polite"
                  className={'mt-7 flex items-start gap-3 rounded-2xl border p-4 ' + (status === 'error' ? 'border-rosewood/20 bg-red-50 text-rosewood' : 'border-border bg-bone text-muted')}
                >
                  {status === 'confirming' || status === 'loading' ? (
                    <Loader2 className="mt-0.5 shrink-0 animate-spin text-brass" size={19} />
                  ) : status === 'error' ? (
                    <AlertCircle className="mt-0.5 shrink-0" size={19} />
                  ) : (
                    <CheckCircle2 className="mt-0.5 shrink-0 text-sage" size={19} />
                  )}
                  <p className="text-sm leading-6">
                    {message || 'Your payment details are ready to review.'}
                  </p>
                </div>
              </div>

              <div className="border-t border-border bg-bone p-6 sm:p-8 md:border-l md:border-t-0 md:p-10">
                <p className="section-eyebrow">Order summary</p>
                <div className="mt-6 grid gap-4 text-sm">
                  <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                    <span className="text-muted">Order</span>
                    <span className="min-w-0 break-all text-right font-semibold text-ink">{details.orderNumber || details.orderId || 'Missing'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                    <span className="text-muted">Customer</span>
                    <span className="text-right font-semibold text-ink">{details.name || 'Guest'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                    <span className="text-muted">Contact</span>
                    <span className="max-w-[60%] break-words text-right font-semibold text-ink">{details.phone || details.email || 'Not provided'}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-sm text-muted">Payable now</span>
                    <p className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-ink sm:text-5xl">₹{Number(details.amount || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {!paymentSessionId && status !== 'loading' ? (
                  <p className="mt-5 rounded-2xl border border-clay/20 bg-amber-50 p-3 text-xs leading-5 text-clay">
                    Payment details are incomplete. Please start again from the order.
                  </p>
                ) : null}

                {status === 'error' && checkoutDetails ? (
                  <Button className="mt-5 w-full" onClick={handleSuccess} variant="secondary">Check payment status</Button>
                ) : null}

                <Button className="mt-6 w-full" disabled={!canPay || status === 'loading' || status === 'confirming'} onClick={startPayment} variant="primary">
                  {status === 'loading' || status === 'confirming' ? <Loader2 className="animate-spin" size={17} /> : <ShieldCheck size={17} />}
                  {status === 'loading' || status === 'confirming' ? 'Please wait' : 'Continue to payment'}
                </Button>
                <p className="mt-3 text-center text-xs leading-5 text-muted">Payment is processed by Cashfree. StitchBook records the verified result.</p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;
