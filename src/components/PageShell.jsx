import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

function PageShell({ children }) {
  return (
    <div className="app-shell min-h-screen text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:font-semibold focus:shadow-soft"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
}

export default PageShell;
