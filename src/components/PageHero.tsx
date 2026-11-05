import Image from "next/image";

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image: { src: string; alt: string };
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest text-natural-white">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      {/* Forest-tinted scrim so header copy stays legible over the photo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-dark/95 via-forest-dark/85 to-forest-dark/55"
      />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <p className="eyebrow text-sm uppercase text-harvest-gold">{eyebrow}</p>
        <h1 className="mt-2 font-heading text-4xl sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-natural-white/80">{description}</p>
        )}
      </div>
    </section>
  );
}
