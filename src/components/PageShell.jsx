import { motion, useReducedMotion } from 'framer-motion';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

function PageShell({ children }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-bone text-ink">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:shadow-glow">Skip to content</a>
      <Navbar />
      <motion.main
        id="main-content"
        className="min-h-[60vh]"
        tabIndex={-1}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
export default PageShell;
