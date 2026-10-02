import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronRight, ClipboardList, Clock3, IndianRupee, Plus, Ruler, Scissors, ShieldCheck, Smartphone, Users } from 'lucide-react';
import Button from '../components/Button.jsx';
import PageShell from '../components/PageShell.jsx';
import { plans } from '../data/plans.js';
function validDownloadUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname !== 'example.com' ? url.href : null;
  } catch {
    return null;
  }
}
const downloadUrl = validDownloadUrl(import.meta.env.VITE_APP_DOWNLOAD_URL) || 'mailto:stitchbook3@gmail.com?subject=StitchBook%20app%20download';
const storeLinks = [['Google Play', validDownloadUrl(import.meta.env.VITE_GOOGLE_PLAY_URL)], ['App Store', validDownloadUrl(import.meta.env.VITE_APP_STORE_URL)]].filter(([, url]) => url);
const previewTabs = [{
  name: 'Orders',
  icon: ClipboardList
}, {
  name: 'Measurements',
  icon: Ruler
}, {
  name: 'Payments',
  icon: IndianRupee
}];
const orders = [{
  initials: 'AK',
  name: 'Ananya Kumar',
  outfit: 'Linen kurta · #1042',
  status: 'Stitching',
  className: 'stitching',
  date: '06 Oct'
}, {
  initials: 'RS',
  name: 'Riya Sharma',
  outfit: 'Silk blouse · #1043',
  status: 'Ready',
  className: 'ready',
  date: '07 Oct'
}, {
  initials: 'VP',
  name: 'Vikram Patel',
  outfit: 'Cotton shirt · #1044',
  status: 'Cutting',
  className: 'cutting',
  date: '08 Oct'
}];
function ProductPreview() {
  const [activeTab, setActiveTab] = useState('Orders');
  return <div className="product-stage">
    <div className="stage-note"><span /> YOUR SHOP. CLEARER EVERY DAY.</div>
    <div className="product-window">
      <div className="window-toolbar"><div className="window-dots"><i /><i /><i /></div><span>YOUR SHOP, IN ONE PLACE</span><ShieldCheck size={14} /></div>
      <div className="preview-content">
        <div className="preview-shop"><span className="preview-shop-icon"><Scissors size={21} /></span><div><strong>The everyday atelier</strong><span>Shop owner workspace</span></div><span className="preview-avatar">S</span></div>
        <div className="preview-greeting"><span>Today, without the notebook hunt.</span><h2>Your shop is on track.</h2></div>
        <div className="preview-stats"><div><span>Active orders</span><strong>24 <small>in progress</small></strong></div><div><span>Ready to deliver</span><strong>08 <small>all stitched up</small></strong></div></div>
        <div className="preview-tabs" role="tablist" aria-label="See how it works preview">{previewTabs.map(({
            name,
            icon: Icon
          }) => <button type="button" role="tab" aria-selected={activeTab === name} id={`tab-${name}`} aria-controls="preview-panel" key={name} onClick={() => setActiveTab(name)} tabIndex={activeTab === name ? 0 : -1} onKeyDown={event => {
            if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
              event.preventDefault();
              const index = previewTabs.findIndex(tab => tab.name === activeTab);
              const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
              setActiveTab(previewTabs[next].name);
              document.getElementById(`tab-${previewTabs[next].name}`)?.focus();
            }
          }}><Icon size={15} />{name}</button>)}</div>
        <div className="preview-panel" id="preview-panel" role="tabpanel" aria-labelledby={`tab-${activeTab}`} tabIndex={0}>
          {activeTab === 'Orders' && <><div className="preview-list-heading"><strong>Upcoming deliveries</strong><span>3 orders</span></div>{orders.map(order => <div className="preview-order" key={order.name}><span className={`customer-initials ${order.className}`}>{order.initials}</span><div><strong>{order.name}</strong><span>{order.outfit}</span></div><div className="order-meta"><span className={`order-status ${order.className}`}>{order.status}</span><span>{order.date}</span></div></div>)}</>}
          {activeTab === 'Measurements' && <><div className="preview-list-heading"><strong>Ananya’s kurta</strong><span>Saved measurements</span></div><div className="measurement-grid">{[['Chest', '36'], ['Waist', '30'], ['Shoulder', '14'], ['Length', '42']].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}<small> in</small></strong></div>)}</div><p className="preview-hint"><Check size={14} /> Ready to reuse on the next order.</p></>}
          {activeTab === 'Payments' && <><div className="preview-list-heading"><strong>Order #1042</strong><span>Ananya Kumar</span></div><div className="payment-preview">{[['Order total', '₹1,800'], ['Advance received', '₹800'], ['Balance remaining', '₹1,000']].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><p className="preview-hint"><Check size={14} /> Every advance and balance, accounted for.</p></>}
        </div>
        <div className="preview-bottom"><span><span className="live-dot" /> Orders moving. Payments clear.</span><span>StitchBook</span></div>
      </div>
    </div>
    <div className="stage-caption"><Smartphone size={15} /><span>Illustrative app preview · sample shop data</span></div>
    <div className="stitched-orbit" aria-hidden="true" />
  </div>;
}

