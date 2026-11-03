import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { farmerValueProps, stockImages } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "For Farmers | AgriXpert",
};

export default function ForFarmersPage() {
  return (
    <>
      <PageHero
        eyebrow="For Farmers"
        title="Farmer registration, production support and market access"
        image={stockImages.farmerField}
      />
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <h2 className="font-heading text-2xl font-bold text-forest">Benefits</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {farmerValueProps.map((item) => (
            <li key={item} className="flex gap-3 rounded-xl bg-agri-green/10 p-4 text-sm text-forest-dark/80">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-agri-green" />
              {item}
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-heading text-2xl font-bold text-forest">Eligibility</h2>
        <p className="mt-4 text-forest-dark/70">Eligibility criteria pending confirmation.</p>

        <h2 className="mt-12 font-heading text-2xl font-bold text-forest">Registration</h2>
        <p className="mt-4 text-forest-dark/70">
          The farmer registration form will be available through the Farmer Portal once Phase 2 (Farmer,
          buyer and supplier registration) is built.
        </p>
        <a
          href="/portal"
          className="mt-6 inline-block rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white hover:bg-forest-dark"
        >
          Go to Farmer Portal
        </a>
      </section>
    </>
  );
}
