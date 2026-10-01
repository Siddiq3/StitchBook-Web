import PageShell from '../components/PageShell.jsx';

function DeleteAccountPage() {
  return (
    <PageShell>
      <main className="bg-bone px-4 py-14 text-ink sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl rounded-2xl border border-ink/10 bg-white p-6 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-brass">Account controls</p>
          <h1 className="mt-3 text-3xl font-semibold">Delete your StitchBook account</h1>
          <p className="mt-5 leading-7 text-muted">Email <a className="font-semibold text-brass underline" href="mailto:stitchbook3@gmail.com?subject=StitchBook%20account%20deletion%20request">stitchbook3@gmail.com</a> from the email address associated with your account and ask for account deletion.</p>
          <p className="mt-4 leading-7 text-muted">If you sign in by mobile number, include that number so the account can be identified. Do not send passwords, OTPs, or payment credentials.</p>
          <h2 className="mt-8 text-xl font-semibold">What the request covers</h2>
          <p className="mt-3 leading-7 text-muted">The request covers your StitchBook account and associated shop data. Support will confirm any records that cannot be removed immediately because they are needed for security, payment reconciliation, or legal obligations.</p>
        </article>
      </main>
    </PageShell>
  );
}

export default DeleteAccountPage;
