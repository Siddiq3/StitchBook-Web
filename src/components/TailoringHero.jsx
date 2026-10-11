import { Smartphone } from 'lucide-react';
import Button from './Button.jsx';

const SHOPS = ['Tailoring shops', 'Boutiques', 'Alteration shops', 'Fashion studios'];

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
  return <section className="th-hero" aria-labelledby="tailoring-hero-title">
    <div className="lp-container th-grid">
      <ShopSkyline />
      <div className="th-copy">
        <div className="th-heading">
          <h1 id="tailoring-hero-title" aria-label="The easier way to manage your tailoring shops, boutiques, alteration shops and fashion studios.">
            The easier way to manage your{' '}
            <span className="th-rotator" aria-hidden="true">{SHOPS.map((shop, i) =>
              <span key={shop} className="th-word" style={{ '--word-delay': `${i === 0 ? 0 : (i - SHOPS.length) * 3}s` }}>{shop}.</span>)}</span>
          </h1>
          <p className="th-intro">Orders, measurements, staff work and payments. One app.</p>
        </div>
        <div className="th-selection">
          <div className="th-actions">
            <Button href={downloadUrl}><Smartphone size={18} aria-hidden="true" />{appCtaLabel}</Button>
            <Button href="#features" variant="secondary">Watch app demos</Button>
          </div>
          <p className="th-note">10-day free trial for new shops. <a href="#plans">See plans</a></p>
        </div>
      </div>
      <figure className="th-preview">
        <div className="th-orbit" aria-hidden="true" />
        <div className="th-phone"><img src="/media/orders.webp" alt="StitchBook order screen showing an order's details with fictional demo data" width="720" height="1600" fetchPriority="high" /></div>
        <figcaption>Real app screen · Fictional demo data</figcaption>
      </figure>
    </div>
  </section>;
}
