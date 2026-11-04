import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import SolutionCtas from "@/components/SolutionCtas";
import { stockImages } from "@/lib/site-data";
import { solutionsContent } from "@/lib/solutions-content";

export function generateStaticParams() {
  return Object.keys(solutionsContent).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = solutionsContent[slug];
  return { title: content ? `${content.name} | AgriXpert` : "Solution | AgriXpert" };
}

function BulletList({ items, dotClass = "bg-agri-green" }: { items: string[]; dotClass?: string }) {
  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-xl bg-forest/5 p-4 text-sm text-forest-dark/80">
          <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function SolutionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = solutionsContent[slug];

  if (!content) {
    notFound();
  }

  const heroImage = stockImages[content.heroImageKey];

  return (
    <>
      <PageHero
        eyebrow={`Solution ${content.number}`}
        title={content.name}
        description={content.tagline}
        image={heroImage}
      />

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        {/* 1. Overview / Opportunity */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">Overview</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-forest">{content.overview.intro}</h2>
          <div className="mt-4 space-y-4 text-forest-dark/75">
            {content.overview.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-6 rounded-xl bg-forest px-6 py-4 font-heading text-lg font-semibold text-natural-white">
            {content.overview.proposition}
          </p>
        </div>

        <div className="relative mt-10 h-64 overflow-hidden rounded-2xl sm:h-80">
          <Image src={heroImage.src} alt={heroImage.alt} fill sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
        </div>

        {/* 2. Service sections */}
        {content.sections.map((section, i) => (
          <div key={section.heading} className="mt-16 border-t border-forest/10 pt-10">
            <h2 className="font-heading text-xl font-bold text-forest">{section.heading}</h2>
            <p className="mt-3 text-forest-dark/75">{section.intro}</p>
            <BulletList items={section.items} dotClass={i % 2 === 0 ? "bg-agri-green" : "bg-harvest-gold"} />
            {section.closing && <p className="mt-3 text-forest-dark/75">{section.closing}</p>}
          </div>
        ))}

        {/* 3. Who Benefits */}
        <div className="mt-16 border-t border-forest/10 pt-10">
          <h2 className="font-heading text-xl font-bold text-forest">Who Benefits?</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {content.whoBenefits.map((wb) => (
              <div key={wb.label} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
                <p className="font-semibold text-forest">{wb.label}</p>
                <p className="mt-1 text-sm text-forest-dark/70">{wb.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Partnership Opportunities */}
        <div className="mt-16 border-t border-forest/10 pt-10">
          <h2 className="font-heading text-xl font-bold text-forest">Partnership Opportunities</h2>
          <p className="mt-3 text-forest-dark/75">{content.partnerships.intro}</p>
          <BulletList items={content.partnerships.items} />
        </div>

        {/* 5. Call to Action */}
        <div className="mt-16 rounded-2xl bg-forest-dark px-6 py-10 text-center text-natural-white sm:px-10">
          <h2 className="font-heading text-2xl font-bold">{content.closing.headline}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-natural-white/80">{content.closing.body}</p>
          <div className="mx-auto mt-8 max-w-2xl">
            <SolutionCtas ctas={content.closing.ctas} />
          </div>
        </div>
      </section>
    </>
  );
}
