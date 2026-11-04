import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { stockImages } from "@/lib/site-data";
import { solutionsList } from "@/lib/solutions-content";

export const metadata: Metadata = {
  title: "Our Solutions | AgriXpert",
};

const integrationFlow = [
  { number: "01", title: "Production Coordination", body: "Organising farmers and aligning production with market demand." },
  { number: "02", title: "Aggregation & Procurement", body: "Consolidating agricultural commodities and coordinating sourcing." },
  { number: "03", title: "Mechanisation & Farm Services", body: "Improving access to essential agricultural equipment and services." },
  { number: "04", title: "Storage & Supply Chain Management", body: "Preserving commodity quality and coordinating movement." },
  { number: "05", title: "Processing & Value Addition", body: "Transforming raw agricultural commodities into higher-value products." },
  { number: "06", title: "Market Access & Commercial Trade", body: "Connecting agricultural supply to buyers and commercial markets." },
];

const audiences = [
  { label: "For Farmers", body: "Access structured production opportunities, agricultural services and potential market linkages.", href: "/for-farmers" },
  { label: "For Buyers", body: "Source agricultural commodities through coordinated supplier and aggregation networks.", href: "/for-buyers" },
  { label: "For Processors", body: "Explore reliable raw material sourcing and value-addition partnerships.", href: "/for-buyers" },
  { label: "For Service Providers", body: "Connect your agricultural equipment, technical expertise and logistics services to commercial opportunities.", href: "/contact" },
  { label: "For Investors", body: "Explore commercially viable opportunities across production, aggregation, mechanisation, storage and processing.", href: "/partnerships" },
  { label: "For Institutional Partners", body: "Collaborate to strengthen agricultural markets, supply chains and enterprise development.", href: "/partnerships" },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Solutions"
        title="Six Interconnected Commercial Solutions"
        description="AgriXpert does not simply provide agricultural services. We connect the different actors, resources and commercial opportunities required to make agricultural value chains work."
        image={stockImages.conferenceTable}
      />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solutionsList.map((s) => {
            const image = stockImages[s.heroImageKey];
            return (
              <Link
                key={s.slug}
                href={`/solutions/${s.slug}`}
                className="group overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-forest-dark/80 px-3 py-1 font-heading text-xs font-bold text-natural-white">
                    {s.number}
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="font-heading text-lg font-semibold text-forest">{s.name}</h2>
                  <p className="mt-2 text-sm text-forest-dark/70">{s.tagline}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-agri-green">
                    View solution &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Integration model */}
        <div className="mt-20 border-t border-forest/10 pt-14">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">Our Integrated Approach</p>
            <h2 className="mx-auto mt-3 max-w-3xl font-heading text-2xl font-bold text-forest sm:text-3xl">
              Six Solutions. One Connected Agricultural Value Chain.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-forest-dark/70">
              AgriXpert recognises that agricultural challenges are interconnected. Farmers need production
              support, but production alone is insufficient without aggregation, storage, processing and
              reliable markets. Buyers require dependable supply, but this depends on organised farmers,
              appropriate agricultural services, quality management and efficient logistics. That is why our
              six solutions are designed to work together.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrationFlow.map((step) => (
              <Link
                key={step.number}
                href={`/solutions/${solutionsList[Number(step.number) - 1]?.slug ?? ""}`}
                className="rounded-2xl border border-forest/10 bg-forest/5 p-5 text-sm transition hover:bg-forest/10"
              >
                <span className="font-heading text-xs font-bold text-harvest-gold">{step.number}</span>
                <p className="mt-1 font-semibold text-forest">{step.title}</p>
                <p className="mt-1 text-forest-dark/70">{step.body}</p>
              </Link>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-center text-sm italic text-forest-dark/60">
            These functions operate as an integrated model, not necessarily a compulsory linear sequence. For
            example, mechanisation supports production, while aggregation, procurement and processing can
            operate alongside market development.
          </p>
        </div>

        {/* Work with AgriXpert */}
        <div className="mt-20 border-t border-forest/10 pt-14">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">Work With AgriXpert</p>
            <h2 className="mx-auto mt-3 max-w-3xl font-heading text-2xl font-bold text-forest sm:text-3xl">
              Every Agricultural Challenge Creates an Opportunity for Collaboration.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="rounded-2xl border border-forest/10 bg-white p-5 text-sm shadow-sm transition hover:shadow-md"
              >
                <p className="font-semibold text-forest">{a.label}</p>
                <p className="mt-1 text-forest-dark/70">{a.body}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Closing CTA band */}
        <div className="mt-14 rounded-2xl bg-forest-dark px-6 py-10 text-center text-natural-white sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">AgriXpert</p>
          <h2 className="mt-2 font-heading text-2xl font-bold">
            Connecting Agricultural Production to Profitable Markets.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-natural-white/80">
            Let&apos;s build stronger agricultural businesses and more reliable supply chains together.
          </p>
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-4">
            <Link
              href="/for-farmers"
              className="rounded-full bg-natural-white px-6 py-3 text-sm font-semibold text-forest-dark hover:bg-natural-white/90"
            >
              Become a Farmer Partner
            </Link>
            <Link
              href="/for-buyers"
              className="rounded-full border-2 border-natural-white px-6 py-3 text-sm font-semibold text-natural-white hover:bg-natural-white/10"
            >
              Source Agricultural Commodities
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-natural-white px-6 py-3 text-sm font-semibold text-natural-white hover:bg-natural-white/10"
            >
              Offer Agricultural Services
            </Link>
            <Link
              href="/partnerships"
              className="rounded-full border-2 border-natural-white px-6 py-3 text-sm font-semibold text-natural-white hover:bg-natural-white/10"
            >
              Partner With AgriXpert
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
