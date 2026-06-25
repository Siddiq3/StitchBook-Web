import { Link } from 'react-router-dom';

const baseClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition duration-200 focus:outline-none focus:ring-2 focus:ring-brass/40 focus:ring-offset-2 focus:ring-offset-bone';

const variants = {
  primary: 'bg-ink text-bone shadow-soft hover:bg-midnight',
  secondary: 'border border-ink/15 bg-white/70 text-ink hover:border-ink/30 hover:bg-white',
  brass: 'bg-brass text-white shadow-sm hover:bg-[#a7793f]',
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
