import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { stockImages } from "@/lib/site-data";

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
        image={stockImages.dataScreen}
      />
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-10">
        <p className="text-forest-dark/70">
          Farmer, buyer and supplier registration is now open — see{" "}
          <a href="/for-farmers" className="font-semibold text-forest hover:text-forest-dark">
            For Farmers
          </a>
          ,{" "}
          <a href="/for-buyers" className="font-semibold text-forest hover:text-forest-dark">
            For Buyers
          </a>{" "}
          and{" "}
          <a href="/partnerships" className="font-semibold text-forest hover:text-forest-dark">
            Partnerships
          </a>
          . A dedicated login and role-based dashboard experience, where registered farmers, buyers and
          suppliers can track their records directly, is a later phase in the implementation roadmap.
        </p>
      </section>
    </>
  );
}
