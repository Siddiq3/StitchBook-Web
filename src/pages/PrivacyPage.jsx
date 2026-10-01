import PageShell from '../components/PageShell.jsx';

function PrivacyPage() {
  return (
    <PageShell>
      <main className="bg-bone px-4 py-14 text-ink sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-white p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-brass">Privacy</p>
          <h1 className="mt-3 text-3xl font-semibold">Privacy policy</h1>
          <p className="mt-5 leading-7 text-muted">StitchBook stores the account, shop, customer, measurement, order, staff, and payment-record information that you enter so the service can provide its features.</p>
          <h2 className="mt-8 text-xl font-semibold">Sign-in and account data</h2>
          <p className="mt-3 leading-7 text-muted">Google sign-in supplies basic profile information such as your name, email address, and profile image. A mobile number is stored when you provide or verify it. Entering a number alone does not verify it.</p>
          <h2 className="mt-8 text-xl font-semibold">Service providers</h2>
          <p className="mt-3 leading-7 text-muted">StitchBook uses service providers for hosting, authentication, messaging, data storage, and subscription payments. Payment credentials are handled by the payment provider; StitchBook stores identifiers and status needed to record a subscription.</p>
          <h2 className="mt-8 text-xl font-semibold">Your choices</h2>
          <p className="mt-3 leading-7 text-muted">You can update account and shop information in the app. To request account deletion, follow the instructions on the <a className="font-semibold text-brass underline" href="/delete-account">delete account page</a>.</p>
          <h2 className="mt-8 text-xl font-semibold">Contact</h2>
          <p className="mt-3 leading-7 text-muted">For privacy questions, email <a className="font-semibold text-brass underline" href="mailto:stitchbook3@gmail.com">stitchbook3@gmail.com</a>.</p>
        </article>
      </main>
    </PageShell>
  );
}

export default PrivacyPage;
