import { AlertCircle, CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getRazorpayCheckoutSession, verifyRazorpayOrderPayment } from '../api/paymentApi.js';
import Button from '../components/Button.jsx';
import { getPaymentDetails, toPaise } from '../utils/queryParams.js';
import { openRazorpayCheckout } from '../utils/razorpay.js';

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
  const razorpayKeyId = details.keyId;

  const canPay = Boolean(requestDetails.checkoutToken && razorpayKeyId && details.orderId && details.amount > 0);

  useEffect(() => {
    const loadCheckoutSession = async () => {
      if (!requestDetails.checkoutToken) {
        setStatus('error');
        setMessage('This payment link is not valid. Please open payment again from the StitchBook app.');
        return;
      }

      setStatus('loading');
      setMessage('Loading secure payment details.');

      try {
        const response = await getRazorpayCheckoutSession(requestDetails.checkoutToken);
        const session = response.data;

        setCheckoutDetails({
          checkoutToken: requestDetails.checkoutToken,
          orderId: session.orderId,
          orderNumber: session.orderNumber,
          razorpayOrderId: session.razorpayOrderId,
          amount: Number(session.amount || 0),
          currency: session.currency || 'INR',
          keyId: session.keyId,
          name: session.customer?.name || '',
          email: session.customer?.email || '',
          phone: session.customer?.phone || '',
          description: 'StitchBook tailoring order payment',
        });
        setStatus('idle');
        setMessage('');
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || error.message || 'Payment link expired or invalid.');
      }
    };

    loadCheckoutSession();
  }, [requestDetails.checkoutToken]);

  const handleSuccess = useCallback(
    async (response) => {
      setStatus('confirming');
      setMessage('Recording your payment with StitchBook.');

      const razorpayOrderId = response.razorpay_order_id || details.razorpayOrderId || '';
      const razorpayPaymentId = response.razorpay_payment_id || '';
      const razorpaySignature = response.razorpay_signature || '';

      try {
        const paymentResult = await verifyRazorpayOrderPayment({
          checkoutToken: details.checkoutToken,
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        });

        const recordedPaymentId = paymentResult?.data?.payment?.id || '';
        navigate(`/payment-success?orderId=${encodeURIComponent(details.orderId)}&paymentId=${encodeURIComponent(razorpayPaymentId)}&recordedPaymentId=${encodeURIComponent(recordedPaymentId)}`, {
          replace: true,
        });
      } catch (error) {
        const reason = error.response?.data?.message || error.message || 'Payment captured, but StitchBook could not record it.';
        navigate(`/payment-failure?orderId=${encodeURIComponent(details.orderId)}&reason=${encodeURIComponent(reason)}`, {
          replace: true,
        });
      }
    },
    [details, navigate]
  );

  const startPayment = useCallback(async () => {
    if (!canPay) {
      setStatus('error');
      setMessage('Payment details are missing. Please open payment again from the StitchBook app.');
      return;
    }

    setStatus('loading');
    setMessage('Opening secure Razorpay checkout.');

    const options = {
      key: razorpayKeyId,
      amount: toPaise(details.amount),
      currency: details.currency,
      name: 'StitchBook',
      description: details.description,
      order_id: details.razorpayOrderId || undefined,
      prefill: {
        name: details.name,
        email: details.email,
        contact: details.phone,
      },
      notes: {
        stitch_order_id: details.orderId,
      },
      theme: {
        color: '#11100e',
      },
      handler: handleSuccess,
      modal: {
        ondismiss: () => {
          setStatus('idle');
          setMessage('Payment was closed before completion.');
        },
      },
    };

    try {
      const razorpay = await openRazorpayCheckout(options);

      razorpay.on('payment.failed', (response) => {
        const reason = response.error?.description || 'Payment failed. Please try again.';
        navigate(`/payment-failure?orderId=${encodeURIComponent(details.orderId)}&reason=${encodeURIComponent(reason)}`, {
          replace: true,
        });
      });

      setStatus('opened');
      setMessage('Complete the payment in the Razorpay popup.');
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  }, [canPay, details, handleSuccess, navigate, razorpayKeyId]);

  useEffect(() => {
    if (!hasAutoOpened.current && canPay && status === 'idle') {
      hasAutoOpened.current = true;
      startPayment();
    }
  }, [canPay, startPayment, status]);

  return (
    <main className="min-h-screen bg-bone px-4 py-8 text-ink sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="w-full rounded-lg border border-ink/10 bg-white p-5 shadow-soft sm:p-6 md:p-8"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div className="grid gap-8 md:grid-cols-[1fr_0.9fr] md:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brass text-white">
                <CreditCard size={22} />
              </div>
              <h1 className="text-balance mt-6 font-serif text-4xl font-semibold leading-[0.95] sm:text-5xl md:text-6xl">
                Secure StitchBook payment
              </h1>
              <p className="mt-4 text-sm leading-6 text-ink/65">
                Pay safely using Razorpay. This page opens from the StitchBook app.
              </p>

              <div className="mt-7 flex items-start gap-3 rounded-lg border border-ink/10 bg-bone p-4">
                {status === 'confirming' || status === 'loading' ? (
                  <Loader2 className="mt-0.5 animate-spin text-brass" size={19} />
                ) : status === 'error' ? (
                  <AlertCircle className="mt-0.5 text-clay" size={19} />
                ) : (
                  <CheckCircle2 className="mt-0.5 text-sage" size={19} />
                )}
                <p className="text-sm leading-6 text-ink/70">
                  {message || 'The payment window will open automatically when the order details are correct.'}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-ink/10 bg-bone p-5 text-ink">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-brass">Order summary</p>
              <div className="mt-6 grid gap-4 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-ink/55">Order ID</span>
                  <span className="font-semibold">{details.orderNumber || details.orderId || 'Missing'}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-ink/55">Customer</span>
                  <span className="text-right font-semibold">{details.name || 'Guest'}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-ink/10 pb-3">
                  <span className="text-ink/55">Contact</span>
                  <span className="text-right font-semibold">{details.phone || details.email || 'Not provided'}</span>
                </div>
                <div className="flex items-end justify-between gap-4 pt-2">
                  <span className="text-ink/55">Payable</span>
                  <span className="font-serif text-3xl font-semibold sm:text-4xl">₹{Number(details.amount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {!razorpayKeyId && (
                <p className="mt-5 rounded-lg border border-clay/30 bg-clay/15 p-3 text-xs leading-5 text-ink/75">
                  Payment key is missing. Please open payment again from the StitchBook app.
                </p>
              )}

              <Button className="mt-7 w-full" disabled={status === 'loading' || status === 'confirming'} onClick={startPayment} variant="brass">
                {status === 'loading' || status === 'confirming' ? 'Please wait' : 'Pay with Razorpay'}
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

export default CheckoutPage;
