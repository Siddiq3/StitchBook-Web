import { ArrowRight, Mail, MapPin, Phone, Ruler, Scissors, Users } from 'lucide-react';
import PageShell from '../components/PageShell.jsx';
import Button from '../components/Button.jsx';
const principles = [{
  icon: Scissors,
  number: '01',
  title: 'Built around your craft.',
  description: 'A tailoring shop has its own rhythm. Customers, outfit measurements, cutting, stitching, and delivery belong in one connected workflow.'
}, {
  icon: Ruler,
  number: '02',
  title: 'Care in every detail.',
  description: 'The right measurement. A remembered preference. A clear payment record. Small details make the experience better for you and your customers.'
}, {
  icon: Users,
  number: '03',
  title: 'Space for your whole team.',
  description: 'Work independently with Basic, or bring your staff into the picture with Team and Pro. Keep assignments and order progress together.'
}];
export default function AboutPage() {
  return <PageShell><div className="landing about-editorial">
    <section className="landing-container about-intro"><p className="eyebrow">THE STORY BEHIND STITCHBOOK</p><h1>Made for the people<br />who make <em>the perfect fit.</em></h1><div className="about-statement"><Scissors size={30} strokeWidth={1.3} /><p>Tailoring is personal. Your tools should feel that way, too. StitchBook helps independent tailors, boutique owners, and fashion designers bring a little clarity to a busy shop.</p></div></section>
    <section className="craft-section"><div className="craft-photo"><img src="/images/tailoring-craft.webp" alt="A tailor carefully sewing ivory linen" width="1536" height="1024" loading="lazy" /><span>BUILT WITH EVERYDAY CRAFT IN MIND.</span></div><div className="craft-copy"><p className="eyebrow">A SIMPLE PURPOSE</p><h2>Less searching.<br />More creating.<br /><em>Better days.</em></h2><p>Customer details in one place. Measurements ready for the next visit. Orders with clear progress and delivery dates. Payments you can follow.</p><p>Our purpose is simple: help you spend less time keeping track and more time doing the work you love. Manage your shop in the mobile app and your subscription here on the website.</p><Button className="mt-8" to="/billing">Find your plan<ArrowRight size={16} /></Button></div></section>
    <section className="landing-container feature-section"><p className="eyebrow">WHAT WE BUILD FOR</p><h2 className="mt-5">The everyday details.<br /><em>The bigger picture.</em></h2><div className="feature-editorial about-principles">{principles.map(({
            icon: Icon,
            number,
            title,
            description
          }) => <article key={number}><div className="feature-top"><Icon size={25} strokeWidth={1.5} /><span>{number}</span></div><h3>{title}</h3><p>{description}</p></article>)}</div></section>
    <section className="about-contact"><div className="landing-container"><div><p className="eyebrow">LET’S TALK</p><h2>A real question?<br /><em>We’re here to help.</em></h2></div><div><a href="mailto:stitchbook3@gmail.com"><Mail size={18} />stitchbook3@gmail.com<ArrowRight size={17} /></a><a href="tel:+919705116606"><Phone size={18} />+91 97051 16606<ArrowRight size={17} /></a><p><MapPin size={18} />Hyderabad, India</p></div></div></section>
  </div></PageShell>;
}
