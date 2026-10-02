import { ArrowRight, LayoutDashboard, LogIn, LogOut, Menu, X } from 'lucide-react';
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
    'nav-link ' + (isActive ? 'nav-link-active' : '');

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <header className="site-header sticky top-0 z-40">
      <nav className="site-nav">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          <a className="nav-link" href="/#features">Product</a>
          <a className="nav-link" href="/#plans">Pricing</a>
          <NavLink className={navLinkClass} to="/about">Our story</NavLink>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {isLoggedIn ? (
            <>
              <div className="account-chip" title={userLabel}>
                <span className="account-avatar">{initials}</span>
                <span className="max-w-36 truncate">{userLabel}</span>
              </div>
              <Button to="/dashboard" variant="secondary">
                <LayoutDashboard size={17} />
                Dashboard
              </Button>
              <Button onClick={handleLogout} variant="ghost">
                <LogOut size={17} />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button to="/login" variant="ghost">Sign in</Button>
              <Button to="/billing" variant="primary">
                Get started
                <ArrowRight size={16} />
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {!isLoggedIn ? (
            <Button className="rounded-full px-4 text-xs" to="/login" variant="secondary">
              <LogIn size={15} />
              Sign in
            </Button>
          ) : (
            <Button className="rounded-full px-3" to="/dashboard" variant="secondary" aria-label="Open dashboard">
              <span className="account-avatar h-7 w-7 text-[11px]">{initials}</span>
            </Button>
          )}

          <button
            aria-label="Toggle navigation"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="nav-menu-button"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div id="mobile-navigation" className="mobile-nav lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6">
            <div className="grid gap-1">
              <a className="mobile-nav-link" href="/#features" onClick={() => setOpen(false)}>Product</a>
              <a className="mobile-nav-link" href="/#plans" onClick={() => setOpen(false)}>Pricing</a>
              <NavLink className="mobile-nav-link" onClick={() => setOpen(false)} to="/about">Our story</NavLink>
            </div>

            {isLoggedIn ? (
              <div className="rounded-2xl border border-border bg-white p-3 shadow-soft">
                <div className="flex min-h-11 items-center gap-3 rounded-xl bg-bone px-3">
                  <span className="account-avatar">{initials}</span>
                  <span className="min-w-0 truncate text-sm font-semibold text-ink">{userLabel}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button onClick={() => setOpen(false)} to="/dashboard" variant="primary">
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Button>
                  <Button onClick={handleLogout} variant="secondary">
                    <LogOut size={17} />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-white p-3 shadow-soft">
                <p className="px-1 text-sm leading-6 text-muted">
                  Run daily shop work in the StitchBook app and manage your plan on the web.
                </p>
                <Button className="mt-3 w-full" onClick={() => setOpen(false)} to="/login" variant="primary">
                  <LogIn size={17} />
                  Sign in
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
