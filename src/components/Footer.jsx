import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

function Footer() {
  return (
    <footer className="site-footer border-t border-border text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted">A calmer way to run a tailoring business: customers, measurements, orders, staff and payments kept in one place.</p>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Product</h3>
          <div className="mt-3 grid text-sm font-semibold">
            <a className="flex min-h-11 items-center gap-2" href="/#features">Features <ArrowUpRight size={14}/></a>
            <Link className="flex min-h-11 items-center gap-2" to="/billing">Plans <ArrowUpRight size={14}/></Link>
            <Link className="flex min-h-11 items-center" to="/about">About StitchBook</Link>
            <Link className="flex min-h-11 items-center" to="/privacy">Privacy</Link>
            <Link className="flex min-h-11 items-center" to="/terms">Terms & support</Link>
            <Link className="flex min-h-11 items-center" to="/delete-account">Delete account</Link>
          </div>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Contact</h3>
          <div className="mt-3 grid text-sm text-muted">
            <a className="flex min-h-11 items-center gap-2" href="mailto:stitchbook3@gmail.com"><Mail size={17}/>stitchbook3@gmail.com</a>
            <a className="flex min-h-11 items-center gap-2" href="tel:+919705116606"><Phone size={17}/>+91 97051 16606</a>
            <span className="flex min-h-11 items-center gap-2"><MapPin size={17}/>Hyderabad, India</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-5 text-center text-xs text-muted">© {new Date().getFullYear()} StitchBook. Built for better shop days.</div>
    </footer>
  );
}
export default Footer;
