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
    <section className="relative isolate overflow-hidden bg-forest pb-16 text-natural-white sm:pb-20">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      {/* Duotone wash (forest + terracotta) instead of a flat directional
          scrim — reads as a considered photo treatment rather than a
          generic dark-overlay-for-contrast SaaS hero. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-dark/90 via-forest/80 to-harvest-gold/40 mix-blend-multiply"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-forest-dark/55"
      />
      <div className="mx-auto max-w-7xl px-6 pt-16 lg:px-10 lg:pt-20">
        <p className="eyebrow text-sm uppercase text-harvest-gold">{eyebrow}</p>
        <h1 className="mt-2 font-heading text-4xl sm:text-5xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-natural-white/80">{description}</p>
        )}
      </div>
      {/* Curved bottom edge so the hero resolves into the page body with a
          soft arc rather than a hard rectangular cut. */}
      <svg
        aria-hidden
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 -z-0 h-12 w-full text-background sm:h-16"
      >
        <path d="M0,80 C480,0 960,0 1440,80 L1440,80 L0,80 Z" fill="currentColor" />
      </svg>
    </section>
  );
}
