import { Link } from 'react-router-dom';
const baseClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50';
const variants = {
  primary: 'bg-brass text-white hover:bg-midnight',
  secondary: 'border border-border bg-white text-ink hover:border-brass hover:bg-mist',
  brass: 'bg-brass text-white hover:bg-midnight',
  ghost: 'text-muted hover:bg-linen hover:text-ink',
};
function Button({ children, className = '', href, to, variant = 'primary', disabled = false, loading = false, ...props }) {
  const unavailable = disabled || loading;
  const classes = `${baseClass} ${variants[variant] || variants.primary} ${className}`;
  if (to || href) {
    if (unavailable) return <span className={`${classes} cursor-not-allowed opacity-50`} aria-disabled="true" aria-busy={loading}>{children}</span>;
    return to ? <Link className={classes} to={to} {...props}>{children}</Link> : <a className={classes} href={href} {...props}>{children}</a>;
  }
  return <button className={classes} type="button" disabled={unavailable} aria-busy={loading || undefined} {...props}>{children}</button>;
}
export default Button;
