import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Check, ChevronRight, ClipboardList, Clock3, IndianRupee, Plus, Ruler, Scissors, ShieldCheck, Smartphone, Users, X } from 'lucide-react';
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
const appUrl = validDownloadUrl(import.meta.env.VITE_APP_DOWNLOAD_URL) || validDownloadUrl(import.meta.env.VITE_GOOGLE_PLAY_URL) || validDownloadUrl(import.meta.env.VITE_APP_STORE_URL);
const downloadUrl = appUrl || 'mailto:stitchbook3@gmail.com?subject=StitchBook%20app%20download';
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

function SignatureCutTransition({ reduceMotion }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end']
  });

  const seamProgress = useTransform(scrollYProgress, [0.05, 0.58], [0, 1]);
  const scissorX = useTransform(scrollYProgress, [0.04, 0.62], ['74vw', '37vw']);
  const scissorY = useTransform(scrollYProgress, [0.04, 0.62], ['-6vh', '78vh']);
  const scissorRotate = useTransform(scrollYProgress, [0.04, 0.62], [-12, 18]);
  const leftX = useTransform(scrollYProgress, [0.5, 0.9], ['0%', '-64%']);
  const rightX = useTransform(scrollYProgress, [0.5, 0.9], ['0%', '64%']);
  const fabricScale = useTransform(scrollYProgress, [0, 0.55, 0.92], [1, 1.015, 1.045]);
  const introOpacity = useTransform(scrollYProgress, [0, 0.18, 0.45], [1, 1, 0]);
  const revealOpacity = useTransform(scrollYProgress, [0.55, 0.82], [0, 1]);
  const revealY = useTransform(scrollYProgress, [0.55, 0.88], [36, 0]);

  if (reduceMotion) {
    return (
      <section className="signature-cut signature-cut-reduced" aria-label="Cut through the chaos">
        <div className="signature-cut-static">
          <Scissors size={84} strokeWidth={1.25} aria-hidden="true" />
          <p className="eyebrow">CUT THROUGH THE CONFUSION</p>
          <h2>From scattered details<br /><em>to one simple system.</em></h2>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="signature-cut" aria-label="Cut through the chaos">
      <div className="signature-cut-sticky">
        <div className="signature-cut-reveal">
          <motion.div style={{ opacity: revealOpacity, y: revealY }} className="signature-cut-reveal-copy">
            <p className="eyebrow">A CLEARER WAY TO WORK</p>
            <h2>Remove the confusion.<br /><em>Keep your shop work moving.</em></h2>
            <p>Keep orders, measurements, delivery dates and payments together, so your daily shop work is easier to follow.</p>
          </motion.div>
          <div className="signature-pattern signature-pattern-one" />
          <div className="signature-pattern signature-pattern-two" />
        </div>

        <motion.div className="signature-fabric signature-fabric-left" style={{ x: leftX, scale: fabricScale }}>
          <div className="fabric-weave" />
          <motion.div className="signature-cut-intro" style={{ opacity: introOpacity }}>
            <span>01 / THE CUT</span>
            <strong>Too many details.<br />Too many notebooks.</strong>
          </motion.div>
        </motion.div>

        <motion.div className="signature-fabric signature-fabric-right" style={{ x: rightX, scale: fabricScale }}>
          <div className="fabric-weave" />
          <motion.div className="signature-cut-mark" style={{ opacity: introOpacity }}>
            <span>KEEP SHOP WORK SIMPLE</span>
          </motion.div>
        </motion.div>

        <svg className="signature-seam" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <motion.path
            d="M72 -4 C69 20 62 36 58 52 S49 80 42 104"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.35"
            strokeDasharray="1.6 1.4"
            style={{ pathLength: seamProgress }}
          />
        </svg>

        <motion.div
          className="signature-scissors"
          style={{ x: scissorX, y: scissorY, rotate: scissorRotate }}
          aria-hidden="true"
        >
          <Scissors strokeWidth={1.15} />
          <span>CUTTING</span>
        </motion.div>

        <div className="signature-measure signature-measure-top" aria-hidden="true" />
        <div className="signature-measure signature-measure-bottom" aria-hidden="true" />
      </div>
    </section>
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
        <p className="eyebrow">SEE YOUR SHOP AT A GLANCE</p>
        <h2 id="data-showcase-title">Know what is happening.<br /><em>Before you miss anything.</em></h2>
        <p>See active orders, ready deliveries, payments and saved measurements in one place. Quickly know what needs attention today.</p>
        <div className="data-legend"><span><span className="live-dot" /> Illustrative live shop data</span><span><Clock3 size={14} /> Updates as work changes</span></div>
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
  title: 'Keep every customer detail ready.',
  description: 'Save phone number, order history and customer details together, so you can quickly check them when they return.'
}, {
  number: '02',
  icon: Ruler,
  title: 'Save measurements and use them again.',
  description: 'Save measurements for each outfit and use them again for the next order. No need to search old notebooks.'
}, {
  number: '03',
  icon: ClipboardList,
  title: 'Know the status of every order.',
  description: 'Track each order from cutting to stitching, ready and delivered, along with the delivery date.'
}, {
  number: '04',
  icon: IndianRupee,
  title: 'Track advance and balance easily.',
  description: 'Record advance, balance and payment history with each order, so you always know what is paid and what is due.'
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
      <div className="hero-copy"><p className="eyebrow"><span className="live-dot" /> BUILT FOR REAL TAILORING SHOPS</p><h1>Manage your tailoring shop<br /><em>without missing any details.</em></h1><p className="hero-description">Keep customer details, measurements, orders, delivery dates and payments in one place. Know what is pending, what is ready and what payment is still due.</p><div className="hero-actions"><Button className="landing-primary" href={downloadUrl}>{appUrl ? 'Get the StitchBook app' : 'Request app access'} <ArrowRight size={18} /></Button><a className="text-link" href="#features">Explore the app <ArrowDown size={16} /></a></div><div className="hero-reassurance"><span><Check size={15} /> Built around tailoring workflows</span><span><Check size={15} /> Owner and staff plans available</span></div>{storeLinks.length > 0 && <div className="store-links">{storeLinks.map(([name, url]) => <a href={url} key={name}><Smartphone size={15} />{name}<ArrowRight size={14} /></a>)}</div>}</div>
      <div className="hero-visual-stack">
        <figure className="hero-editorial-shot" aria-hidden="true">
          <img src="/images/stitch-hero.webp" alt="" loading="eager" fetchPriority="high" width="960" height="640" />
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
    <motion.div className="audience-strip" {...reveal}><div className="landing-container"><span>MADE FOR INDIAN TAILORS AND BOUTIQUES</span><p>Independent tailors <i /> Boutique owners <i /> Fashion designers <i /> Growing teams</p><Scissors size={24} aria-hidden="true" /></div></motion.div>
    <motion.section className="landing-container feature-section" id="features" {...reveal}><div className="section-intro"><div><p className="eyebrow">ONE CLEAR VIEW OF YOUR SHOP</p><h2>Keep every shop detail<br /><em>in one simple place.</em></h2></div><p>From measurement to delivery and payment, keep every detail linked to the right customer and order.</p></div><div className="feature-editorial">{features.map(({
            number,
            icon: Icon,
            title,
            description
          }) => <motion.article key={number} initial={reduceMotion ? false : { opacity: 0, y: 26, scale: .985 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }} viewport={{ once: false, amount: 0.28 }} transition={{ duration: .48, delay: Number(number) * .035, ease: [0.22, 1, 0.36, 1] }}><div className="feature-top"><Icon size={24} strokeWidth={1.5} /><span>{number}</span></div><h3>{title}</h3><p>{description}</p></motion.article>)}</div></motion.section>
    <SignatureCutTransition reduceMotion={reduceMotion} />
    <DataShowcase reduceMotion={reduceMotion} />
    <motion.section className="craft-section" id="how-it-works" {...reveal}><motion.div className="craft-photo" {...revealLeft}><img src="/images/tailoring-craft.webp" alt="Tailor guiding ivory linen through a sewing machine in warm workshop light" loading="lazy" width="1536" height="1024" /><span>FOR THE HANDS THAT MAKE IT HAPPEN.</span></motion.div><motion.div className="craft-copy" {...revealRight}><p className="eyebrow">LESS CHASING. MORE MAKING.</p><h2>Focus on stitching.<br />Keep your shop<br /><em>under control.</em></h2><p>A busy tailoring shop has many small details to manage. StitchBook keeps them organized so you and your staff can work without depending on memory.</p><ol className="workflow"><li><span>01</span><div><h3>Set up your shop.</h3><p>Add your shop details, customers and current work.</p></div></li><li><span>02</span><div><h3>Keep every order in one place.</h3><p>Customer details, measurements, delivery date, status and payment stay together.</p></div></li><li><span>03</span><div><h3>See what needs attention.</h3><p>Open the app and check what is pending, in progress, ready or overdue.</p></div></li></ol></motion.div></motion.section>
    <motion.section className="landing-container pricing-section" id="plans" {...reveal}><div className="section-intro"><div><p className="eyebrow">PLANS FOR EVERY SIZE OF SHOP</p><h2>Start with yourself.<br /><em>Add staff when you need them.</em></h2></div><p>Choose a plan for only you, or add cutters and stitchers when your shop grows.</p></div><div className="pricing-columns">{Object.entries(plans).map(([key, plan]) => <motion.article className={`pricing-column ${key === 'team' ? 'featured-plan' : ''}`} key={key} initial={reduceMotion ? false : { opacity: 0, y: 28 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: false, amount: .25 }} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}><div className="plan-heading"><h3>{plan.label}</h3>{key === 'team' && <span>FOR SMALL TEAMS</span>}</div><p>{plan.description}</p><div className="plan-price">₹{plan.amount}<span>/ month</span></div><div className="plan-access"><Users size={17} />{plan.access}</div><ul className="plan-feature-list">{plan.featureRows.map(feature => <li className={feature.included ? 'plan-feature-included' : 'plan-feature-excluded'} key={feature.label}><span className="plan-feature-icon">{feature.included ? <Check size={15} /> : <X size={15} />}</span><span className="plan-feature-copy"><span>{feature.label}</span><strong>{feature.value}</strong>{feature.planned ? <small>Planned feature</small> : null}</span></li>)}</ul><Button className={key === 'team' ? 'landing-primary' : 'plan-button'} to="/billing" variant={key === 'team' ? 'primary' : 'secondary'}>Choose {plan.label}<ArrowRight size={16} /></Button></motion.article>)}</div><p className="pricing-note"><ShieldCheck size={16} /> Secure checkout with Cashfree. Manage your subscription on the web; run your shop in the app.</p></motion.section>
    <motion.section className="faq-section landing-container" {...reveal}><div><p className="eyebrow">BEFORE YOU GET STARTED</p><h2>Simple questions.<br /><em>Clear answers.</em></h2><a className="text-link" href="mailto:stitchbook3@gmail.com">Talk to us <ArrowRight size={16} /></a></div><div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={19} /></summary><p>{answer}</p></details>)}</div></motion.section>
    <motion.section className="landing-cta" {...reveal}><div className="landing-container"><Scissors size={32} strokeWidth={1.3} /><p className="eyebrow">YOUR SHOP DESERVES A BETTER SYSTEM</p><h2>Leave old notebooks behind.<br /><em>Manage your shop better.</em></h2><p>Start with your customers and orders, and manage the day with less confusion.</p><Button className="landing-primary" href={downloadUrl}>{appUrl ? 'Get the StitchBook app' : 'Request app access by email'}<ArrowRight size={18} /></Button><a className="cta-secondary" href="/login">Already use StitchBook? Sign in <ChevronRight size={14} /></a></div></motion.section>
  </div></PageShell>;
}
