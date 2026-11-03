import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Partnerships | AgriXpert",
};

const models = [
  { title: "Institutional Partnerships", body: "Collaboration with development organisations and government programmes." },
  { title: "Commercial Partnerships", body: "Offtake agreements, processing collaborations and logistics partnerships." },
  { title: "Investment Partnerships", body: "Capital and co-investment opportunities in supply-chain infrastructure." },
];

export default function PartnershipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Partnerships"
        title="Institutional, commercial and investment partnerships"
      />
      <section className="mx-auto max-w-5xl px-6 py-16 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-3">
          {models.map((m) => (
            <div key={m.title} className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-forest">{m.title}</h2>
              <p className="mt-3 text-sm text-forest-dark/70">{m.body}</p>
            </div>
          ))}
        </div>
        <a
          href="/contact"
          className="mt-10 inline-block rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white hover:bg-forest-dark"
        >
          Start a Partnership Conversation
        </a>
      </section>
    </>
  );
}
