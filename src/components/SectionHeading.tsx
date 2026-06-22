interface SectionHeadingProps {
  title: string;
  description?: string;
}

export function SectionHeading({ title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="text-sm uppercase tracking-[0.24em] text-brand-300">Munjum</p>
      <h2 className="mt-3 text-3xl font-semibold text-slate-100 sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-slate-400">{description}</p> : null}
    </div>
  );
}
