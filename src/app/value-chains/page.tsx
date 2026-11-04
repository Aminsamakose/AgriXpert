import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { valueChains, stockImages } from "@/lib/site-data";
import { valueChainContent } from "@/lib/value-chain-content";

export const metadata: Metadata = {
  title: "Value Chains | AgriXpert",
};

export default function ValueChainsPage() {
  return (
    <>
      <PageHero
        eyebrow="Value Chains"
        title="Maize, soybeans, rice, groundnuts, shea and vegetables"
        description="Commercial opportunity stories for every commodity AgriXpert works in — for farmers, buyers, processors, investors and partners."
        image={stockImages.cropFieldsAerial}
      />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueChains.map((vc) => {
            const content = valueChainContent[vc.slug];
            const image = content ? stockImages[content.heroImageKey] : undefined;
            return (
              <Link
                key={vc.slug}
                href={`/value-chains/${vc.slug}`}
                className="group overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {image && (
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="font-heading text-lg font-semibold text-forest">{vc.name}</h2>
                  <p className="mt-2 text-sm text-forest-dark/70">{content?.tagline ?? vc.body}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-agri-green">
                    View value chain &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Shared commitment across all value chains */}
        <div className="mt-20 border-t border-forest/10 pt-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">Our Shared Commitment</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-heading text-2xl font-bold text-forest sm:text-3xl">
            At AgriXpert, we believe agricultural profitability begins when production is connected to real
            market opportunities.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-forest-dark/70">
            Our integrated approach seeks to bring farmers, agricultural service providers, aggregators,
            processors, logistics providers and buyers into a more coordinated commercial ecosystem. Whether
            it is maize, soybeans, rice, groundnuts, shea or vegetables, our objective remains the same:
          </p>
          <p className="mx-auto mt-6 max-w-2xl font-heading text-lg font-semibold text-forest">
            Make Agricultural Production More Commercially Viable. Make Supply Chains More Reliable. Make
            Markets More Accessible.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "For Farmers", body: "Grow with market opportunities in mind.", href: "/for-farmers" },
            { label: "For Buyers", body: "Build reliable agricultural sourcing relationships.", href: "/for-buyers" },
            { label: "For Processors", body: "Access coordinated raw material supply opportunities.", href: "/for-buyers" },
            { label: "For Investors", body: "Explore commercially viable agricultural value-chain opportunities.", href: "/partnerships" },
            { label: "For Partners", body: "Collaborate to strengthen agricultural production and market systems.", href: "/partnerships" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-2xl border border-forest/10 bg-forest/5 p-5 text-sm transition hover:bg-forest/10"
            >
              <p className="font-semibold text-forest">{item.label}</p>
              <p className="mt-1 text-forest-dark/70">{item.body}</p>
            </Link>
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-forest-dark px-6 py-10 text-center text-natural-white sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">AgriXpert</p>
          <h2 className="mt-2 font-heading text-2xl font-bold">
            Connecting Agricultural Production to Profitable Markets.
          </h2>
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-4">
            <Link
              href="/for-farmers"
              className="rounded-full bg-natural-white px-6 py-3 text-sm font-semibold text-forest-dark hover:bg-natural-white/90"
            >
              Become a Farmer Partner
            </Link>
            <Link
              href="/for-buyers"
              className="rounded-full border-2 border-natural-white px-6 py-3 text-sm font-semibold text-natural-white hover:bg-natural-white/10"
            >
              Source Agricultural Commodities
            </Link>
            <Link
              href="/partnerships"
              className="rounded-full border-2 border-natural-white px-6 py-3 text-sm font-semibold text-natural-white hover:bg-natural-white/10"
            >
              Partner With AgriXpert
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
