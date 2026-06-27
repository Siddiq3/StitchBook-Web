import { Link } from 'react-router-dom';

function LogoMark({ className = '' }) {
  return (
    <span className={`inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-brass shadow-sm ${className}`}>
      <img
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
        src="/stitchbook-app-icon.png"
      />
    </span>
  );
}

function Logo({ dark = false }) {
  const textColor = dark ? 'text-bone' : 'text-ink';

  return (
    <Link className="flex items-center gap-3" to="/">
      <LogoMark className={dark ? 'bg-bone text-ink' : ''} />
      <span className={`text-2xl font-extrabold ${textColor}`}>StitchBook</span>
    </Link>
  );
}

export { LogoMark };
export default Logo;
