import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { valueChains, stockImages } from "@/lib/site-data";

export function generateStaticParams() {
  return valueChains.map((vc) => ({ slug: vc.slug }));
}

const templateSections = [
  { title: "Overview", body: (name: string) => `Overview of the ${name.toLowerCase()} value chain, including market context and commercial opportunity.` },
  { title: "Production & Sourcing Locations", body: () => "Production and sourcing locations pending confirmation." },
  { title: "Farmer & Supplier Network", body: () => "Details of the farmer and supplier network supporting this commodity." },
  { title: "Production Coordination", body: () => "How production planning, inputs and technical support are coordinated for this commodity." },
  { title: "Aggregation & Storage", body: () => "Aggregation points, grading and storage arrangements for this commodity." },
  { title: "Quality Specifications", body: () => "Quality grades and specifications pending technical sign-off." },
  { title: "Processing & Market Opportunities", body: () => "Processing routes and market opportunities for this commodity." },
  { title: "Partnership Opportunities", body: () => "Partnership and investment opportunities linked to this commodity." },
];

export default async function ValueChainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const commodity = valueChains.find((vc) => vc.slug === slug);

  if (!commodity) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow="Value Chain"
        title={commodity.name}
        description={commodity.body}
        image={stockImages.cropFieldsAerial}
      />
      <section className="mx-auto max-w-4xl space-y-12 px-6 py-16 lg:px-10">
        {templateSections.map((section) => (
          <div key={section.title} className="border-t border-forest/10 pt-8 first:border-t-0 first:pt-0">
            <h2 className="font-heading text-xl font-bold text-forest">{section.title}</h2>
            <p className="mt-3 text-forest-dark/70">{section.body(commodity.name)}</p>
          </div>
        ))}

        <div className="rounded-2xl bg-forest/5 p-8">
          <h2 className="font-heading text-xl font-bold text-forest">Buyer Enquiry</h2>
          <p className="mt-2 text-sm text-forest-dark/70">
            Interested in sourcing {commodity.name.toLowerCase()} through AgriXpert?
          </p>
          <a
            href="/for-buyers"
            className="mt-5 inline-block rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white hover:bg-forest-dark"
          >
            Submit a Buyer Enquiry
          </a>
        </div>
      </section>
    </>
  );
}
