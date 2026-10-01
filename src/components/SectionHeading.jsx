function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const centered = align === 'center';

  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wide text-brass">{eyebrow}</p>
      )}
      <h2 className="text-balance mt-3 font-sans text-2xl font-semibold leading-tight text-ink sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-muted md:text-lg">{description}</p>
      )}
    </div>
  );
}

export default SectionHeading;
