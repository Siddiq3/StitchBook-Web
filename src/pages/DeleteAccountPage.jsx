import DeleteAccountForm from '../components/DeleteAccountForm.jsx';
import PageShell from '../components/PageShell.jsx';

function DeleteAccountPage() {
  return (
    <PageShell>
      <section className="legal-page">
        <article className="legal-card">
          <p className="section-eyebrow">Account controls</p>
          <h1 className="mt-3 font-semibold">Delete your StitchBook account</h1>
          <p className="mt-5 leading-7">StitchBook is made by StitchBook, Hyderabad, India. You can delete your account in the app, on this page, or by email.</p>

          <h2 className="mt-9 text-xl font-semibold">Delete in the app</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 leading-7">
            <li>Open StitchBook and go to <strong>Settings</strong>.</li>
            <li>Tap <strong>Delete account</strong>.</li>
            <li>Enter your password, type DELETE, and confirm.</li>
          </ol>

          <div className="mt-7 rounded-2xl border border-border bg-bone p-5">
            <p className="text-sm font-semibold text-ink">Or request by email</p>
            <p className="mt-2 leading-7">Email <a className="font-semibold text-brass underline" href="mailto:stitchbook3@gmail.com?subject=StitchBook%20account%20deletion%20request">stitchbook3@gmail.com</a> from the address on your account and ask for account deletion. Include your mobile number if you have one on the account. We complete email requests within 30 days. Do not send passwords, OTPs or payment details.</p>
          </div>

          <h2 className="mt-9 text-xl font-semibold">What is deleted</h2>
          <p className="mt-3 leading-7">For a shop owner: your profile and login, your shop, and all of its customers, measurements, orders, payment records, staff records, notes and uploaded photos. You are signed out on every device. For a staff member: your profile and login; the shop’s business records stay with the shop owner.</p>

          <h2 className="mt-9 text-xl font-semibold">What is kept, and for how long</h2>
          <p className="mt-3 leading-7">Deleted data may remain in encrypted backups for up to 30 days before it is overwritten. Our payment provider (Cashfree Payments) keeps its own records of completed payments as required by Indian law. We keep nothing else.</p>

          <DeleteAccountForm />
        </article>
      </section>
    </PageShell>
  );
}

export default DeleteAccountPage;