function CuttingDivider({ reduceMotion }) {
  return (
    <div className="cutting-divider" aria-hidden="true">
      <motion.div
        className="cut-thread"
        initial={reduceMotion ? false : { scaleX: 0 }}
        whileInView={reduceMotion ? undefined : { scaleX: 1 }}
        viewport={{ once: false, amount: 0.7 }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="cut-scissors"
        initial={reduceMotion ? false : { left: '2%', rotate: -8, opacity: 0 }}
        whileInView={reduceMotion ? undefined : { left: '93%', rotate: 8, opacity: 1 }}
        viewport={{ once: false, amount: 0.72 }}
        transition={{ duration: 1.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <Scissors size={24} strokeWidth={1.7} />
      </motion.div>
      <span className="cut-label">CUT THROUGH THE CHAOS</span>
    </div>
  );
}

const shopSignals = [
  { label: 'Active orders', value: '24', detail: '6 due this week', tone: 'coral', icon: ClipboardList, progress: 78 },
  { label: 'Ready to deliver', value: '08', detail: '3 ready today', tone: 'teal', icon: Check, progress: 64 },
  { label: 'Payments collected', value: '₹18.6k', detail: '₹4.2k still due', tone: 'gold', icon: IndianRupee, progress: 82 },
  { label: 'Saved measurements', value: '126', detail: 'Across 74 customers', tone: 'lilac', icon: Ruler, progress: 71 }
];

function DataShowcase({ reduceMotion }) {
  return (
    <section className="data-showcase landing-container" aria-labelledby="data-showcase-title">
      <motion.div
        className="data-showcase-copy"
        initial={reduceMotion ? false : { opacity: 0, y: 26 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.28 }}
        transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">YOUR DAY, AT A GLANCE</p>
        <h2 id="data-showcase-title">See the shop move.<br /><em>Before something gets missed.</em></h2>
        <p>StitchBook turns day-to-day tailoring work into a clear operating view—what is moving, what is ready, what is paid, and what still needs attention.</p>
        <div className="data-legend"><span><span className="live-dot" /> Illustrative live shop data</span><span><Clock3 size={14} /> Updated as work changes</span></div>
      </motion.div>

      <div className="data-stage">
        <svg className="thread-map" viewBox="0 0 760 420" preserveAspectRatio="none" aria-hidden="true">
          <motion.path
            d="M38 330 C120 330, 115 92, 230 92 S335 310, 430 278 S535 76, 716 112"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeDasharray="7 8"
            initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
            viewport={{ once: false, amount: .32 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div className="data-grid">
          {shopSignals.map((signal, index) => {
            const Icon = signal.icon;
            return (
              <motion.article
                className={`data-card data-card-${signal.tone}`}
                key={signal.label}
                initial={reduceMotion ? false : { opacity: 0, y: 28, scale: .97 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: .35 }}
                transition={{ duration: .5, delay: index * .07, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="data-card-top"><span className="data-icon"><Icon size={18} /></span><span>0{index + 1}</span></div>
                <strong>{signal.value}</strong>
                <h3>{signal.label}</h3>
                <p>{signal.detail}</p>
                <div className="data-progress"><motion.span initial={reduceMotion ? false : { width: 0 }} whileInView={{ width: `${signal.progress}%` }} viewport={{ once: false, amount: .5 }} transition={{ duration: .9, delay: .12 + index * .06, ease: [0.22, 1, 0.36, 1] }} /></div>
              </motion.article>
            );
          })}
        </div>
        <motion.div
          className="data-ticket"
          initial={reduceMotion ? false : { opacity: 0, x: 22, rotate: 3 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, rotate: -1.5 }}
          viewport={{ once: false, amount: .4 }}
          transition={{ duration: .58, delay: .18, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>ORDER #1042</span>
          <strong>Ananya Kumar</strong>
          <small>Stitching · due 06 Oct</small>
          <div><span>Advance</span><b>₹800</b></div>
          <div><span>Balance</span><b>₹1,000</b></div>
        </motion.div>
      </div>
    </section>
  );
}

const features = [{
  number: '01',
  icon: Users,
  title: 'Know every customer at a glance.',
  description: 'Keep contact details, order history and preferences together, so repeat customers never feel like a fresh start.'
}, {
  number: '02',
  icon: Ruler,
  title: 'Measurements ready when you need them.',
  description: 'Save measurements by outfit and reuse them on the next order—without searching through pages of handwritten notes.'
}, {
  number: '03',
  icon: ClipboardList,
  title: 'See exactly where every order stands.',
  description: 'Track cutting, stitching, ready and delivered stages alongside due dates, so nothing quietly slips behind.'
}, {
  number: '04',
  icon: IndianRupee,
  title: 'Know what came in—and what is still due.',
  description: 'Record advances, balances and payment history on the order itself, so payment conversations stay simple.'
}];
const faqs = [['What can I do with StitchBook?', 'The mobile app brings together customers, outfit measurements, orders, delivery dates, payments, invoices, and staff assignments. This website is where you sign in and manage your subscription.'], ['How do I get started?', 'Get the StitchBook mobile app and sign in as a shop owner. New accounts receive a trial. When you are ready, sign in here to choose and pay for a plan.'], ['Can my staff use StitchBook?', 'Yes. Team includes access for 2 staff members, and Pro includes 5. Assign cutting and stitching work to your staff. Basic provides owner-only access.'], ['How do payments for my subscription work?', 'Choose a plan on this website and complete the secure Cashfree checkout. Your subscription status is updated after payment verification, so you can continue working in the app.']];
export default function LandingPage() {
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion ? {} : {
    initial: { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.18 },
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] }
  };
  const revealLeft = reduceMotion ? {} : {
    initial: { opacity: 0, x: -38 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: false, amount: 0.2 },
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
  };
  const revealRight = reduceMotion ? {} : {
    initial: { opacity: 0, x: 38 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: false, amount: 0.2 },
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
  };

  return <PageShell><div className="landing">
    <motion.section className="landing-hero landing-container" {...reveal}>
      <div className="hero-copy"><p className="eyebrow"><span className="live-dot" /> BUILT FOR REAL TAILORING SHOPS</p><h1>Run your shop<br />without <em>running after details.</em></h1><p className="hero-description">Keep customers, measurements, orders, delivery dates and payments in one place—so you always know what is next, what is ready, and what is still due.</p><div className="hero-actions"><Button className="landing-primary" href={downloadUrl}>Start with StitchBook <ArrowRight size={18} /></Button><a className="text-link" href="#features">Explore the app <ArrowDown size={16} /></a></div><div className="hero-reassurance"><span><Check size={15} /> Built around tailoring workflows</span><span><Check size={15} /> Owner and staff plans available</span></div>{storeLinks.length > 0 && <div className="store-links">{storeLinks.map(([name, url]) => <a href={url} key={name}><Smartphone size={15} />{name}<ArrowRight size={14} /></a>)}</div>}</div>
      <div className="hero-visual-stack">
        <figure className="hero-editorial-shot" aria-hidden="true">
          <img src="/images/stitch-hero.png" alt="" loading="eager" />
          <span>CRAFT × CLARITY</span>
        </figure>
        <ProductPreview />
        <div className="hero-proof-card" aria-hidden="true">
          <span>Today</span>
          <strong>08 ready</strong>
          <small>Deliveries stay visible.</small>
        </div>
      </div>
    </motion.section>
    <motion.div className="audience-strip" {...reveal}><div className="landing-container"><span>BUILT FOR SHOPS THAT WORK WITH THEIR HANDS</span><p>Independent tailors <i /> Boutique owners <i /> Fashion designers <i /> Growing teams</p><Scissors size={24} aria-hidden="true" /></div></motion.div>
    <motion.section className="landing-container feature-section" id="features" {...reveal}><div className="section-intro"><div><p className="eyebrow">ONE CLEAR VIEW OF YOUR SHOP</p><h2>Stop remembering everything.<br /><em>Let StitchBook remember it.</em></h2></div><p>From the first measurement to the final payment, every important detail stays connected to the customer and order it belongs to.</p></div><div className="feature-editorial">{features.map(({
            number,
            icon: Icon,
            title,
            description
          }) => <motion.article key={number} initial={reduceMotion ? false : { opacity: 0, y: 26, scale: .985 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }} viewport={{ once: false, amount: 0.28 }} transition={{ duration: .48, delay: Number(number) * .035, ease: [0.22, 1, 0.36, 1] }}><div className="feature-top"><Icon size={24} strokeWidth={1.5} /><span>{number}</span></div><h3>{title}</h3><p>{description}</p></motion.article>)}</div></motion.section>
    <CuttingDivider reduceMotion={reduceMotion} />
    <DataShowcase reduceMotion={reduceMotion} />
    <motion.section className="craft-section" id="how-it-works" {...reveal}><motion.div className="craft-photo" {...revealLeft}><img src="/images/tailoring-craft.webp" alt="Tailor guiding ivory linen through a sewing machine in warm workshop light" loading="lazy" width="1536" height="1024" /><span>FOR THE HANDS THAT MAKE IT HAPPEN.</span></motion.div><motion.div className="craft-copy" {...revealRight}><p className="eyebrow">LESS CHASING. MORE MAKING.</p><h2>Your craft stays personal.<br />Your shop stays<br /><em>under control.</em></h2><p>Busy tailoring shops run on hundreds of small details. StitchBook keeps those details visible, so your team can move work forward without depending on memory.</p><ol className="workflow"><li><span>01</span><div><h3>Set up your shop once.</h3><p>Add your business and start with the people and work you already have.</p></div></li><li><span>02</span><div><h3>Keep every order connected.</h3><p>Customer, measurements, due date, progress and payment stay together.</p></div></li><li><span>03</span><div><h3>Know what needs attention.</h3><p>Open the app and see what is pending, in progress, ready or overdue.</p></div></li></ol></motion.div></motion.section>
    <motion.section className="landing-container pricing-section" id="plans" {...reveal}><div className="section-intro"><div><p className="eyebrow">PRICING THAT GROWS WITH YOUR SHOP</p><h2>Start simple.<br /><em>Add your team when you need them.</em></h2></div><p>Choose owner-only access or bring cutters and stitchers into the same workflow as your business grows.</p></div><div className="pricing-columns">{Object.entries(plans).map(([key, plan]) => <motion.article className={`pricing-column ${key === 'team' ? 'featured-plan' : ''}`} key={key} initial={reduceMotion ? false : { opacity: 0, y: 28 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: false, amount: .25 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}><div className="plan-heading"><h3>{plan.label}</h3>{key === 'team' && <span>FOR SMALL TEAMS</span>}</div><p>{plan.description}</p><div className="plan-price">₹{plan.amount}<span>/ month</span></div><div className="plan-access"><Users size={17} />{plan.access}</div><ul>{['Customers & measurements', 'Orders & delivery tracking', 'Payments & invoices', ...(plan.staffLimit ? ['Cutting & stitching assignments'] : ['Your own shop workspace'])].map(feature => <li key={feature}><Check size={15} />{feature}</li>)}</ul><Button className={key === 'team' ? 'landing-primary' : 'plan-button'} to="/billing" variant={key === 'team' ? 'primary' : 'secondary'}>Choose {plan.label}<ArrowRight size={16} /></Button></motion.article>)}</div><p className="pricing-note"><ShieldCheck size={16} /> Secure checkout with Cashfree. Manage your subscription on the web; run your shop in the app.</p></motion.section>
    <motion.section className="faq-section landing-container" {...reveal}><div><p className="eyebrow">BEFORE YOU GET STARTED</p><h2>Clear answers.<br /><em>No fine-print feeling.</em></h2><a className="text-link" href="mailto:stitchbook3@gmail.com">Talk to us <ArrowRight size={16} /></a></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={19} /></summary><p>{answer}</p></details>)}</div></motion.section>
    <motion.section className="landing-cta" {...reveal}><div className="landing-container"><Scissors size={32} strokeWidth={1.3} /><p className="eyebrow">YOUR SHOP DESERVES A BETTER SYSTEM</p><h2>Leave the notebook chaos behind.<br /><em>Keep the craft.</em></h2><p>Start with one customer, one order, and one clearer way to run the day.</p><Button className="landing-primary" href={downloadUrl}>Get the StitchBook app<ArrowRight size={18} /></Button><a className="cta-secondary" href="/login">Already use StitchBook? Sign in <ChevronRight size={14} /></a></div></motion.section>
  </div></PageShell>;
}
