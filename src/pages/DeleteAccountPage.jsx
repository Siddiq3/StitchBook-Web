import DeleteAccountForm from '../components/DeleteAccountForm.jsx';
import PageShell from '../components/PageShell.jsx';

function DeleteAccountPage() {
  return (
    <PageShell>
      <section className="legal-page">
        <article className="legal-card">
          <p className="section-eyebrow">Account controls</p>
          <h1 className="mt-3 font-semibold">Delete your StitchBook account</h1>
          <p className="mt-5 leading-7">You can request deletion by email or, when signed in, use the secure deletion controls below.</p>

          <div className="mt-7 rounded-2xl border border-border bg-bone p-5">
            <p className="text-sm font-semibold text-ink">Email request</p>
            <p className="mt-2 leading-7">Email <a className="font-semibold text-brass underline" href="mailto:stitchbook3@gmail.com?subject=StitchBook%20account%20deletion%20request">stitchbook3@gmail.com</a> from the address associated with your account and ask for account deletion.</p>
            <p className="mt-3 leading-7">If you sign in by mobile number, include that number so the account can be identified. Do not send passwords, OTPs, or payment credentials.</p>
          </div>

          <h2 className="mt-9 text-xl font-semibold">What the request covers</h2>
          <p className="mt-3 leading-7">The request covers your StitchBook account and associated shop data. Support will confirm any records that cannot be removed immediately because they are needed for security, payment reconciliation, or legal obligations.</p>

          <DeleteAccountForm />
        </article>
      </section>
    </PageShell>
  );
}

export default DeleteAccountPage;
