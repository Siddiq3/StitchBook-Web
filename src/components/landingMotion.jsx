import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Check, Scissors } from 'lucide-react';

// Motion for the landing page. One authored moment (the hero phones and the
// order-status track); everything else is quiet entrance or feedback.
// Every component renders its final state when the visitor prefers reduced motion.

export const EASE = [0.16, 1, 0.3, 1];

// Children of a Stagger appear one after another, once, when the group scrolls in.
const groupVariants = { hidden: {}, shown: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, shown: { opacity: 1, y: 0, transition: { duration: 0.42, ease: EASE } } };

export function Stagger({ as = 'div', children, className, onLoad = false }) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  if (reduce) return <Tag className={className}>{children}</Tag>;
  const trigger = onLoad ? { animate: 'shown' } : { whileInView: 'shown', viewport: { once: true, amount: 0.3 } };
  return <Tag className={className} variants={groupVariants} initial="hidden" {...trigger}>{children}</Tag>;
}

export function StaggerItem({ as = 'div', children, className }) {
  const Tag = motion[as];
  return <Tag className={className} variants={itemVariants}>{children}</Tag>;
}

// Hero phones: spring in, then drift at different speeds while the hero scrolls away.
export function HeroPhones({ front, back }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const frontY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const backY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const spring = (delay) => reduce ? {} : {
    initial: { opacity: 0, y: 48, rotate: delay ? 4 : -3 },
    animate: { opacity: 1, y: 0, rotate: 0 },
    transition: { type: 'spring', stiffness: 120, damping: 20, mass: 0.9, delay },
  };
  return (
    <div className="lp-hero-visual" ref={ref}>
      <motion.div className="lp-hero-back" style={reduce ? undefined : { y: backY }}>
        <motion.div {...spring(0.15)}>{back}</motion.div>
      </motion.div>
      <motion.div className="lp-hero-front" style={reduce ? undefined : { y: frontY }}>
        <motion.div {...spring(0)}>{front}</motion.div>
      </motion.div>
    </div>
  );
}

// A garment moving through the shop's real stages; the highlight slides between
// steps (shared layoutId). Runs only while on screen; reduced motion shows Ready.
const STAGES = ['Pending', 'Cutting', 'Stitching', 'Ready'];

export function StatusTrack() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.6 });
  const [stage, setStage] = useState(reduce ? STAGES.length - 1 : 0);

  useEffect(() => {
    if (reduce || !inView) return undefined;
    const timer = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 1500);
    return () => clearInterval(timer);
  }, [reduce, inView]);

  const ready = stage === STAGES.length - 1;
  return (
    <div ref={ref} className="lp-track" role="img" aria-label="An order moves from pending to cutting, stitching and ready">
      <div className="lp-track-head">
        <span className="lp-track-garment"><Scissors size={16} />Shirt × 2 · Rahul</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={ready ? 'ready' : 'due'}
            className={`lp-track-tag ${ready ? 'is-ready' : ''}`}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {ready ? <><Check size={14} />Ready for pickup</> : 'Due Friday'}
          </motion.span>
        </AnimatePresence>
      </div>
      <ol className="lp-track-steps">
        {STAGES.map((name, index) => (
          <li key={name} className={index <= stage ? 'is-done' : ''}>
            {index === stage && (
              <motion.span layoutId="lp-track-active" className="lp-track-active" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
            )}
            <span className="lp-track-label">{name}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
