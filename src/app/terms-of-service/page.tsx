import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Terms of Service | AgriXpert",
};

export default function TermsOfServicePage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <section className="mx-auto max-w-3xl px-6 py-16 text-forest-dark/70 lg:px-10">
        <p>Placeholder page. Terms must be drafted and reviewed before public launch.</p>
      </section>
    </>
  );
}
