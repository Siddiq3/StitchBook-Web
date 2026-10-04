export default function PriceStatus({ loading, error, retry }) {
  if (loading) return <p role="status" className="my-4 text-sm text-muted">Loading current prices…</p>;
  if (error) return <div role="alert" className="my-4 rounded-xl bg-linen p-4 text-sm"><p>{error}</p><button type="button" onClick={retry} className="mt-2 min-h-11 font-semibold underline">Try again</button></div>;
  return null;
}
