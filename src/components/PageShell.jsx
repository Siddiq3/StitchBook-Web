import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-bone text-ink">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:shadow-glow">Skip to content</a>
      <Navbar />
      <main id="main-content" className="min-h-[60vh]" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
}
export default PageShell;
