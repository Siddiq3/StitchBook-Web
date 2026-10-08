import { motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronRight, MessageCircle, Plus, Ruler, ShieldCheck, Smartphone, Users } from 'lucide-react';
import Button from '../components/Button.jsx';
import PageShell from '../components/PageShell.jsx';
import { plans } from '../data/plans.js';
import '../styles/landing.css';

function validDownloadUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname !== 'example.com' ? url.href : null;
  } catch {
    return null;
  }
}
const appUrl = validDownloadUrl(import.meta.env.VITE_APP_DOWNLOAD_URL) || validDownloadUrl(import.meta.env.VITE_GOOGLE_PLAY_URL) || validDownloadUrl(import.meta.env.VITE_APP_STORE_URL);
const downloadUrl = appUrl || 'mailto:stitchbook3@gmail.com?subject=StitchBook%20app%20download';
const appCtaLabel = appUrl ? 'Get the app' : 'Request app access';

// Real screens from the app, captured from a demo shop (not mock-ups)
function Phone({ src, alt, className = '', eager = false }) {
  return (
    <figure className={`lp-phone ${className}`}>
      <img src={src} alt={alt} width="720" height="1600" loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </figure>
  );
}

const planHighlights = {
  basic: ['Owner only', 'Basic reports'],
  team: ['2 staff logins', 'Assign cutting and stitching', 'Staff work and earnings ledger', 'Full reports'],
  pro: ['5 staff logins', 'Everything in Team', 'Advanced reports', 'Priority support'],
};

const faqs = [
  ['What can I do with StitchBook?', 'The mobile app keeps customers, outfit measurements, orders, delivery dates, payments, invoices and staff assignments together. This website is where you sign in and manage your plan.'],
  ['How do I get started?', 'Get the StitchBook app and create your shop. New shops get a 10-day free trial. When you are ready, sign in here to choose and pay for a plan.'],
  ['Can my staff use StitchBook?', 'Yes. Team includes 2 staff logins and Pro includes 5. Staff see only the cutting and stitching assigned to them, and what they earned. Basic is owner-only.'],
  ['Which languages does the app support?', 'English, Telugu and Hindi. Each person can pick their language on their own phone.'],
  ['How do plan payments work?', 'Choose a plan on this website and pay through secure Cashfree checkout. Plans run for 30 days and do not renew automatically.'],
];

