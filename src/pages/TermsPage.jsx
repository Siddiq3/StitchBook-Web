import PageShell from '../components/PageShell.jsx';

export default function TermsPage() {
  return (
    <PageShell>
      <section className="legal-page">
        <article className="legal-card">
          <p className="section-eyebrow">Service information</p>
          <h1 className="mt-3 font-semibold">Terms and support</h1>
          <p className="mt-5 leading-7">StitchBook helps tailoring businesses manage their shop records. Contact support for the terms applicable to your account, subscription, refunds, or a billing dispute.</p>

          <div className="mt-8 rounded-2xl border border-border bg-bone p-5">
            <p className="text-sm font-semibold text-ink">Need help with your account or billing?</p>
            <a className="mt-2 inline-flex min-h-10 items-center font-semibold text-brass underline" href="mailto:stitchbook3@gmail.com">stitchbook3@gmail.com</a>
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
