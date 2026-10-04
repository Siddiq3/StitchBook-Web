function SectionHeading({ eyebrow, title, description, align = 'center' }) {
  const centered = align === 'center';

  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3 text-balance font-sans text-3xl font-semibold leading-[1.12] tracking-[-0.035em] text-ink sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}

export default SectionHeading;
