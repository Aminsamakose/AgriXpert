import type { Metadata } from "next";
import { Suspense } from "react";
import { CircleCheck } from "lucide-react";
import PageHero from "@/components/PageHero";
import CooperativeRegistrationForm from "@/components/CooperativeRegistrationForm";
import { cooperativeValueProps, stockImages } from "@/lib/site-data";
import { getSiteContent, pick } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export const metadata: Metadata = pageMetadata({
  title: "For Cooperatives | AgriXpert",
  description:
    "Register your cooperative, VSLA, farmer group or association with AgriXpert to access clustered-demand opportunities and manage marketplace listings on behalf of your members.",
  path: "/for-cooperatives",
  image: stockImages.teamMeeting,
});

export default async function ForCooperativesPage() {
  const content = await getSiteContent();
  return (
    <>
      <PageHero
        eyebrow="For Cooperatives"
        title={pick(
          content,
          "for-cooperatives.hero.title",
          "Cooperative registration, group market access and member management"
        )}
        image={{ src: pick(content, "for-cooperatives.hero.image", stockImages.teamMeeting.src), alt: stockImages.teamMeeting.alt }}
      />
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <h2 className="font-heading text-2xl font-bold text-forest">Benefits</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {cooperativeValueProps.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-xl bg-agri-green/10 p-4 text-sm text-forest-dark/80">
              <CircleCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-agri-green" strokeWidth={1.5} />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-12 font-heading text-2xl font-bold text-forest">Eligibility</h2>
        <p className="mt-4 text-forest-dark/70">
          Open to registered and informal cooperatives, VSLAs, farmer-based organisations and
          associations. Eligibility criteria pending confirmation.
        </p>

        <h2 className="mt-12 font-heading text-2xl font-bold text-forest">Registration</h2>
        <p className="mt-4 text-forest-dark/70">
          Register your cooperative below to be considered for AgriXpert&apos;s clustered-demand
          and group market access programmes. A member of our team will follow up to verify your
          details and guide you through adding your members.
        </p>
        <div className="mt-6">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-forest/5" />}>
            <CooperativeRegistrationForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
