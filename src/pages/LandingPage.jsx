import {
  ArrowRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Languages,
  IndianRupee,
  Ruler,
  Sparkles,
  Star,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button.jsx';
import PageShell from '../components/PageShell.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

const downloadUrl = import.meta.env.VITE_APP_DOWNLOAD_URL || '#';

const features = [
  {
    icon: Users,
    title: 'Customer details',
    description: 'Save customer names, phone numbers, measurements, and past orders in one place.',
  },
  {
    icon: Ruler,
    title: 'Measurements',
    description: 'Store measurements once and use them again whenever the customer comes back.',
  },
  {
    icon: CreditCard,
    title: 'Payments',
    description: 'Track advance paid, balance amount, and payment history for every order.',
  },
  {
    icon: Bell,
    title: 'Order updates',
    description: 'See which orders are pending, in progress, ready, or delivered.',
  },
];

const steps = [
  ['Add customer', 'Add the customer details and save their measurements.'],
  ['Create order', 'Add the clothes, price, delivery date, and notes.'],
  ['Track delivery', 'Update the order status and record payments until it is delivered.'],
];

const testimonials = [
  {
    quote: 'StitchBook helped us stop using too many notebooks. Now orders and payments are easier to check.',
    name: 'Priya R.',
    role: 'Boutique owner',
  },
  {
    quote: 'We can quickly find measurements, delivery dates, and customer details whenever we need them.',
    name: 'Arjun K.',
    role: 'Tailoring studio',
  },
  {
    quote: 'The app is simple for our team and makes our shop look more professional.',
    name: 'Meera S.',
    role: 'Designer boutique',
  },
];

const insightCards = [
  ['Monthly orders', '128', '+18%'],
  ['Revenue tracked', '₹2.4L', '+12%'],
  ['Pending dues', '₹36K', 'clear'],
];

const trustSignals = ['10-day trial', 'Made for Indian shops', 'Staff access plans'];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const motionViewport = { once: true, amount: 0.2 };

function StoreBadge({ type }) {
  const isApple = type === 'apple';

  return (
    <a
      className="inline-flex min-h-11 w-full items-center gap-2 rounded-xl border border-ink/12 bg-white/78 px-3.5 py-2 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brass/30 hover:bg-white hover:shadow-glow sm:w-auto"
      href={downloadUrl}
    >
      <StoreIcon type={type} />
      <span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/42">
          {isApple ? 'Download on the' : 'Get it on'}
        </span>
        <span className="block text-xs font-bold text-ink">{isApple ? 'App Store' : 'Google Play'}</span>
      </span>
    </a>
  );
}

function StoreIcon({ type }) {
  if (type === 'apple') {
    return (
      <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-brass" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16.8 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.8 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.8 2.5 3.1 2.4 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0-.1-2.9-1.2-3-3.7ZM14.4 5.4c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.9-1 3 .9.1 2-.5 2.7-1.4Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0 text-brass" fill="none" viewBox="0 0 24 24">
      <path d="M5.5 3.6c-.4.2-.7.7-.7 1.4v14c0 .7.3 1.2.8 1.4l8.1-8.4-8.2-8.4Z" fill="currentColor" opacity="0.72" />
      <path d="m15 10.7 2.3-2.4L7.1 2.6c-.6-.3-1.1-.3-1.5-.1l9.4 8.2Z" fill="currentColor" opacity="0.95" />
      <path d="m15 13.3-9.4 8.2c.4.2.9.2 1.5-.1l10.2-5.7-2.3-2.4Z" fill="currentColor" opacity="0.55" />
      <path d="m19.2 9.4-1.9-1.1-2.6 2.7 2.6 2.7 1.9-1.1c1.3-.8 1.3-2.4 0-3.2Z" fill="currentColor" />
    </svg>
  );
}

function LandingPage() {
  const dailyWorkItems = [
    ['Customer added', UserRound],
    ['Measurements saved', Ruler],
    ['Payment recorded', IndianRupee],
  ];

  return (
    <PageShell>
      <section className="tailor-grid relative overflow-hidden bg-bone text-ink">
        <div className="absolute inset-x-0 top-0 h-px bg-ink/10" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 md:grid-cols-[0.95fr_1.05fr] md:gap-12 md:pb-20 md:pt-20 lg:px-8">
          <motion.div
            animate="visible"
            initial="hidden"
            transition={{ duration: 0.55, ease: 'easeOut' }}
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/88 px-4 py-2 text-sm font-bold text-ink/70 shadow-sm backdrop-blur">
              <Sparkles size={16} className="text-brass" />
              Simple app for tailoring shops
            </div>
            <h1 className="text-balance mt-7 max-w-3xl font-serif text-5xl font-semibold leading-tight text-ink sm:text-6xl md:text-7xl">
              Manage your tailoring shop from one app
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink/65 md:text-xl">
              Keep customers, measurements, orders, payments, and delivery updates in one easy place.
            </p>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button className="w-full px-7 sm:w-auto" href={downloadUrl} variant="brass">
                Get Started <ArrowRight size={17} />
              </Button>
              <Button className="w-full sm:w-auto" to="/about" variant="ghost">About StitchBook</Button>
            </div>
            <div className="mt-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-ink/38">Also available on</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <StoreBadge type="google" />
                <StoreBadge type="apple" />
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {trustSignals.map((signal) => (
                <span className="rounded-full border border-ink/10 bg-white/76 px-3 py-1.5 text-xs font-extrabold text-ink/55 shadow-sm" key={signal}>
                  {signal}
                </span>
              ))}
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ['Orders', '128'],
                ['Paid', '₹2.4L'],
                ['Dues', '₹36K'],
              ].map(([label, value]) => (
                <motion.div
                  className="premium-card subtle-lift rounded-lg p-5"
                  key={label}
                  transition={{ duration: 0.18 }}
                  whileHover={{ y: -3 }}
                >
                  <p className="text-xs font-bold uppercase text-ink/45">{label}</p>
                  <p className="mt-4 font-serif text-2xl text-ink sm:text-3xl">{value}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            animate="visible"
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            transition={{ delay: 0.12, duration: 0.55, ease: 'easeOut' }}
            variants={{ visible: { opacity: 1, scale: 1 } }}
          >
            <div className="overflow-hidden rounded-lg border border-ink/10 bg-white/88 p-3 shadow-soft backdrop-blur">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  alt="Premium tailoring studio with fabrics, garment patterns, and tailoring tools"
                  className="h-[24rem] w-full object-cover sm:h-[28rem] md:h-[34rem]"
                  src="/images/stitch-hero.png"
                />
                <div className="absolute inset-x-4 bottom-4 rounded-lg border border-ink/10 bg-white/92 p-4 text-ink shadow-soft backdrop-blur-md">
                  <p className="inline-flex rounded-full bg-ink/88 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-bone">Daily work</p>
                  <div className="mt-4 grid gap-3">
                    {dailyWorkItems.map(([item, Icon]) => (
                      <motion.div
                        className="flex items-center justify-between rounded-lg border border-ink/10 bg-bone px-4 py-3"
                        key={item}
                        transition={{ duration: 0.16 }}
                        whileHover={{ x: 3 }}
                      >
                        <span className="text-sm font-medium text-ink/75">{item}</span>
                        <Icon size={18} className="text-brass" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider h-px" />

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8" id="features">
        <motion.div
          className="mx-auto max-w-7xl"
          initial="hidden"
          transition={{ duration: 0.45, ease: 'easeOut' }}
          variants={fadeUp}
          viewport={motionViewport}
          whileInView="visible"
        >
          <SectionHeading
            eyebrow="Features"
            title="Everything your shop needs in one place"
            description="StitchBook helps you reduce paper work, avoid confusion, and serve customers better."
          />
          <motion.div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-6" variants={stagger}>
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  className="premium-card subtle-lift rounded-lg bg-bone p-6 lg:col-span-3 xl:col-span-3"
                  key={feature.title}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mist text-ink shadow-sm">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/65">{feature.description}</p>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-linen px-4 py-16 sm:px-6 sm:py-20 lg:px-8" id="how-it-works">
        <motion.div
          className="mx-auto max-w-7xl"
          initial="hidden"
          variants={fadeUp}
          viewport={motionViewport}
          whileInView="visible"
        >
          <SectionHeading
            eyebrow="How it works"
            title="How StitchBook helps your shop"
          />
          <motion.div className="relative mt-12 grid gap-5 md:grid-cols-3" variants={stagger}>
            {steps.map(([title, description], index) => (
              <motion.article className="premium-card subtle-lift rounded-lg bg-bone/82 p-7" key={title} variants={fadeUp}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brass text-sm font-extrabold text-white shadow-sm">
                  {index + 1}
                </span>
                <h3 className="mt-7 font-serif text-3xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/65">{description}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-mist px-4 py-16 text-ink sm:px-6 sm:py-20 lg:px-8" id="languages">
        <motion.div
          className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.9fr_1.1fr] md:items-center"
          initial="hidden"
          variants={fadeUp}
          viewport={motionViewport}
          whileInView="visible"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-brass">
              <Languages size={22} />
            </div>
            <h2 className="text-balance mt-6 font-serif text-4xl font-semibold leading-[0.95] sm:text-5xl md:text-6xl">
              Made for Indian tailoring shops
            </h2>
            <p className="mt-4 text-base leading-7 text-ink/65">
              Use StitchBook in the way your shop already works. Manage customers, payments, and orders without making the process hard.
            </p>
          </div>
          <motion.div className="grid gap-4 sm:grid-cols-2" variants={stagger}>
            {['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Marathi'].map((language) => (
              <motion.div className="subtle-lift flex items-center justify-between rounded-lg border border-ink/10 bg-white px-5 py-4 shadow-sm" key={language} variants={fadeUp}>
                <span className="font-semibold">{language}</span>
                <CheckCircle2 size={18} className="text-brass" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8" id="insights">
        <motion.div
          className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1fr_1.1fr] md:items-center"
          initial="hidden"
          variants={fadeUp}
          viewport={motionViewport}
          whileInView="visible"
        >
          <div>
            <SectionHeading
              align="left"
              eyebrow="Insights"
              title="See your shop clearly"
              description="Check orders, payments, pending dues, and daily work without searching through paper records."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="w-full sm:w-auto" href={downloadUrl}>Get Started</Button>
              <Button className="w-full sm:w-auto" to="/about" variant="secondary">Learn more</Button>
            </div>
          </div>
          <motion.div className="glass-panel rounded-lg p-5 shadow-soft" variants={fadeUp}>
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brass">Dashboard</p>
                <h3 className="mt-1 text-lg font-semibold">Today at a glance</h3>
              </div>
              <BarChart3 className="text-sage" size={28} />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {insightCards.map(([label, value, trend]) => (
                <div className="rounded-lg bg-linen p-4 shadow-sm" key={label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">{label}</p>
                  <p className="mt-5 font-serif text-3xl font-semibold">{value}</p>
                  <p className="mt-2 text-sm font-semibold text-sage">{trend}</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink/8">
                    <motion.div
                      className="h-full rounded-full bg-brass"
                      initial={{ width: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      viewport={motionViewport}
                      whileInView={{ width: label === 'Pending dues' ? '46%' : '72%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3">
              {[
                ['4 orders are ready for pickup', ClipboardList],
                ['7 measurements saved this week', Ruler],
                ['3 payments recorded today', TrendingUp],
              ].map(([item, Icon]) => (
                <div className="flex items-center gap-3 rounded-lg border border-ink/10 px-4 py-3" key={item}>
                  <Icon size={17} className="text-brass" />
                  <span className="text-sm font-medium text-ink/65">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-linen px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          className="mx-auto max-w-7xl"
          initial="hidden"
          variants={fadeUp}
          viewport={motionViewport}
          whileInView="visible"
        >
          <SectionHeading
            eyebrow="Testimonials"
            title="Trusted by tailoring shops"
            description="Simple tools for shops that want less confusion and better customer service."
          />
          <motion.div className="mt-12 grid gap-5 md:grid-cols-3" variants={stagger}>
            {testimonials.map((testimonial) => (
              <motion.article className="premium-card subtle-lift rounded-lg bg-bone p-7" key={testimonial.name} variants={fadeUp}>
                <div className="flex gap-1 text-brass">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star fill="currentColor" key={index} size={16} />
                  ))}
                </div>
                <p className="mt-6 text-base leading-7 text-ink/75">“{testimonial.quote}”</p>
                <div className="mt-6 border-t border-ink/10 pt-5">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-ink/50">{testimonial.role}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          className="mx-auto max-w-7xl overflow-hidden rounded-lg bg-ink p-8 text-bone shadow-soft md:p-12"
          initial="hidden"
          variants={fadeUp}
          viewport={motionViewport}
          whileInView="visible"
        >
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brass">Download StitchBook</p>
              <h2 className="text-balance mt-3 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
                Stop losing order details in notebooks.
              </h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <StoreBadge type="google" />
              <StoreBadge type="apple" />
            </div>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}

export default LandingPage;
