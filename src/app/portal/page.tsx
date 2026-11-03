import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Farmer / Buyer Portal | AgriXpert",
};

export default function PortalPage() {
  return (
    <>
      <PageHero
        eyebrow="Portal"
        title="Farmer / Buyer Portal"
        description="Separate login and registration experience for farmers, buyers and suppliers."
      />
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-10">
        <p className="text-forest-dark/70">
          The Farmer / Buyer Portal is a Phase 2 deliverable (registration) and Phase 4 deliverable
          (dashboards) in the implementation roadmap. Authentication and role-based dashboards will be
          built on Supabase once that phase begins.
        </p>
      </section>
    </>
  );
}
