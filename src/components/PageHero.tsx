export default function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-forest text-natural-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">{eyebrow}</p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-natural-white/80">{description}</p>
        )}
      </div>
    </section>
  );
}
