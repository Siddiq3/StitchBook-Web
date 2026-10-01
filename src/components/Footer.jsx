import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
function Footer() {
  return <footer className="border-t border-border bg-white text-ink">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
      <div><Logo /><p className="mt-4 max-w-sm text-sm leading-6 text-muted">Manage daily shop work in the app. Your account and subscription are available here.</p></div>
      <div><h3 className="text-sm font-semibold">Explore</h3><div className="mt-3 grid gap-1 text-sm text-muted">
        <a className="flex min-h-11 items-center hover:text-brass" href="/#features">Product</a>
        <Link className="flex min-h-11 items-center hover:text-brass" to="/billing">Plans</Link>
        <Link className="flex min-h-11 items-center hover:text-brass" to="/about">About</Link>
        <Link className="flex min-h-11 items-center hover:text-brass" to="/privacy">Privacy</Link>
        <Link className="flex min-h-11 items-center hover:text-brass" to="/delete-account">Delete account</Link>
      </div></div>
      <div><h3 className="text-sm font-semibold">Contact</h3><div className="mt-3 grid gap-1 text-sm text-muted">
        <a className="flex min-h-11 items-center gap-2 hover:text-brass" href="mailto:stitchbook3@gmail.com"><Mail size={18} />stitchbook3@gmail.com</a>
        <a className="flex min-h-11 items-center gap-2 hover:text-brass" href="tel:+919705116606"><Phone size={18} />+91 97051 16606</a>
        <span className="flex min-h-11 items-center gap-2"><MapPin size={18} />Hyderabad, India</span>
      </div></div>
    </div><div className="border-t border-border px-4 py-5 text-center text-xs text-muted">© {new Date().getFullYear()} StitchBook. All rights reserved.</div>
  </footer>;
}
export default Footer;