export default function LandingPage() {
  const reduceMotion = useReducedMotion();
  // Sections settle in once as they arrive; nothing replays on scroll back
  const reveal = reduceMotion ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  };
  const phoneIn = (delay) => reduceMotion ? {} : {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <PageShell>
      <div className="lp">
        <section className="lp-hero lp-container">
          <div className="lp-hero-copy">
            <h1>Manage your tailoring shop without missing any details.</h1>
            <p className="lp-lead">Orders, measurements, delivery dates, staff work and payments, together in one app built for Indian tailoring shops.</p>
            <div className="lp-actions">
              <Button href={downloadUrl}><Smartphone size={18} />{appCtaLabel}</Button>
              <Button href="#plans" variant="secondary">See plans</Button>
            </div>
          </div>
          <div className="lp-hero-visual">
            <motion.div className="lp-hero-back" {...phoneIn(0.12)}>
              <Phone src="/images/app/orders.webp" alt="StitchBook orders list with status, payment and delivery date for each order" eager />
            </motion.div>
            <motion.div className="lp-hero-front" {...phoneIn(0)}>
              <Phone src="/images/app/home.webp" alt="StitchBook home screen showing orders due today, overdue and in progress for Sri Lakshmi Tailors" eager />
            </motion.div>
          </div>
        </section>

        <section className="lp-container lp-split" id="features">
          <motion.div className="lp-split-copy" {...reveal}>
            <h2>Every order, from cutting to delivery.</h2>
            <p>See what is pending, cutting, stitching and ready, with the delivery date and what the customer still owes.</p>
            <ul className="lp-checks">
              <li><Check size={18} />Status for every garment, not just the order</li>
              <li><Check size={18} />Overdue and due-today work on the home screen</li>
              <li><Check size={18} />Send ready-for-pickup updates on WhatsApp</li>
            </ul>
          </motion.div>
          <motion.div className="lp-split-visual" {...reveal}>
            <Phone src="/images/app/orders.webp" alt="Orders list with filters for pending, cutting, stitching and ready" />
          </motion.div>
        </section>

        <section className="lp-container lp-split lp-split-reverse">
          <motion.div className="lp-split-copy" {...reveal}>
            <h2>Measurements ready for the next visit.</h2>
            <p>Save fit profiles for shirts, kurtas, blouses, lehengas, sherwanis and more, in inches. Reuse them on the next order instead of searching old notebooks.</p>
            <ul className="lp-checks">
              <li><Ruler size={18} />Outfit-specific measurement sheets</li>
              <li><Check size={18} />See which customers still need measuring</li>
            </ul>
          </motion.div>
          <motion.div className="lp-split-visual" {...reveal}>
            <Phone src="/images/app/measurements.webp" alt="Saved measurement profiles for each customer with chest, waist and length values" />
          </motion.div>
        </section>

        <motion.section className="lp-band" {...reveal}>
          <div className="lp-container lp-duo">
            <div>
              <Phone src="/images/app/staff.webp" alt="Staff list with each tailor's role, pay and work this month" className="lp-phone-sm" />
              <h3>Staff work and pay</h3>
              <p>Assign cutting and stitching to each tailor. Staff log in to see only their work, and you see what each one earned this month.</p>
            </div>
            <div>
              <Phone src="/images/app/customer.webp" alt="Customer profile with saved shirt measurements, call and WhatsApp buttons and order history" className="lp-phone-sm" />
              <h3>Customers in one place</h3>
              <p>Phone, WhatsApp, measurements and every order for a customer, one tap from the counter.</p>
            </div>
          </div>
        </motion.section>

        <section className="lp-container lp-how" id="how-it-works">
          <motion.figure className="lp-how-photo" {...reveal}>
            <img src="/images/tailoring-craft.webp" alt="Tailor guiding ivory linen through a sewing machine" width="1536" height="1024" loading="lazy" />
          </motion.figure>
          <motion.div {...reveal}>
            <h2>Up and running in an afternoon.</h2>
            <ol className="lp-steps">
              <li><h3>Create your shop</h3><p>Sign up in the app with your name, mobile number and shop details.</p></li>
              <li><h3>Take orders with measurements</h3><p>Pick the customer, choose the outfit, add measurements, price and delivery date.</p></li>
              <li><h3>Track work and money</h3><p>Move orders through cutting, stitching and ready, and record advances and balances.</p></li>
            </ol>
          </motion.div>
        </section>

        <section className="lp-container lp-pricing" id="plans">
          <motion.div className="lp-section-head" {...reveal}>
            <h2>Simple plans. Start free for 10 days.</h2>
            <p>Every plan includes unlimited customers and orders, measurements for every outfit, payments, invoices and WhatsApp sharing, and the business dashboard.</p>
          </motion.div>
          <div className="lp-plans">
            {Object.entries(plans).map(([key, plan]) => (
              <motion.article key={key} className={`lp-plan ${key === 'team' ? 'lp-plan-featured' : ''}`} {...reveal}>
                <div className="lp-plan-head">
                  <h3>{plan.label}</h3>
                  {key === 'team' && <span>Most popular</span>}
                </div>
                <p className="lp-plan-for">{plan.description}</p>
                <p className="lp-price">₹{plan.amount}<span>/month</span></p>
                <p className="lp-plan-access"><Users size={16} />{plan.access}</p>
                <ul>
                  {planHighlights[key].map((item) => <li key={item}><Check size={16} />{item}</li>)}
                </ul>
                <Button to="/billing" variant={key === 'team' ? 'primary' : 'secondary'}>Choose {plan.label}</Button>
              </motion.article>
            ))}
          </div>
          <p className="lp-note"><ShieldCheck size={16} />Secure checkout with Cashfree. Plans run for 30 days and never renew automatically.</p>
        </section>

        <section className="lp-container lp-faq">
          <motion.div {...reveal}>
            <h2>Questions shop owners ask</h2>
            <a className="lp-link" href="mailto:stitchbook3@gmail.com"><MessageCircle size={16} />Email us</a>
          </motion.div>
          <div className="lp-faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<Plus size={18} aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <motion.section className="lp-container lp-final" {...reveal}>
          <h2>Leave the order notebook behind.</h2>
          <p>Start with your customers and today's orders. The rest follows.</p>
          <div className="lp-actions lp-actions-center">
            <Button href={downloadUrl}><Smartphone size={18} />{appCtaLabel}</Button>
            <a className="lp-link" href="/login">Already use StitchBook? Sign in <ChevronRight size={15} /></a>
          </div>
        </motion.section>
      </div>
    </PageShell>
  );
}
