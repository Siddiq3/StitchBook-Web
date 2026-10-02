import { Link } from 'react-router-dom';

const baseClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-2.5 text-sm font-semibold tracking-[-0.01em] transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none';

const variants = {
  primary: 'bg-brass text-white shadow-[0_8px_22px_rgba(47,91,211,.20)] hover:bg-midnight hover:shadow-[0_10px_26px_rgba(47,91,211,.24)]',
  brass: 'bg-brass text-white shadow-[0_8px_22px_rgba(47,91,211,.20)] hover:bg-midnight hover:shadow-[0_10px_26px_rgba(47,91,211,.24)]',
  secondary: 'border-border bg-white text-ink shadow-sm hover:border-ink/20 hover:bg-bone',
  outline: 'border-border bg-transparent text-ink hover:border-brass/30 hover:bg-mist',
  ghost: 'bg-transparent text-muted hover:bg-mist hover:text-ink',
  destructive: 'bg-rosewood text-white shadow-sm hover:brightness-95',
};

function Button({ children, className = '', href, to, variant = 'primary', disabled = false, loading = false, ...props }) {
  const unavailable = disabled || loading;
  const classes = [baseClass, variants[variant] || variants.primary, className].filter(Boolean).join(' ');

  if (to || href) {
    if (unavailable) {
      return (
        <span className={classes + ' cursor-not-allowed opacity-50'} aria-disabled="true" aria-busy={loading || undefined}>
          {children}
        </span>
      );
    }

    return to
      ? <Link className={classes} to={to} {...props}>{children}</Link>
      : <a className={classes} href={href} {...props}>{children}</a>;
  }

  return (
    <button className={classes} type="button" disabled={unavailable} aria-busy={loading || undefined} {...props}>
      {children}
    </button>
  );
}

export default Button;
