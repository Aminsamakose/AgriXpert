import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { stockImages } from "@/lib/site-data";
import { getSiteContent, pick } from "@/lib/content";


export const instant = false;

export const metadata: Metadata = {
  title: "About Us | AgriXpert",
};

export default async function AboutPage() {
  const content = await getSiteContent();
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={pick(content, "about.hero.title", "Company profile, vision, mission and leadership")}
        description={pick(
          content,
          "about.hero.description",
          "AgriXpert is a market-led agricultural value-chain integration company working to build commercially sustainable supply chains by coordinating farmers, production, aggregation, mechanisation, processing, logistics and market access."
        )}
        image={{ src: pick(content, "about.hero.image", stockImages.teamMeeting.src), alt: stockImages.teamMeeting.alt }}
      />
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        <div id="story" className="space-y-4">
          <h2 className="font-heading text-2xl font-bold text-forest">Our Story</h2>
          <p className="text-forest-dark/75">
            Company story content pending. This section will cover AgriXpert&apos;s founding context,
            geographical coverage and the gap in the market it was built to close.
          </p>
        </div>
        <div className="mt-12 space-y-4">
          <h2 className="font-heading text-2xl font-bold text-forest">Mission &amp; Vision</h2>
          <p className="text-forest-dark/75">
            Mission and vision statements pending final sign-off.
          </p>
        </div>
        <div id="leadership" className="mt-12 space-y-4">
          <h2 className="font-heading text-2xl font-bold text-forest">Leadership</h2>
          <p className="text-forest-dark/75">
            Leadership profiles pending. Add team bios and photography once confirmed.
          </p>
        </div>
      </section>
    </>
  );
}
