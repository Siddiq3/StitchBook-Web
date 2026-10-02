import { ChevronDown, ArrowRight, LayoutDashboard, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuthToken, getSavedUser, logout } from '../api/authApi.js';
import Button from './Button.jsx';
import Logo from './Logo.jsx';

function getInitials(user) {
  const source = user?.name || user?.email || 'Account';
  return source
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(getAuthToken());
  const user = getSavedUser();
  const userLabel = user?.name || user?.email || 'Account';
  const initials = getInitials(user);
  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition hover:text-ink ${isActive ? 'text-ink' : 'text-muted'}`;

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="site-header sticky top-0 z-40 border-b border-ink/10 text-ink">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-8 lg:flex">
          <a className="text-sm font-semibold text-muted transition hover:text-ink" href="/#features">Product</a>
          <a className="text-sm font-semibold text-muted transition hover:text-ink" href="/#plans">Pricing</a>
          <NavLink className={navLinkClass} to="/about">Our story</NavLink>
        </div>

        <div className="hidden lg:block">
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/10 bg-white px-3 py-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-bone">
                    {initials}
                  </span>
                  <span className="hidden 2xl:block max-w-36 truncate text-sm font-semibold text-muted">{userLabel}</span>
                  <ChevronDown size={15} className="text-muted" />
                </span>
                <Button to="/dashboard" variant="secondary">
                  <LayoutDashboard size={17} />
                  Dashboard
                </Button>
                <Button onClick={handleLogout} variant="secondary">
                  <LogOut size={17} />
                  Logout
                </Button>
              </>
            ) : (
              <><Button to="/login" variant="primary">Sign in</Button><Button to="/billing" variant="secondary">Get started <ArrowRight size={16} /></Button></>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {isLoggedIn ? (
            <button
              aria-label="Open account menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brass text-xs font-semibold text-white"
              onClick={() => setOpen((value) => !value)}
              type="button"
            >
              {initials}
            </button>
          ) : (
            <Button className="min-h-11 rounded-full px-4 py-2 text-xs" to="/login" variant="primary">
              <LogIn size={15} />
              Login
            </Button>
          )}
          <button
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="min-h-11 min-w-11 rounded-xl border border-border bg-white p-2"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-navigation" className="border-t border-ink/10 bg-bone px-4 py-5 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-5">
            <div className="grid gap-2">
              <a className="min-h-11 flex items-center rounded-xl px-3 py-2 text-base font-semibold text-muted transition hover:bg-white hover:text-ink" href="/#features" onClick={() => setOpen(false)}>Product</a>
              <a className="min-h-11 flex items-center rounded-xl px-3 py-2 text-base font-semibold text-muted transition hover:bg-white hover:text-ink" onClick={() => setOpen(false)} href="/#plans">Pricing</a>
              <NavLink className="min-h-11 flex items-center rounded-xl px-3 py-2 text-base font-semibold text-muted transition hover:bg-white hover:text-ink" onClick={() => setOpen(false)} to="/about">About</NavLink>
            </div>
            {isLoggedIn ? (
              <div className="rounded-2xl border border-ink/10 bg-white p-3">
                <div className="inline-flex min-h-11 w-full items-center gap-2 rounded-full bg-mist px-3 py-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-bone">
                    {initials}
                  </span>
                  <span className="truncate text-sm font-semibold text-muted">{userLabel}</span>
                  <ChevronDown size={15} className="ml-auto text-muted" />
                </div>
                <Button className="mt-3 w-full" onClick={() => setOpen(false)} to="/dashboard" variant="primary">
                  <LayoutDashboard size={17} />
                  Dashboard
                </Button>
                <Button className="mt-2 w-full" onClick={handleLogout} variant="secondary">
                  <LogOut size={17} />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl border border-ink/10 bg-white p-3">
                <p className="px-1 text-sm font-semibold leading-6 text-muted">
                  Sign in to manage your subscription and download the mobile app.
                </p>
                <Button className="mt-3 w-full" onClick={() => setOpen(false)} to="/login" variant="primary">
                  <LogIn size={17} />
                  Login
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
