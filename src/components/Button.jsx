import { Link } from 'react-router-dom';

const baseClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brass/40 focus:ring-offset-2 focus:ring-offset-bone active:translate-y-0';

const variants = {
  primary: 'bg-brass text-white shadow-soft hover:bg-midnight hover:shadow-glow',
  secondary: 'border border-ink/15 bg-white/86 text-ink shadow-sm hover:border-brass/35 hover:bg-white',
  brass: 'bg-plum text-white shadow-sm hover:bg-brass hover:shadow-glow',
  ghost: 'text-ink/70 hover:bg-white/65 hover:text-ink',
};

function Button({ children, className = '', href, to, variant = 'primary', ...props }) {
  const classes = `${baseClass} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link className={classes} to={to} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
}

export default Button;
