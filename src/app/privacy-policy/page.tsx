import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy | AgriXpert",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" />
      <section className="mx-auto max-w-3xl px-6 py-16 text-forest-dark/70 lg:px-10">
        <p>
          Placeholder page. This policy must be drafted and reviewed before the site accepts any personal
          data through registration or enquiry forms.
        </p>
      </section>
    </>
  );
}
