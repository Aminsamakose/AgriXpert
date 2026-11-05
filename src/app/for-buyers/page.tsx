import type { Metadata } from "next";
import { Suspense } from "react";
import { CircleCheck } from "lucide-react";
import PageHero from "@/components/PageHero";
import BuyerRegistrationForm from "@/components/BuyerRegistrationForm";
import { buyerValueProps, stockImages } from "@/lib/site-data";
import { getSiteContent, pick } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export const metadata: Metadata = pageMetadata({
  title: "For Buyers | AgriXpert",
  description:
    "Source agricultural commodities through AgriXpert's coordinated supplier and aggregation networks across maize, soybeans, rice, groundnuts and vegetables.",
  path: "/for-buyers",
  image: stockImages.aggregationBags,
});

export default async function ForBuyersPage() {
  const content = await getSiteContent();
  return (
    <>
      <PageHero
        eyebrow="For Buyers"
        title={pick(content, "for-buyers.hero.title", "Commodity sourcing, procurement and supply agreements")}
        image={{ src: pick(content, "for-buyers.hero.image", stockImages.aggregationBags.src), alt: stockImages.aggregationBags.alt }}
      />
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <h2 className="font-heading text-2xl font-bold text-forest">What You Can Do</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {buyerValueProps.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-xl bg-harvest-gold/10 p-4 text-sm text-forest-dark/80">
              <CircleCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-harvest-gold" strokeWidth={1.5} />
              <span>{item}</span>
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
