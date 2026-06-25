import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-bone text-ink">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default PageShell;
