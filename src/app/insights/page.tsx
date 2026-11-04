import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { stockImages } from "@/lib/site-data";
import { getSiteContent, pick } from "@/lib/content";


export const instant = false;

export const metadata: Metadata = {
  title: "Insights | AgriXpert",
};

export default async function InsightsPage() {
  const content = await getSiteContent();
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={pick(content, "insights.hero.title", "Industry news, market intelligence and knowledge")}
        image={{ src: pick(content, "insights.hero.image", stockImages.dataCharts.src), alt: stockImages.dataCharts.alt }}
      />
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <p className="text-forest-dark/70">
          Articles, market reports and announcements will be published here. No content has been added yet.
        </p>
      </section>
    </>
  );
}
