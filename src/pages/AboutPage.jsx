import { Mail, MapPin, Phone, Ruler, Scissors, Users } from 'lucide-react';
import PageShell from '../components/PageShell.jsx';
import Button from '../components/Button.jsx';
import '../styles/landing.css';

const principles = [{
  icon: Scissors,
  title: 'Built around your craft.',
  description: 'A tailoring shop has its own rhythm. Customers, outfit measurements, cutting, stitching and delivery belong in one connected workflow.'
}, {
  icon: Ruler,
  title: 'Care in every detail.',
  description: 'The right measurement. A remembered preference. A clear payment record. Small details make the experience better for you and your customers.'
}, {
  icon: Users,
  title: 'Space for your whole team.',
  description: 'Work on your own with Basic, or bring your staff in with Team and Pro. Keep assignments and order progress together.'
}];

export default function AboutPage() {
  return <PageShell><div className="lp">
    <section className="lp-container lp-about-intro">
      <h1>Made for the people who make the perfect fit.</h1>
      <p>Tailoring is personal. Your tools should feel that way, too. StitchBook helps independent tailors, boutique owners and fashion designers bring a little clarity to a busy shop.</p>
    </section>

    <section className="lp-container lp-how">
      <figure className="lp-how-photo"><img src="/images/tailoring-craft.webp" alt="A tailor carefully sewing ivory linen" width="1536" height="1024" loading="lazy" /></figure>
      <div>
        <h2>Less searching. More making.</h2>
        <p style={{ marginTop: 16 }}>Customer details in one place. Measurements ready for the next visit. Orders with clear progress and delivery dates. Payments you can follow.</p>
        <p style={{ marginTop: 12 }}>Run your shop in the mobile app, and manage your plan here on the website.</p>
        <div className="lp-actions"><Button to="/billing">Find your plan</Button></div>
      </div>
    </section>

    <section className="lp-container lp-principles">
      {principles.map(({ icon: Icon, title, description }) => (
        <article key={title}><Icon size={24} strokeWidth={1.75} /><h3>{title}</h3><p>{description}</p></article>
      ))}
      <article>
        <Mail size={24} strokeWidth={1.75} />
        <h3>Talk to us</h3>
        <p><a className="lp-link" href="mailto:stitchbook3@gmail.com">stitchbook3@gmail.com</a></p>
        <p><a className="lp-link" href="tel:+919705116606"><Phone size={16} />+91 97051 16606</a></p>
        <p style={{ display: 'flex', gap: 6, alignItems: 'center' }}><MapPin size={16} />Hyderabad, India</p>
      </article>
    </section>
  </div></PageShell>;
}
