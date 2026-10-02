import { AlertTriangle, CheckCircle2, Home, ReceiptText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Logo from '../components/Logo.jsx';

function PaymentResultPage({ status }) {
  const [searchParams] = useSearchParams();
  const isSuccess = status === 'success';
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');
  const recordedPaymentId = searchParams.get('recordedPaymentId');
  const reason = searchParams.get('reason');

  return (
    <main className="brand-soft min-h-screen px-4 py-6 text-ink sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <Logo />
        <div className="flex min-h-[calc(100vh-6.5rem)] items-center justify-center py-8">
          <motion.section
            role={isSuccess ? 'status' : 'alert'}
            aria-live="polite"
            animate={{ opacity: 1, y: 0 }}
            className="surface-card w-full max-w-2xl rounded-3xl p-6 text-center sm:p-9"
            initial={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className={'mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ' + (isSuccess ? 'bg-emerald-50 text-sage' : 'bg-red-50 text-rosewood')}>
              {isSuccess ? <CheckCircle2 size={31} /> : <AlertTriangle size={31} />}
            </div>
            <p className="section-eyebrow mt-6">{isSuccess ? 'Payment confirmed' : 'Payment incomplete'}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.06] tracking-[-0.045em]">
              {isSuccess ? 'Payment successful.' : 'Payment was not completed.'}
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted sm:text-base">
              {isSuccess
                ? 'Your payment was verified and recorded successfully.'
                : reason || 'Please return to the order and try again when you are ready.'}
            </p>

            <div className="mx-auto mt-7 max-w-lg rounded-2xl border border-border bg-bone p-4 text-left text-sm">
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted">Order ID</span>
                <span className="min-w-0 break-all text-right font-semibold">{orderId || 'Not available'}</span>
              </div>
              {paymentId ? (
                <div className="mt-3 flex items-start justify-between gap-4 border-t border-border pt-3">
                  <span className="text-muted">Payment ID</span>
                  <span className="min-w-0 break-all text-right font-semibold">{paymentId}</span>
                </div>
              ) : null}
              {recordedPaymentId ? (
                <div className="mt-3 flex items-start justify-between gap-4 border-t border-border pt-3">
                  <span className="text-muted">Receipt record</span>
                  <span className="min-w-0 break-all text-right font-semibold">{recordedPaymentId}</span>
                </div>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button to="/" variant="primary"><Home size={17} /> Go to home</Button>
              <Link className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-muted transition hover:bg-bone hover:text-ink" to="/about">
                <ReceiptText size={17} />
                About StitchBook
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

export default PaymentResultPage;
