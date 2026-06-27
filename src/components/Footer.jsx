import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

function Footer() {
  return (
    <footer className="brand-gradient border-t border-white/10 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/76">
            Download the mobile app for daily shop work. Use this website for subscription, billing, and account access.
          </p>
          <div className="mt-6 flex gap-3">
            <a aria-label="Instagram" className="rounded-full border border-white/18 bg-white/10 p-2 text-white/82 transition hover:bg-white/18 hover:text-white" href="https://instagram.com">
              <Instagram size={18} />
            </a>
            <a aria-label="Facebook" className="rounded-full border border-white/18 bg-white/10 p-2 text-white/82 transition hover:bg-white/18 hover:text-white" href="https://facebook.com">
              <Facebook size={18} />
            </a>
            <a aria-label="Twitter" className="rounded-full border border-white/18 bg-white/10 p-2 text-white/82 transition hover:bg-white/18 hover:text-white" href="https://twitter.com">
              <Twitter size={18} />
            </a>
            <a aria-label="LinkedIn" className="rounded-full border border-white/18 bg-white/10 p-2 text-white/82 transition hover:bg-white/18 hover:text-white" href="https://linkedin.com">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase text-white/62">Links</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/78">
            <Link className="hover:text-white" to="/">Home</Link>
            <Link className="hover:text-white" to="/about">About</Link>
            <a className="hover:text-white" href="/#features">App Features</a>
            <Link className="hover:text-white" to="/billing">Plans</Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase text-white/62">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/78">
            <a className="flex items-center gap-2 hover:text-white" href="mailto:hello@stitchbook.app">
              <Mail size={16} /> hello@stitchbook.app
            </a>
            <a className="flex items-center gap-2 hover:text-white" href="tel:+919876543210">
              <Phone size={16} /> +91 98765 43210
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={16} /> Hyderabad, India
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/12 bg-ink/10 px-6 py-5 text-center text-xs text-white/62">
        © {new Date().getFullYear()} StitchBook. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
