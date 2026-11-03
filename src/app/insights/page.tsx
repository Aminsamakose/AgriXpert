import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { stockImages } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Insights | AgriXpert",
};

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Industry news, market intelligence and knowledge"
        image={stockImages.dataCharts}
      />
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <p className="text-forest-dark/70">
          Articles, market reports and announcements will be published here. No content has been added yet.
        </p>
      </section>
    </>
  );
}
