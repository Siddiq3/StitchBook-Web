import PageShell from '../components/PageShell.jsx';

const EFFECTIVE_DATE = '5 October 2026';

function Section({ title, children }) {
  return (
    <>
      <h2 className="mt-9 text-xl font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 leading-7">{children}</div>
    </>
  );
}

function PrivacyPage() {
  return (
    <PageShell>
      <section className="legal-page">
        <article className="legal-card">
          <p className="section-eyebrow">Privacy</p>
          <h1 className="mt-3 font-semibold">Privacy policy</h1>
          <p className="mt-3 text-sm text-muted">Effective {EFFECTIVE_DATE}</p>
          <p className="mt-5 leading-7">
            This policy explains how StitchBook (the StitchBook Android app and the StitchBook website) collects, uses,
            shares and protects information. StitchBook is a shop management tool for tailoring businesses in India.
          </p>

          <Section title="Information we collect">
            <p><strong>Account information:</strong> your name, email address and mobile number, and a securely hashed password (we never store your password itself).</p>
            <p><strong>Shop information:</strong> shop name, phone number and location that you enter.</p>
            <p><strong>Information you enter about your customers:</strong> customer names, phone numbers, email and address (optional), gender, body measurements, orders, delivery dates, prices and payment records.</p>
            <p><strong>Staff information:</strong> staff names, login email, phone number, role, pay details and work records that a shop owner enters.</p>
            <p><strong>Photos:</strong> images you choose to upload, such as garment or design photos. We only access the photos you pick.</p>
            <p><strong>Sign-in and security data:</strong> for each signed-in device we keep the IP address, device type and app or browser details, so you can see and sign out your devices and so we can protect accounts from misuse. Our servers also keep short-term technical logs (time, IP address, request type) for security and troubleshooting.</p>
            <p><strong>Payment information:</strong> when you pay for a subscription, or a customer pays through a payment link, the payment is handled by our payment provider. We receive the payment status, amount and reference IDs. We never receive or store card numbers, UPI PINs or bank login details.</p>
            <p>We do not collect your location, contacts or advertising ID, and the app contains no advertising or third-party analytics.</p>
          </Section>

          <Section title="How we use information">
            <p>To provide the service: keep your shop records, show orders and balances, let staff sign in with the access you give them, process subscriptions and payment links, send password reset codes, and keep accounts secure. We do not sell personal information or use it for advertising.</p>
          </Section>

          <Section title="Customer and staff data you enter">
            <p>When a shop owner stores details about their customers or staff, the shop owner decides what is stored and is responsible for having a valid reason to store it. StitchBook processes that data only to provide the service to the shop. Messages you send to customers through WhatsApp are sent from your own WhatsApp app; StitchBook does not read your WhatsApp messages.</p>
          </Section>

          <Section title="Who we share information with">
            <p>We share information only with service providers that run StitchBook for us, and only as needed for their task:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Render: application hosting</li>
              <li>Supabase: database and photo storage</li>
              <li>Upstash: secure sign-in sessions</li>
              <li>Resend: password reset emails</li>
              <li>Cashfree Payments: subscription and payment-link processing</li>
            </ul>
            <p>We may also disclose information if the law requires it, or to protect the safety of users and the service. We do not share data with advertisers or data brokers.</p>
          </Section>

          <Section title="How we protect information">
            <p>All data is sent over encrypted connections (HTTPS). Passwords are stored only as secure hashes. Sign-in tokens are kept in the device’s secure storage. Each shop can only access its own records, and staff only see what their role allows.</p>
          </Section>

          <Section title="How long we keep information">
            <p>We keep your information while your account is active. When you delete your account, your profile and the shop data you own are deleted straight away, including customers, measurements, orders, payment records and uploaded photos. Copies may remain in encrypted backups for up to 30 days before they are overwritten. Our payment provider keeps its own payment records as the law requires.</p>
          </Section>

          <Section title="Your choices and rights">
            <p>You can view and correct your account and shop information in the app. You can delete your account at any time in the app (Settings → Delete account) or on our <a className="font-semibold text-brass underline" href="/delete-account">delete account page</a>. You can also email us to ask for a copy of your data, a correction, or deletion. We respond within 30 days.</p>
          </Section>

          <Section title="Children">
            <p>StitchBook is a business tool for shop owners and their staff. It is not intended for anyone under 18, and we do not knowingly collect information from children.</p>
          </Section>

          <Section title="Changes to this policy">
            <p>If we change this policy we will update the effective date above. For significant changes we will also tell you in the app or by email.</p>
          </Section>

          <Section title="Contact and grievances">
            <p>For privacy questions, requests or complaints, email <a className="font-semibold text-brass underline" href="mailto:stitchbook3@gmail.com">stitchbook3@gmail.com</a> or call +91 97051 16606. StitchBook, Hyderabad, Telangana, India.</p>
          </Section>
        </article>
      </section>
    </PageShell>
  );
}

export default PrivacyPage;
