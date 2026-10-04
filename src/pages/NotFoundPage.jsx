import { ArrowLeft, Mail } from 'lucide-react';
import Button from '../components/Button.jsx';
import PageShell from '../components/PageShell.jsx';

export default function NotFoundPage() {
  return <PageShell>
    <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="section-eyebrow">404 · Page not found</p>
      <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">We couldn’t find this page.</h1>
      <p className="mt-5 leading-7 text-muted">The link may be incorrect or the page may have moved. You can return home or contact us for help.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/"><ArrowLeft size={17} />Back to home</Button>
        <Button href="mailto:stitchbook3@gmail.com" variant="secondary"><Mail size={17} />Contact support</Button>
      </div>
    </section>
  </PageShell>;
}
