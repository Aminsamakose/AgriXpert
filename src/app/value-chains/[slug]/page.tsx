import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import ValueChainCtas from "@/components/ValueChainCtas";
import { valueChains, stockImages } from "@/lib/site-data";
import { valueChainContent, type ValueChainContent } from "@/lib/value-chain-content";
import { getPageContentOverride } from "@/lib/content";

export const instant = false;

export function generateStaticParams() {
  return valueChains.map((vc) => ({ slug: vc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const commodity = valueChains.find((vc) => vc.slug === slug);
  return { title: commodity ? `${commodity.name} Value Chain | AgriXpert` : "Value Chain | AgriXpert" };
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

export default async function ValueChainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const commodity = valueChains.find((vc) => vc.slug === slug);
  const override = await getPageContentOverride<ValueChainContent>("value_chain", slug);
  const content = override ?? valueChainContent[slug];

  if (!commodity || !content) {
    notFound();
  }

  const heroImage = stockImages[content.heroImageKey as keyof typeof stockImages] ?? stockImages.cropFieldsAerial;

  return (
    <>
      <PageHero eyebrow="Value Chain" title={content.name} description={content.tagline} image={heroImage} />

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
          {content.overview.proposition && (
            <p className="mt-6 rounded-xl bg-forest text-natural-white px-6 py-4 font-heading text-lg font-semibold">
              {content.overview.proposition}
            </p>
          )}
        </div>

        <div className="relative mt-10 h-64 overflow-hidden rounded-2xl sm:h-80">
          <Image src={heroImage.src} alt={heroImage.alt} fill sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
        </div>

        {/* 2. Production & Sourcing Locations */}
        <div className="mt-16 border-t border-forest/10 pt-10">
          <h2 className="font-heading text-xl font-bold text-forest">Production &amp; Sourcing Locations</h2>
          <p className="mt-3 text-forest-dark/75">{content.sourcing.intro}</p>
          <p className="mt-3 text-sm font-semibold text-forest-dark">Our sourcing strategy will consider:</p>
          <BulletList items={content.sourcing.factors} />
          <p className="mt-4 text-sm italic text-forest-dark/60">{content.sourcing.note}</p>
        </div>

        {/* 3. Farmer & Supplier Network */}
        <div className="mt-16 border-t border-forest/10 pt-10">
          <h2 className="font-heading text-xl font-bold text-forest">Farmer &amp; Supplier Network</h2>
          <p className="mt-3 text-forest-dark/75">{content.farmerNetwork.intro}</p>
          {content.farmerNetwork.groups.length > 0 && <BulletList items={content.farmerNetwork.groups} />}
          <p className="mt-3 text-forest-dark/75">{content.farmerNetwork.closing}</p>
        </div>

        {/* 4. Production Coordination */}
        <div className="mt-16 border-t border-forest/10 pt-10">
          <h2 className="font-heading text-xl font-bold text-forest">Production Coordination</h2>
          <p className="mt-3 text-forest-dark/75">{content.coordination.intro}</p>
          <BulletList items={content.coordination.items} dotClass="bg-harvest-gold" />
          <p className="mt-3 text-forest-dark/75">{content.coordination.closing}</p>
        </div>

        {/* 5. Aggregation & Storage */}
        <div className="mt-16 border-t border-forest/10 pt-10">
          <h2 className="font-heading text-xl font-bold text-forest">Aggregation &amp; Storage</h2>
          <p className="mt-3 text-forest-dark/75">{content.aggregation.intro}</p>
          <BulletList items={content.aggregation.items} />
          <p className="mt-3 text-forest-dark/75">{content.aggregation.closing}</p>
        </div>

        {/* 6. Quality Specifications */}
        <div className="mt-16 border-t border-forest/10 pt-10">
          <h2 className="font-heading text-xl font-bold text-forest">Quality Specifications</h2>
          <p className="mt-3 text-forest-dark/75">{content.quality.intro}</p>
          {content.quality.groups.map((group, i) => (
            <div key={group.label ?? i} className="mt-4">
              {group.label && <p className="text-sm font-semibold text-forest-dark">{group.label}</p>}
              <BulletList items={group.items} dotClass="bg-harvest-gold" />
            </div>
          ))}
          <p className="mt-3 text-sm italic text-forest-dark/60">{content.quality.closing}</p>
        </div>

        {/* 7. Processing & Market Opportunities */}
        <div className="mt-16 border-t border-forest/10 pt-10">
          <h2 className="font-heading text-xl font-bold text-forest">Processing &amp; Market Opportunities</h2>
          <p className="mt-3 text-forest-dark/75">{content.markets.intro}</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {content.markets.items.map((m) => (
              <div key={m.label} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
                <p className="font-semibold text-forest">{m.label}</p>
                <p className="mt-1 text-sm text-forest-dark/70">{m.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-forest-dark/75">{content.markets.closing}</p>
        </div>

        {/* 8. Partnership Opportunities */}
        <div className="mt-16 border-t border-forest/10 pt-10">
          <h2 className="font-heading text-xl font-bold text-forest">Partnership Opportunities</h2>
          <p className="mt-3 text-forest-dark/75">{content.partnerships.intro}</p>
          <BulletList items={content.partnerships.items} />
        </div>

        {/* 9. Call to Action */}
        <div className="mt-16 rounded-2xl bg-forest-dark px-6 py-10 text-center text-natural-white sm:px-10">
          <h2 className="font-heading text-2xl font-bold">{content.closing.headline}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-natural-white/80">{content.closing.body}</p>
          <div className="mx-auto mt-8 max-w-2xl">
            <ValueChainCtas commodity={content.name} />
          </div>
        </div>
      </section>
    </>
  );
}
