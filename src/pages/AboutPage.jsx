import { Mail, MapPin, Phone, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import PageShell from '../components/PageShell.jsx';
import SectionHeading from '../components/SectionHeading.jsx';

const values = [
  {
    icon: Sparkles,
    title: 'Made for tailors',
    description: 'StitchBook is built for real tailoring shops and daily shop work.',
  },
  {
    icon: ShieldCheck,
    title: 'Easy to follow',
    description: 'Every order is easier to track from start to delivery.',
  },
  {
    icon: Users,
    title: 'Better customer service',
    description: 'Find customer details fast and give clear updates when needed.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

const viewport = { once: true, amount: 0.2 };

function AboutPage() {
  return (
    <PageShell>
      <section className="bg-bone px-4 py-16 text-ink sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          animate="visible"
          className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.95fr_1.05fr] md:items-center"
          initial="hidden"
          transition={{ duration: 0.5, ease: 'easeOut' }}
          variants={fadeUp}
        >
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brass">About StitchBook</p>
            <h1 className="text-balance mt-4 font-serif text-5xl font-semibold leading-tight sm:text-6xl md:text-7xl">
              We help tailoring shops stay organized.
            </h1>
          </div>
          <div className="rounded-lg border border-ink/10 bg-white p-7 shadow-sm">
            <p className="text-lg leading-8 text-ink/68">
              StitchBook is made for tailors, boutiques, and fashion designers.
              It helps you manage customers, measurements, orders, payments, and delivery details from one app.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="bg-linen px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2"
          initial="hidden"
          variants={fadeUp}
          viewport={viewport}
          whileInView="visible"
        >
          <div>
            <SectionHeading
              align="left"
              eyebrow="Mission"
              title="Make shop work easier"
              description="We help shops spend less time searching for details and more time serving customers."
            />
          </div>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Vision"
              title="Help tailors grow"
              description="We want every tailoring shop to look professional and manage work with confidence."
            />
          </div>
        </motion.div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          className="mx-auto max-w-7xl"
          initial="hidden"
          variants={fadeUp}
          viewport={viewport}
          whileInView="visible"
        >
          <SectionHeading
            eyebrow="Team"
            title="Built for the tailoring business"
            description="We focus on simple tools that make everyday shop work easier."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <motion.article
                  className="rounded-lg border border-ink/10 bg-white/72 p-7 shadow-sm"
                  key={value.title}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-bone">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold">{value.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink/65">{value.description}</p>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section className="bg-ink px-4 py-16 text-bone sm:px-6 sm:py-20 lg:px-8">
        <motion.div
          className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_1.1fr]"
          initial="hidden"
          variants={fadeUp}
          viewport={viewport}
          whileInView="visible"
        >
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brass">Contact</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-[0.95] sm:text-5xl md:text-6xl">
              Talk to StitchBook
            </h2>
          </div>
          <div className="grid gap-4 text-bone/75">
            <a className="flex items-center gap-3 rounded-lg border border-white/10 p-4 hover:bg-white/5" href="mailto:stitchbook3@gmail.com">
              <Mail size={18} /> stitchbook3@gmail.com
            </a>
            <a className="flex items-center gap-3 rounded-lg border border-white/10 p-4 hover:bg-white/5" href="tel:+919705116606">
              <Phone size={18} /> +91 97051 16606
            </a>
            <span className="flex items-center gap-3 rounded-lg border border-white/10 p-4">
              <MapPin size={18} /> Hyderabad, India
            </span>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}

export default AboutPage;
