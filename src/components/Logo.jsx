import { Link } from 'react-router-dom';

function LogoMark({ className = '' }) {
  return (
    <span className={['logo-mark', className].filter(Boolean).join(' ')}>
      <img
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover"
        src="/stitchbook-app-icon.webp"
        width="128" height="128" decoding="async"
      />
    </span>
  );
}

function Logo({ dark = false }) {
  return (
    <Link className="brand-lockup" to="/" aria-label="StitchBook home">
      <LogoMark />
      <span className={dark ? 'brand-wordmark text-bone' : 'brand-wordmark text-ink'}>StitchBook</span>
    </Link>
  );
}

export { LogoMark };
export default Logo;
