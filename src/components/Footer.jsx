import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

function Footer() {
  return (
    <footer className="site-footer text-ink">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="footer-panel">
          <div className="max-w-md">
            <Logo />
            <p className="mt-4 text-sm leading-6 text-muted">
              Customers, measurements, orders and payments — organized for tailoring businesses that would rather spend time on the craft.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-taupe">
              Web for your plan · App for daily shop work
            </p>
          </div>

          <div>
            <h3 className="footer-heading">Explore</h3>
            <div className="footer-links">
              <a href="/#features">Product</a>
              <Link to="/billing">Subscription plans</Link>
              <Link to="/about">Our story</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Support</h3>
            <div className="footer-links">
              <Link to="/terms">Terms & support</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/delete-account">Delete account</Link>
            </div>
          </div>

          <div>
            <h3 className="footer-heading">Contact</h3>
            <div className="footer-links">
              <a className="gap-2" href="mailto:stitchbook3@gmail.com"><Mail size={16} /> Email us <ArrowUpRight size={14} /></a>
              <a className="gap-2" href="tel:+919705116606"><Phone size={16} /> +91 97051 16606</a>
              <span className="flex min-h-10 items-center gap-2"><MapPin size={16} /> Hyderabad, India</span>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border/80 px-4 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} StitchBook. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
