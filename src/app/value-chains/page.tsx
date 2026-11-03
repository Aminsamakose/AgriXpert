import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { valueChains } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Value Chains | AgriXpert",
};

export default function ValueChainsPage() {
  return (
    <>
      <PageHero
        eyebrow="Value Chains"
        title="Maize, soybeans, rice, groundnuts and other commodities"
      />
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {valueChains.map((vc) => (
            <Link
              key={vc.slug}
              href={`/value-chains/${vc.slug}`}
              className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="font-heading text-lg font-semibold text-forest">{vc.name}</h2>
              <p className="mt-2 text-sm text-forest-dark/70">{vc.body}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-agri-green">
                View value chain &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
