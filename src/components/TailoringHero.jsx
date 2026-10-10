import { useState } from 'react';
import { Check, ClipboardList, Ruler, Smartphone } from 'lucide-react';
import Button from './Button.jsx';

const SHOPS = ['Tailoring shops', 'Boutiques', 'Alteration shops', 'Fashion studios'];

function ShopIllustration({ index }) {
  return <svg viewBox="0 0 120 80" fill="none" aria-hidden="true">
    <ellipse cx="60" cy="74" rx="48" ry="4" fill="#e2edf9" />
    <rect x="24" y={index === 3 ? 18 : 28} width="72" height={index === 3 ? 54 : 44} rx="3" fill="#c3ddf8" />
    <path d="M20 28h80l-8-12H28Z" fill="#0072e5" />
    {[24,42,60,78].map(x => <path key={x} d={`M${x} 28h18v8a9 9 0 0 1-18 0Z`} fill={x === 24 || x === 60 ? '#93c5fd' : '#eaf3ff'} />)}
    <rect x="32" y="46" width="27" height="19" rx="2" fill="#f8fbff" />
    <rect x="68" y="46" width="18" height="26" rx="2" fill="#0072e5" />
    <path d="m38 50 5-3 3 3 3-3 5 3-3 5-2-1v8H43v-8l-2 1Z" fill="#93c5fd" />
  </svg>;
}

function TailoringBackdrop() {
  return <svg className="th-tailoring-backdrop" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
    <path d="M0 340Q180 210 360 320T720 300T1080 280T1440 330" fill="none" stroke="#60a5fa" strokeWidth="3" strokeDasharray="8 10" />
    {[0,360,720,1080].map(x => <g key={x} transform={`translate(${x} 0)`} stroke="#60a5fa" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(45 210) rotate(-18)">
        <circle cx="0" cy="35" r="18" fill="#eaf3ff" />
        <circle cx="45" cy="35" r="18" fill="#eaf3ff" />
        <path d="M12 22 68-70M33 22-24-70" fill="none" />
        <circle cx="23" cy="4" r="4" fill="#60a5fa" />
      </g>
      <g transform="translate(150 255) rotate(12)">
        <rect width="66" height="76" rx="8" fill="#bfdbfe" />
        <path d="M-5 0h76M-5 76h76M6 15h54M6 27h54M6 39h54M6 51h54M6 63h54" fill="none" />
        <path d="M66 60q40 0 42-32" fill="none" strokeWidth="2" />
      </g>
      <g transform="translate(265 135) rotate(18)">
        <path d="M0 0h38v154q0 30-38 30h-32v-32H0Z" fill="#dbeafe" />
        <path d="M12 12h14M12 32h8M12 52h14M12 72h8M12 92h14M12 112h8M12 132h14" fill="none" strokeWidth="3" />
      </g>
      <path d="m155 145 45-80-35 86Z" fill="#bfdbfe" strokeWidth="2" />
      <path d="M196 74q-45-36-80 10" fill="none" strokeWidth="2" />
    </g>)}
  </svg>;
}

export default function TailoringHero({ downloadUrl, appCtaLabel }) {
  const [selected, setSelected] = useState(SHOPS[0]);
  return <section className="th-hero" aria-labelledby="tailoring-hero-title">
    <div className="lp-container th-grid">
      <TailoringBackdrop />
      <div className="th-copy">
        <div className="th-heading">
          <p className="th-eyebrow">Made for Indian tailoring businesses</p>
          <h1 id="tailoring-hero-title" aria-label="The easier way to manage your tailoring shops, boutiques, alteration shops and fashion studios.">
            The easier way to manage your{' '}
            <span className="th-rotator" aria-hidden="true">{SHOPS.map((shop, i) =>
              <span key={shop} className="th-word" style={{ '--word-delay': `${i === 0 ? 0 : (i - SHOPS.length) * 3}s` }}>{shop}.</span>)}</span>
          </h1>
          <p className="th-benefit">Less notebook work. More time for your customers.</p>
        </div>
        <div className="th-selection">
          <fieldset className="th-types">
            <legend>I run a</legend>
            <div className="th-type-grid">{SHOPS.map((shop, i) => <label key={shop} className={`th-type${selected === shop ? ' is-selected' : ''}`}>
              <input type="radio" name="shop-type" value={shop} checked={selected === shop} onChange={() => setSelected(shop)} />
              <ShopIllustration index={i} />
              <span>{['Tailoring shop', 'Boutique', 'Alteration shop', 'Fashion studio'][i]}</span>
              {selected === shop && <Check className="th-type-check" size={16} aria-hidden="true" />}
            </label>)}</div>
          </fieldset>
          <div className="th-actions">
            <Button href={downloadUrl}><Smartphone size={18} aria-hidden="true" />{appCtaLabel}</Button>
            <Button href="#features" variant="secondary">Watch app demos</Button>
          </div>
          <p className="th-note">New shops get a 10-day free trial. Manage your shop in the mobile app.</p>
          <a className="lp-link th-plan-link" href="#plans">See plans</a>
        </div>
      </div>
      <figure className="th-preview">
        <div className="th-orbit" aria-hidden="true" />
        <div className="th-app-label"><span className="th-app-mark"><Ruler size={20} aria-hidden="true" /></span><span>StitchBook<strong>Your shop, at a glance</strong></span></div>
        <div className="th-phone"><img src="/media/orders.webp" alt="StitchBook order screen showing an order's details with fictional demo data" width="720" height="1600" fetchPriority="high" /></div>
        <div className="th-highlights">
          <div><ClipboardList size={18} aria-hidden="true" /><span>Orders & delivery<strong>Keep every order on track</strong></span></div>
          <div><Ruler size={18} aria-hidden="true" /><span>Saved measurements<strong>Find each customer's fit</strong></span></div>
        </div>
        <figcaption>Real app screen · Fictional demo data</figcaption>
      </figure>
    </div>
  </section>;
}
