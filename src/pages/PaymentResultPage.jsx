import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/Button.jsx';

function PaymentResultPage({ status }) {
  const [searchParams] = useSearchParams();
  const isSuccess = status === 'success';
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');
  const recordedPaymentId = searchParams.get('recordedPaymentId');
  const reason = searchParams.get('reason');

  return (
    <main className="flex min-h-screen items-center justify-center bg-bone px-4 py-8 text-ink sm:px-6 sm:py-10">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl rounded-lg border border-ink/10 bg-white p-5 text-center shadow-soft sm:p-8"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-lg ${isSuccess ? 'bg-sage text-white' : 'bg-clay text-white'}`}>
          {isSuccess ? <CheckCircle2 size={30} /> : <AlertTriangle size={30} />}
        </div>
        <h1 className="mt-7 font-serif text-4xl font-semibold leading-[0.95] sm:text-5xl">
          {isSuccess ? 'Payment successful' : 'Payment failed'}
        </h1>
        <p className="mt-4 text-sm leading-6 text-ink/65">
          {isSuccess
            ? 'Your payment was recorded successfully.'
            : reason || 'The payment was not completed. Please go back to the app and try again.'}
        </p>

        <div className="mt-7 rounded-lg bg-bone p-4 text-left text-sm text-ink">
          <div className="flex justify-between gap-4">
            <span className="text-ink/55">Order ID</span>
            <span className="font-semibold">{orderId || 'Not available'}</span>
          </div>
          {paymentId && (
            <div className="mt-3 flex justify-between gap-4">
              <span className="text-ink/55">Payment ID</span>
              <span className="font-semibold">{paymentId}</span>
            </div>
          )}
          {recordedPaymentId && (
            <div className="mt-3 flex justify-between gap-4">
              <span className="text-ink/55">Backend record</span>
              <span className="font-semibold">{recordedPaymentId}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/" variant="primary">Go to home</Button>
          <Link className="inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold text-ink/62 hover:text-ink" to="/about">
            About StitchBook
          </Link>
        </div>
      </motion.section>
    </main>
  );
}

export default PaymentResultPage;
