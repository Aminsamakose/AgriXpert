import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import FarmerRegistrationForm from "@/components/FarmerRegistrationForm";
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
          Register below to be considered for AgriXpert&apos;s production coordination, aggregation and
          market access programmes. A member of our team will follow up to verify your details.
        </p>
        <div className="mt-6">
          <FarmerRegistrationForm />
        </div>
      </section>
    </>
  );
}
