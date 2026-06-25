function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const centered = align === 'center';

  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && (
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brass">{eyebrow}</p>
      )}
      <h2 className="text-balance mt-3 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-ink/65 md:text-lg">{description}</p>
      )}
    </div>
  );
}

export default SectionHeading;
