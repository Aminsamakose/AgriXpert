import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Cookie Policy | AgriXpert",
};

export default function CookiePolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Cookie Policy" />
      <section className="mx-auto max-w-3xl px-6 py-16 text-forest-dark/70 lg:px-10">
        <p>Placeholder page. Finalise once analytics and tracking tools are confirmed for the site.</p>
      </section>
    </>
  );
}
