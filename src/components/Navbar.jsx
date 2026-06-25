import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Button from './Button.jsx';
import Logo from './Logo.jsx';

const downloadUrl = import.meta.env.VITE_APP_DOWNLOAD_URL || '#';

function Navbar() {
  const [open, setOpen] = useState(false);
  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition hover:text-ink ${isActive ? 'text-ink' : 'text-ink/62'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-bone/92 text-ink shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          <NavLink className={navLinkClass} to="/">Home</NavLink>
          <a className="text-sm font-semibold text-ink/62 transition hover:text-ink" href="/#features">Features</a>
          <a className="text-sm font-semibold text-ink/62 transition hover:text-ink" href="/#insights">Insights</a>
          <NavLink className={navLinkClass} to="/about">About</NavLink>
        </div>

        <div className="hidden md:block">
          <div className="flex items-center gap-3">
            <Button to="/login" variant="secondary">Login</Button>
            <Button href={downloadUrl} variant="brass">Download the App</Button>
          </div>
        </div>

        <button
          aria-label="Toggle navigation"
          className="rounded-lg border border-ink/10 bg-white/55 p-2 md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink/10 bg-bone px-4 py-5 shadow-sm md:hidden">
          <div className="grid gap-4">
            <NavLink className={navLinkClass} onClick={() => setOpen(false)} to="/">Home</NavLink>
            <a className="text-sm font-semibold text-ink/70" href="/#features" onClick={() => setOpen(false)}>Features</a>
            <a className="text-sm font-semibold text-ink/70" href="/#insights" onClick={() => setOpen(false)}>Insights</a>
            <NavLink className={navLinkClass} onClick={() => setOpen(false)} to="/about">About</NavLink>
            <Button className="mt-2 w-full" onClick={() => setOpen(false)} to="/login" variant="secondary">Login</Button>
            <Button className="mt-2 w-full" href={downloadUrl} variant="brass">Download the App</Button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
