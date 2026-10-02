import PageShell from '../components/PageShell.jsx';

function PrivacyPage() {
  return (
    <PageShell>
      <section className="legal-page">
        <article className="legal-card">
          <p className="section-eyebrow">Privacy</p>
          <h1 className="mt-3 font-semibold">Privacy policy</h1>
          <p className="mt-5 leading-7">StitchBook stores the account, shop, customer, measurement, order, staff, and payment-record information that you enter so the service can provide its features.</p>

          <h2 className="mt-9 text-xl font-semibold">Sign-in and account data</h2>
          <p className="mt-3 leading-7">Google sign-in supplies basic profile information such as your name, email address, and profile image. A mobile number is stored when you provide or verify it. Entering a number alone does not verify it.</p>

          <h2 className="mt-9 text-xl font-semibold">Service providers</h2>
          <p className="mt-3 leading-7">StitchBook uses service providers for hosting, authentication, messaging, data storage, and subscription payments. Payment credentials are handled by the payment provider; StitchBook stores identifiers and status needed to record a subscription.</p>

          <h2 className="mt-9 text-xl font-semibold">Your choices</h2>
          <p className="mt-3 leading-7">You can update account and shop information in the app. To request account deletion, follow the instructions on the <a className="font-semibold text-brass underline" href="/delete-account">delete account page</a>.</p>

          <h2 className="mt-9 text-xl font-semibold">Contact</h2>
          <p className="mt-3 leading-7">For privacy questions, email <a className="font-semibold text-brass underline" href="mailto:stitchbook3@gmail.com">stitchbook3@gmail.com</a>.</p>
        </article>
      </section>
    </PageShell>
  );
}

export default PrivacyPage;
