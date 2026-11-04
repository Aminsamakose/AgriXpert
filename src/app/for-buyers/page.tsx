import type { Metadata } from "next";
import { Suspense } from "react";
import PageHero from "@/components/PageHero";
import BuyerRegistrationForm from "@/components/BuyerRegistrationForm";
import { buyerValueProps, stockImages } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "For Buyers | AgriXpert",
};

export default function ForBuyersPage() {
  return (
    <>
      <PageHero
        eyebrow="For Buyers"
        title="Commodity sourcing, procurement and supply agreements"
        image={stockImages.aggregationBags}
      />
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <h2 className="font-heading text-2xl font-bold text-forest">What You Can Do</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {buyerValueProps.map((item) => (
            <li key={item} className="flex gap-3 rounded-xl bg-harvest-gold/10 p-4 text-sm text-forest-dark/80">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-harvest-gold" />
              {item}
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-heading text-2xl font-bold text-forest">Submit a Buyer Enquiry</h2>
        <p className="mt-4 text-forest-dark/70">
          Tell us what you&apos;re sourcing and we&apos;ll connect you with available aggregated supply.
        </p>
        <div className="mt-6">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-forest/5" />}>
            <BuyerRegistrationForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
