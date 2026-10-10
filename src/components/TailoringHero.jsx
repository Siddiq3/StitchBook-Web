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

function ShopSkyline() {
  return <svg className="th-skyline" viewBox="0 0 1440 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
    {[100,180,125,230,160,290,210,340,170].map((height, i) => <g key={i}>
      <rect x={i * 160 + 12} y={400 - height} width="130" height={height} rx="5" fill="#93c5fd" />
      <path d={`M${i * 160 + 24} ${400 - height}v-12h106v12`} fill="#bfdbfe" />
      {Array.from({ length: Math.floor((height - 30) / 32) }, (_, row) => [0,1,2].map(col =>
        <rect key={`${row}-${col}`} x={i * 160 + 28 + col * 34} y={420 - height + row * 32} width="22" height="15" rx="2" fill="#f8fbff" />))}
    </g>)}
  </svg>;
}

export default function TailoringHero({ downloadUrl, appCtaLabel }) {
  const [selected, setSelected] = useState(SHOPS[0]);
  return <section className="th-hero" aria-labelledby="tailoring-hero-title">
    <div className="lp-container th-grid">
      <ShopSkyline />
      <div className="th-copy">
        <div className="th-heading">
          <p className="th-eyebrow">Made for Indian tailoring businesses</p>
          <h1 id="tailoring-hero-title" aria-label="The easier way to manage your tailoring shops, boutiques, alteration shops and fashion studios.">
            The easier way to manage your{' '}
            <span className="th-rotator" aria-hidden="true">{SHOPS.map((shop, i) =>
              <span key={shop} className="th-word" style={{ '--word-delay': `${i === 0 ? 0 : (i - SHOPS.length) * 3}s` }}>{shop}.</span>)}</span>
          </h1>
          <p className="th-intro">Orders, measurements, staff work and payments. One app.</p>
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
