import { motion, useReducedMotion } from 'framer-motion';
import { BarChart3, Check, ChevronRight, FileText, Languages, MessageCircle, Plus, ShieldCheck, Smartphone, Users, Wallet, X } from 'lucide-react';
import Button from '../components/Button.jsx';
import PageShell from '../components/PageShell.jsx';
import { plans } from '../data/plans.js';
import { Stagger, StaggerItem } from '../components/landingMotion.jsx';
import DemoStory from '../components/DemoStory.jsx';
import TailoringHero from '../components/TailoringHero.jsx';
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

// Demo tour: real recordings from the app (public/media), poster = a frame from the clip
const tour = [
  { key: 'orders', title: 'Move every order forward', body: 'Open an order, mark it ready, and the customer can be told on WhatsApp.', video: '/media/orders.mp4', poster: '/media/orders.webp', alt: 'An order for Rahul Verma moves from Stitching to Ready after confirming' },
  { key: 'neworder', title: 'Take an order in seconds', body: 'Pick the customer and outfit. Their saved measurements are already there.', video: '/media/neworder.mp4', poster: '/media/neworder.webp', alt: 'A new shirt order reuses the customer\'s saved shirt measurements' },
  { key: 'measure', title: 'Measurements that stay saved', body: 'Every customer\'s fit profile, shown on a body diagram, in inches.', video: '/media/measure.mp4', poster: '/media/measure.webp', alt: 'Measurement profiles list and a body diagram with neck, chest, shoulder and sleeve sizes' },
  { key: 'staff', title: 'Each tailor sees their work', body: 'Cutters and stitchers get their own view of what is assigned to them.', video: '/media/staff.mp4', poster: '/media/staff.webp', alt: 'Staff list with the cutter app view and stitcher app view of assigned orders' },
];
const also = [
  { icon: MessageCircle, text: 'WhatsApp updates for ready, delivery and payment' },
  { icon: Wallet, text: 'Advances, balances and payment history' },
  { icon: FileText, text: 'Job sheets and bills to share' },
  { icon: Users, text: 'Staff pay and work ledger' },
  { icon: BarChart3, text: 'Reports by day, week, month or year' },
  { icon: Languages, text: 'English, Telugu and Hindi' },
];

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


  return (
    <PageShell>
      <div className="lp">
        <TailoringHero downloadUrl={downloadUrl} appCtaLabel={appCtaLabel} />

        <section className="lp-tour" id="features">
          <div className="lp-container">
            <motion.div className="lp-section-head" {...reveal}>
              <h2>See a day at the counter.</h2>
              <p>Real screens from the app, recorded in a demo shop. Watch the tour or use the arrows to explore.</p>
            </motion.div>
            <motion.div {...reveal}>
              <DemoStory steps={tour} />
            </motion.div>
            <Stagger as="ul" className="lp-also">
              {also.map(({ icon: Icon, text }) => <StaggerItem as="li" key={text}><Icon size={18} aria-hidden="true" />{text}</StaggerItem>)}
            </Stagger>
          </div>
        </section>

        <section className="lp-container lp-how" id="how-it-works">
          <motion.figure className="lp-how-photo" {...reveal}>
            <img src="/images/tailoring-craft.webp" alt="Tailor guiding ivory linen through a sewing machine" width="1536" height="1024" loading="lazy" />
          </motion.figure>
          <motion.div {...reveal}>
            <h2>Up and running in an afternoon.</h2>
            <Stagger as="ol" className="lp-steps">
              <StaggerItem as="li"><h3>Create your shop</h3><p>Sign up in the app with your name, mobile number and shop details.</p></StaggerItem>
              <StaggerItem as="li"><h3>Take orders with measurements</h3><p>Pick the customer, choose the outfit, add measurements, price and delivery date.</p></StaggerItem>
              <StaggerItem as="li"><h3>Track work and money</h3><p>Move orders through cutting, stitching and ready, and record advances and balances.</p></StaggerItem>
            </Stagger>
          </motion.div>
        </section>

        <section className="lp-container lp-pricing" id="plans">
          <motion.div className="lp-section-head" {...reveal}>
            <h2>Simple plans. Start free for 10 days.</h2>
            <p>Every plan includes unlimited customers and orders, measurements for every outfit, payments, invoices and WhatsApp sharing, and the business dashboard.</p>
          </motion.div>
          <Stagger className="lp-plans">
            {Object.entries(plans).map(([key, plan]) => (
              <StaggerItem as="article" key={key} className={`lp-plan ${key === 'team' ? 'lp-plan-featured' : ''}`}>
                <div className="lp-plan-head">
                  <h3>{plan.label}</h3>
                  {key === 'team' && <span>Most popular</span>}
                </div>
                <p className="lp-plan-for">{plan.description}</p>
                <p className="lp-price">₹{plan.amount}<span>/month</span></p>
                <p className="lp-plan-access"><Users size={16} />{plan.access}</p>
                <ul className="lp-plan-features" aria-label={`${plan.label} plan features`}>
                  {plan.featureRows.map((feature) => (
                    <li key={feature.label} className={feature.included ? 'is-included' : 'is-excluded'}>
                      {feature.included ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
                      <span className="lp-feature-label">{feature.label}{feature.planned && <small>Planned feature</small>}</span>
                      <span className="lp-feature-value">{feature.value}</span>
                    </li>
                  ))}
                </ul>
                <Button to="/billing" variant={key === 'team' ? 'primary' : 'secondary'}>Choose {plan.label}</Button>
              </StaggerItem>
            ))}
          </Stagger>
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
