import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const baseClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold tracking-[-0.01em] transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50';
const variants = {
  primary: 'bg-ink text-white shadow-sm hover:bg-midnight hover:shadow-soft',
  secondary: 'border border-border bg-white text-ink shadow-sm hover:border-ink/20 hover:bg-bone',
  brass: 'bg-brass text-white shadow-sm hover:bg-[#984d31] hover:shadow-soft',
  ghost: 'text-ink hover:bg-linen',
  destructive: 'bg-rosewood text-white hover:brightness-95',
};

function Button({ children, className = '', href, to, variant = 'primary', disabled = false, loading = false, ...props }) {
  const unavailable = disabled || loading;
  const classes = `${baseClass} ${variants[variant] || variants.primary} ${className}`;
  const content = loading ? <><Loader2 className="animate-spin" size={16} />{children}</> : children;

  if (to || href) {
    if (unavailable) return <span className={`${classes} cursor-not-allowed opacity-50`} aria-disabled="true" aria-busy={loading}>{content}</span>;
    return to ? <Link className={classes} to={to} {...props}>{content}</Link> : <a className={classes} href={href} {...props}>{content}</a>;
  }

  return <button className={classes} type="button" disabled={unavailable} aria-busy={loading || undefined} {...props}>{content}</button>;
}
export default Button;
