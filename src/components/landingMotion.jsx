import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

// Motion for the landing page. One authored moment (the hero phones); the demo
// tour carries the product story; everything else is quiet entrance or feedback.
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
