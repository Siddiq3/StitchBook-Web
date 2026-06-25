import { Link } from 'react-router-dom';

function LogoMark({ className = '' }) {
  return (
    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-bone ${className}`}>
      <svg
        aria-hidden="true"
        className="h-7 w-7"
        fill="none"
        viewBox="0 0 40 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9 9.5c0-1.38 1.12-2.5 2.5-2.5H18c1.66 0 3 1.34 3 3v22c0-1.66-1.34-3-3-3h-6.5A2.5 2.5 0 0 1 9 26.5v-17Z"
          fill="currentColor"
          opacity="0.92"
        />
        <path
          d="M31 9.5c0-1.38-1.12-2.5-2.5-2.5H22c-1.66 0-3 1.34-3 3v22c0-1.66 1.34-3 3-3h6.5a2.5 2.5 0 0 0 2.5-2.5v-17Z"
          fill="currentColor"
          opacity="0.72"
        />
        <path
          d="M14 13.5c2.2 1.8 2.2 3.7 0 5.5 2.2 1.8 2.2 3.7 0 5.5"
          stroke="#b8843f"
          strokeLinecap="round"
          strokeWidth="2.2"
        />
        <path
          d="M26 13.5c-2.2 1.8-2.2 3.7 0 5.5-2.2 1.8-2.2 3.7 0 5.5"
          stroke="#b8843f"
          strokeLinecap="round"
          strokeWidth="2.2"
        />
        <path d="M20 9v23" stroke="#fffdf8" strokeLinecap="round" strokeWidth="1.6" />
      </svg>
    </span>
  );
}

function Logo({ dark = false }) {
  const textColor = dark ? 'text-bone' : 'text-ink';

  return (
    <Link className="flex items-center gap-3" to="/">
      <LogoMark className={dark ? 'bg-bone text-ink' : ''} />
      <span className={`font-serif text-2xl font-semibold ${textColor}`}>StitchBook</span>
    </Link>
  );
}

export { LogoMark };
export default Logo;
