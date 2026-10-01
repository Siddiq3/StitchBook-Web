import { ArrowRight, BarChart3, Bell, CheckCircle2, ClipboardList, CreditCard, Languages, IndianRupee, Ruler, Sparkles, Smartphone, UserRound, Users } from "lucide-react";
import { motion } from 'framer-motion';
import Button from '../components/Button.jsx';
import PageShell from '../components/PageShell.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

const downloadUrl = import.meta.env.VITE_APP_DOWNLOAD_URL || '#';

const features = [
  {
    icon: Users,
    title: 'Customer details',
    description: 'Install the app to save customer names, phone numbers, measurements, and past orders.',
  },
  {
    icon: Ruler,
    title: 'Measurements',
    description: 'Record measurements inside the mobile app and reuse them whenever the customer comes back.',
  },
  {
    icon: CreditCard,
    title: 'Payments',
    description: 'Use the app for advance paid, balance amount, and payment history for every order.',
  },
  {
    icon: Bell,
    title: 'Order updates',
    description: 'Track pending, stitching, ready, and delivered orders from your phone.',
  },
];

const steps = [
  ['Install app', 'Download StitchBook on your phone and sign in as the shop owner.'],
  ['Choose plan', 'Use this website to start or renew your subscription securely.'],
  ['Run shop in app', 'Manage customers, measurements, orders, staff work, and payments in the app.'],
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
      className="inline-flex min-h-11 w-full items-center gap-2 rounded-xl border border-ink/12 bg-white px-3.5 py-2 text-left transition hover:border-brass/30 hover:bg-white sm:w-auto"
      href={downloadUrl}
    >
      <StoreIcon type={type} />
      <span>
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted">
          {isApple ? 'Download on the' : 'Get it on'}
        </span>
        <span className="block text-xs font-semibold text-ink">{isApple ? 'App Store' : 'Google Play'}</span>
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
      <section className="brand-soft relative overflow-hidden text-ink">
        <div className="absolute inset-x-0 top-0 h-px bg-brass/15" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] md:gap-12 md:pb-20 md:pt-20 lg:px-8">
          <motion.div
            animate="visible"
            initial="hidden"
            transition={{ duration: 0.55, ease: 'easeOut' }}
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brass/15 bg-white px-4 py-2 text-sm font-semibold text-muted">
              <Sparkles size={16} className="text-brass" />
              Simple app for tailoring shops
            </div>
            <h1 className="brand-heading text-balance mt-7 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Your shop, organized.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted md:text-xl">
              StitchBook’s full shop features are in the mobile app. Use this website to sign in, choose a plan, renew subscription, and download the app.
            </p>
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button className="w-full px-7 sm:w-auto" href={downloadUrl} variant="primary">
                Download App <Smartphone size={17} />
              </Button>
              <Button className="w-full sm:w-auto" to="/billing" variant="secondary">
                View Subscription Plans <ArrowRight size={17} />
              </Button>
            </div>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Also available on</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <StoreBadge type="google" />
                <StoreBadge type="apple" />
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {trustSignals.map((signal) => (
                <span className="rounded-full border border-ink/10 bg-white/76 px-3 py-1.5 text-xs font-semibold text-muted" key={signal}>
                  {signal}
                </span>
              ))}
            </div>
            <ul className="mt-8 grid gap-3 text-sm text-muted">
              {['Keep customer measurements together', 'Track order progress and delivery dates', 'Record advances and outstanding balances'].map(item => <li className="flex items-center gap-2" key={item}><CheckCircle2 size={18} className="shrink-0 text-brass" />{item}</li>)}
            </ul>
          </motion.div>

          <motion.div
            animate="visible"
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            transition={{ delay: 0.12, duration: 0.55, ease: 'easeOut' }}
            variants={{ visible: { opacity: 1, scale: 1 } }}
          >
            <div className="overflow-hidden rounded-2xl border border-brass/15 bg-white p-3">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  alt="Premium tailoring studio with fabrics, garment patterns, and tailoring tools"
                  className="h-[24rem] w-full object-cover sm:h-[28rem] md:h-[34rem]"
                  src="/images/stitch-hero.png"
                />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-ink/10 bg-white/92 p-4 text-ink -md">
                  <p className="brand-solid inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">Daily work</p>
                  <div className="mt-4 grid gap-3">
                    {dailyWorkItems.map(([item, Icon]) => (
                      <motion.div
                        className="flex items-center justify-between rounded-2xl border border-brass/10 bg-mist px-4 py-3"
                        key={item}
                        transition={{ duration: 0.16 }}

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
            eyebrow="Inside the mobile app"
            title="Daily shop work happens in the app"
            description="The website is for account and subscription. Install the StitchBook app to use the full tailoring workflow."
          />
          <motion.div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-6" variants={stagger}>
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <motion.article
                  className="surface-card rounded-2xl bg-bone p-6 lg:col-span-3 xl:col-span-3"
                  key={feature.title}
                  variants={fadeUp}

                  transition={{ duration: 0.2 }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-mist text-ink">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted">{feature.description}</p>
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
            title="Website for subscription, app for daily work"
          />
          <motion.div className="relative mt-12 grid gap-5 md:grid-cols-3" variants={stagger}>
            {steps.map(([title, description], index) => (
              <motion.article className="surface-card rounded-2xl bg-bone/82 p-7" key={title} variants={fadeUp}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brass text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-7 font-sans text-3xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brass">
              <Languages size={22} />
            </div>
            <h2 className="text-balance mt-6 font-sans text-4xl font-semibold leading-tight sm:text-3xl md:text-4xl">
              Made for Indian tailoring shops
            </h2>
            <p className="mt-4 text-base leading-7 text-muted">
              Install the app and use StitchBook in the way your shop already works. The website stays simple for login, subscription, and account support.
            </p>
          </div>
          <motion.div className="grid gap-4 sm:grid-cols-2" variants={stagger}>
            {['English', 'Hindi', 'Punjabi', 'Gujarati', 'Marathi', 'Telugu', 'Bengali'].map((language) => (
              <motion.div className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white px-5 py-4" key={language} variants={fadeUp}>
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
              eyebrow="Subscription website"
              title="Buy or renew your plan here"
              description="Use the website for secure checkout, billing status, and plan upgrades. Open the app for customers, measurements, orders, and staff work."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button className="w-full sm:w-auto" to="/billing">View Plans</Button>
              <Button className="w-full sm:w-auto" href={downloadUrl} variant="secondary">Download App</Button>
            </div>
          </div>
          <motion.div className="surface-card rounded-2xl p-5" variants={fadeUp}>
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brass">Website account</p>
                <h3 className="mt-1 text-lg font-semibold">Subscription at a glance</h3>
              </div>
              <BarChart3 className="text-sage" size={28} />
            </div>
            <div className="mt-5 grid gap-3">
              {[
                ['Choose Basic, Team, or Pro plan', ClipboardList],
                ['Pay securely with Razorpay checkout', CreditCard],
                ['Continue daily work inside the app', Smartphone],
              ].map(([item, Icon]) => (
                <div className="flex items-center gap-3 rounded-2xl border border-ink/10 px-4 py-3" key={item}>
                  <Icon size={17} className="text-brass" />
                  <span className="text-sm font-medium text-muted">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-t border-border bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeading align="left" eyebrow="Support" title="Questions about your shop account?" description="Contact StitchBook for help with your account or subscription." />
          <Button href="mailto:stitchbook3@gmail.com" variant="secondary">Contact support</Button>
        </div>
      </section>

    </PageShell>
  );
}

export default LandingPage;
