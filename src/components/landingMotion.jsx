import { motion, useReducedMotion } from 'framer-motion';

// Motion for the landing page. The demo tour carries the product story;
// everything else is quiet entrance or feedback.
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
