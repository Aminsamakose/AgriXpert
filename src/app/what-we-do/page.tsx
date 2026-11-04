import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { solutions, stockImages } from "@/lib/site-data";
import { solutionsContent, type SolutionContent } from "@/lib/solutions-content";
import { getSiteContent, pick, getAllPageContentOverrides } from "@/lib/content";

export const instant = false;

export const metadata: Metadata = {
  title: "What We Do | AgriXpert",
};

const audiences = [
  { label: "For Farmers", body: "Access structured production opportunities, agricultural services and potential market linkages.", href: "/for-farmers" },
  { label: "For Buyers", body: "Source agricultural commodities through coordinated supplier and aggregation networks.", href: "/for-buyers" },
  { label: "For Investors", body: "Explore commercially viable opportunities across production, aggregation, mechanisation, storage and processing.", href: "/partnerships" },
];

export default async function WhatWeDoPage() {
  const content = await getSiteContent();
  const overrides = await getAllPageContentOverrides<SolutionContent>("solution");

  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title={pick(content, "what-we-do.hero.title", "Production, Aggregation, Mechanisation and Supply Chain Solutions")}
        description={pick(
          content,
          "what-we-do.hero.description",
          "AgriXpert connects every stage of the agricultural value chain into one coordinated commercial system — from farm to firm."
        )}
        image={{ src: pick(content, "what-we-do.hero.image", stockImages.tractorField.src), alt: stockImages.tractorField.alt }}
      />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">How We Work</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-heading text-2xl font-bold text-forest sm:text-3xl">
            Six Coordinated Functions, One Agricultural Value Chain.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-forest-dark/70">
            We do not operate as a single-function service provider. AgriXpert organises farmers, agricultural
            service providers, aggregators, processors, logistics partners and buyers into a connected
            commercial system so that production reliably reaches profitable markets.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) => {
            const slug = s.anchor;
            const override = overrides[slug];
            const fallback = solutionsContent[slug];
            const sContent = override ?? fallback;
            const image = sContent
              ? stockImages[sContent.heroImageKey as keyof typeof stockImages] ?? stockImages.teamMeeting
              : stockImages.teamMeeting;
            return (
              <Link
                key={s.number}
                id={s.anchor}
                href={s.href}
                className="group overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-forest-dark/80 px-3 py-1 font-heading text-xs font-bold text-natural-white">
                    {s.number}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-forest">{s.title}</h3>
                  <p className="mt-2 text-sm text-forest-dark/70">{s.body}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-agri-green">
                    {s.cta} &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Shared commitment */}
        <div className="mt-20 border-t border-forest/10 pt-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">Our Shared Commitment</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-heading text-2xl font-bold text-forest sm:text-3xl">
            Every Function Is Designed to Work Together, Not in Isolation.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-forest-dark/70">
            Mechanisation supports production. Aggregation depends on organised farmers. Processing depends on
            reliable supply. Markets depend on quality and consistency. We coordinate across all six functions
            so that value created at one stage is not lost at the next.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {audiences.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="rounded-2xl border border-forest/10 bg-forest/5 p-5 text-sm transition hover:bg-forest/10"
            >
              <p className="font-semibold text-forest">{a.label}</p>
              <p className="mt-1 text-forest-dark/70">{a.body}</p>
            </Link>
          ))}
        </div>

        {/* Closing CTA band */}
        <div className="mt-14 rounded-2xl bg-forest-dark px-6 py-10 text-center text-natural-white sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">AgriXpert</p>
          <h2 className="mt-2 font-heading text-2xl font-bold">
            Connecting Agricultural Production to Profitable Markets.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-natural-white/80">
            Explore the full detail behind each solution, or get in touch to discuss how we can work together.
          </p>
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-4">
            <Link
              href="/solutions"
              className="rounded-full bg-natural-white px-6 py-3 text-sm font-semibold text-forest-dark hover:bg-natural-white/90"
            >
              View All Solutions
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-natural-white px-6 py-3 text-sm font-semibold text-natural-white hover:bg-natural-white/10"
            >
              Talk to Our Team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
