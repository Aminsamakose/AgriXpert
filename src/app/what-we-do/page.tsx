import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { solutions } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "What We Do | AgriXpert",
};

export default function WhatWeDoPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Production, aggregation, mechanisation and supply chain solutions"
      />
      <section className="mx-auto max-w-5xl space-y-16 px-6 py-16 lg:px-10">
        {solutions.map((s) => (
          <div key={s.number} id={s.anchor} className="border-t border-forest/10 pt-10 first:border-t-0 first:pt-0">
            <span className="font-heading text-sm font-bold text-harvest-gold">{s.number}</span>
            <h2 className="mt-2 font-heading text-2xl font-bold text-forest">{s.title}</h2>
            <p className="mt-4 max-w-2xl text-forest-dark/75">{s.body}</p>
            <a
              href="/contact"
              className="mt-6 inline-block rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-natural-white hover:bg-forest-dark"
            >
              Enquire about this solution
            </a>
          </div>
        ))}
      </section>
    </>
  );
}
