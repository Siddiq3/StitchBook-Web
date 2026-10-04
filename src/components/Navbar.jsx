import { ArrowRight, ChevronDown, LayoutDashboard, LogIn, LogOut, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuthToken, getSavedUser, logout } from '../api/authApi.js';
import Button from './Button.jsx';
import Logo from './Logo.jsx';

function getInitials(user) {
  const source = user?.name || user?.email || 'Account';
  return source.split(/[\\s@]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const isLoggedIn = Boolean(getAuthToken());
  const user = getSavedUser();
  const userLabel = user?.name || user?.email || 'Account';
  const initials = getInitials(user);
  const navLinkClass = ({ isActive }) =>
    `relative flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold transition ${isActive ? 'bg-white text-ink shadow-sm' : 'text-muted hover:bg-white/70 hover:text-ink'}`;

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="site-header sticky top-0 z-40 border-b text-ink">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3.5 sm:px-6 lg:px-8">
        <Logo />
        <div className="hidden items-center rounded-xl border border-border/80 bg-bone/80 p-1 lg:flex">
          <a className="flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-muted hover:bg-white hover:text-ink" href="/#features">Product</a>
          <a className="flex min-h-10 items-center rounded-lg px-3 text-sm font-semibold text-muted hover:bg-white hover:text-ink" href="/#plans">Pricing</a>
          <NavLink className={navLinkClass} to="/about">About</NavLink>
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          {isLoggedIn ? (
            <>
              <span className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-white px-3 shadow-sm">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-[11px] font-bold text-white">{initials}</span>
                <span className="max-w-32 truncate text-sm font-semibold text-muted">{userLabel}</span>
                <ChevronDown size={14} className="text-muted" />
              </span>
              <Button to="/dashboard" variant="primary"><LayoutDashboard size={17} />Dashboard</Button>
              <Button onClick={handleLogout} variant="ghost"><LogOut size={17} />Logout</Button>
            </>
          ) : (
            <>
              <Button to="/login" variant="ghost">Sign in</Button>
              <Button to="/billing" variant="brass">Get started <ArrowRight size={16} /></Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          {!isLoggedIn && <Button className="px-3 text-xs" to="/login" variant="ghost"><LogIn size={15} />Sign in</Button>}
          <button aria-label="Toggle navigation" aria-expanded={open} aria-controls="mobile-navigation" className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-white shadow-sm" onClick={() => setOpen((value) => !value)} type="button">{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </nav>
      <AnimatePresence initial={false}>
        {open && (
        <motion.div
          id="mobile-navigation"
          className="border-t border-border bg-bone/95 px-4 py-4 backdrop-blur lg:hidden"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto grid max-w-7xl gap-2">
            <a className="flex min-h-11 items-center rounded-xl px-3 font-semibold text-muted hover:bg-white hover:text-ink" href="/#features" onClick={() => setOpen(false)}>Product</a>
            <a className="flex min-h-11 items-center rounded-xl px-3 font-semibold text-muted hover:bg-white hover:text-ink" href="/#plans" onClick={() => setOpen(false)}>Pricing</a>
            <NavLink className="flex min-h-11 items-center rounded-xl px-3 font-semibold text-muted hover:bg-white hover:text-ink" onClick={() => setOpen(false)} to="/about">About</NavLink>
            <div className="mt-2 border-t border-border pt-3">
              {isLoggedIn ? (
                <div className="grid gap-2">
                  <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm"><span className="grid h-9 w-9 place-items-center rounded-lg bg-ink text-xs font-bold text-white">{initials}</span><span className="min-w-0 flex-1 truncate text-sm font-semibold">{userLabel}</span></div>
                  <Button className="w-full" onClick={() => setOpen(false)} to="/dashboard"><LayoutDashboard size={17} />Dashboard</Button>
                  <Button className="w-full" onClick={handleLogout} variant="secondary"><LogOut size={17} />Logout</Button>
                </div>
              ) : <Button className="w-full" onClick={() => setOpen(false)} to="/billing" variant="brass">Choose a plan <ArrowRight size={16} /></Button>}
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
}
export default Navbar;
