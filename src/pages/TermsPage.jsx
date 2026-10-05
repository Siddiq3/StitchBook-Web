import PageShell from '../components/PageShell.jsx';

const EFFECTIVE_DATE = '5 October 2026';

function Section({ id, title, children }) {
  return (
    <>
      <h2 id={id} className="mt-9 text-xl font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 leading-7">{children}</div>
    </>
  );
}

export default function TermsPage() {
  return (
    <PageShell>
      <section className="legal-page">
        <article className="legal-card">
          <p className="section-eyebrow">Service information</p>
          <h1 className="mt-3 font-semibold">Terms of service</h1>
          <p className="mt-3 text-sm text-muted">Effective {EFFECTIVE_DATE}</p>
          <p className="mt-5 leading-7">
            These terms apply when you use StitchBook, the shop management app and website for tailoring businesses.
            By creating an account you agree to them.
          </p>

          <Section title="Your account">
            <p>You must be at least 18 and give accurate details. Keep your password private; you are responsible for activity on your account. A shop owner may create staff logins and is responsible for the access they give to staff.</p>
          </Section>

          <Section title="Your data">
            <p>The shop records you enter belong to you. You are responsible for having permission to store your customers’ and staff’s details. We handle all data as described in our <a className="font-semibold text-brass underline" href="/privacy">privacy policy</a>.</p>
          </Section>

          <Section title="Acceptable use">
            <p>Do not misuse StitchBook: no unlawful use, no attempts to access other shops’ data, no disrupting the service, and no reselling it without our written permission.</p>
          </Section>

          <Section id="plans" title="Free trial and plans">
            <p>New shops get a 10-day free trial. After that, a paid plan is needed to add or change records; your existing data stays safe and readable.</p>
            <p>Plans are paid in advance for 30 days at a time: Basic ₹299, Team ₹399 and Pro ₹599 (prices in Indian rupees, inclusive of any applicable taxes unless stated otherwise at checkout). Plans do <strong>not</strong> renew automatically. You choose whether to pay again when a period ends. Plans are purchased on the StitchBook website; payments are processed by Cashfree Payments.</p>
          </Section>

          <Section id="refunds" title="Cancellation and refunds">
            <p>Because plans do not auto-renew, there is nothing to cancel: simply do not renew, and access continues until the end of the period you paid for.</p>
            <p>Payments are generally non-refundable once a plan period has started. If you were charged twice, charged for a failed or incomplete payment, or charged in error, email us within 7 days of the payment and we will refund the incorrect amount to your original payment method within 7 working days of approval.</p>
          </Section>

          <Section title="Payments from your customers">
            <p>If you send payment links to your own customers, the payment is between you and your customer. StitchBook records the payment for you but is not a party to that sale, its pricing or its refunds.</p>
          </Section>

          <Section title="Service availability and changes">
            <p>We work to keep StitchBook available and your data safe, but the service is provided “as is” and may occasionally be unavailable for maintenance or reasons outside our control. We may update features or these terms; we will notify you of significant changes in advance.</p>
          </Section>

          <Section title="Limitation of liability">
            <p>To the extent permitted by law, StitchBook is not liable for indirect or consequential losses, and our total liability for any claim is limited to the amount you paid us in the 3 months before the claim.</p>
          </Section>

          <Section title="Ending your account">
            <p>You can delete your account at any time (see <a className="font-semibold text-brass underline" href="/delete-account">account deletion</a>). We may suspend accounts that break these terms.</p>
          </Section>

          <Section title="Governing law">
            <p>These terms are governed by the laws of India. Courts in Hyderabad, Telangana have jurisdiction over any dispute.</p>
          </Section>

          <div className="mt-8 rounded-2xl border border-border bg-bone p-5">
            <p className="text-sm font-semibold text-ink">Need help with your account or billing?</p>
            <a className="mt-2 inline-flex min-h-10 items-center font-semibold text-brass underline" href="mailto:stitchbook3@gmail.com">stitchbook3@gmail.com</a>
            <p className="mt-1 text-sm text-muted">+91 97051 16606 · Hyderabad, Telangana, India</p>
          </div>

          <div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold">
            <a className="text-brass underline" href="/privacy">Privacy policy</a>
            <a className="text-brass underline" href="/delete-account">Account deletion</a>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
