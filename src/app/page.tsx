import Image from "next/image";
import Link from "next/link";
import {
  problems,
  coreFunctions,
  solutions,
  valueChains,
  businessModelSteps,
  farmerValueProps,
  buyerValueProps,
  digitalCapabilities,
  impactIndicators,
  stockImages,
} from "@/lib/site-data";
import { getSiteContent, pick } from "@/lib/content";

export const instant = false;

function SectionHeading({
  eyebrow,
  title,
  center = false,
  variant = "light",
}: {
  eyebrow?: string;
  title: string;
  center?: boolean;
  /** "light" = dark text for light backgrounds, "dark" = light text for dark/colored backgrounds */
  variant?: "light" | "dark";
}) {
  const eyebrowColor = variant === "dark" ? "text-harvest-gold" : "text-agri-green";
  const titleColor = variant === "dark" ? "text-natural-white" : "text-forest";

  return (
    <div className={center ? "text-center" : ""}>
      {eyebrow && (
        <p className={`text-sm font-semibold uppercase tracking-wide ${eyebrowColor}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl ${titleColor}`}>
        {title}
      </h2>
    </div>
  );
}

export default async function Home() {
  const content = await getSiteContent();
  const heroImage = pick(content, "home.hero.image", stockImages.heroField.src);
  const heroTitle = pick(content, "home.hero.title", "Connecting Agricultural Production to Profitable Markets.");
  const heroDescription = pick(
    content,
    "home.hero.description",
    "AgriXpert builds commercially sustainable agricultural supply chains by connecting farmers, agricultural service providers, processors and buyers through coordinated production, aggregation, value addition and market access."
  );
  return (
    <>
      {/* Section 1: Hero */}
      <section className="relative isolate overflow-hidden bg-forest text-natural-white">
        <Image
          src={heroImage}
          alt={stockImages.heroField.alt}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover"
        />
        {/* Forest-tinted scrim so hero copy stays legible over the photo */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-dark/95 via-forest-dark/80 to-forest-dark/40"
        />
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-natural-white/85">{heroDescription}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/what-we-do"
                className="rounded-full bg-harvest-gold px-6 py-3 text-sm font-semibold text-forest-dark transition-opacity hover:opacity-90"
              >
                Explore Our Solutions
              </Link>
              <Link
                href="/for-farmers"
                className="rounded-full border border-natural-white/40 px-6 py-3 text-sm font-semibold text-natural-white transition-colors hover:bg-natural-white/10"
              >
                Become a Farmer Partner
              </Link>
              <Link
                href="/for-buyers"
                className="rounded-full border border-natural-white/40 px-6 py-3 text-sm font-semibold text-natural-white transition-colors hover:bg-natural-white/10"
              >
                Source Agricultural Commodities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The problem */}
      <section className="bg-natural-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="The Challenge" title="The Problem We Are Solving" center />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p) => (
              <div key={p.title} className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
                <h3 className="font-heading text-lg font-semibold text-forest">{p.title}</h3>
                <p className="mt-3 text-sm text-forest-dark/70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Introducing AgriXpert */}
      <section className="bg-forest/5 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Our Model" title="We Integrate the Agricultural Value Chain." />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {coreFunctions.map((fn, i) => (
              <div key={fn} className="flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-agri-green font-heading text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-forest-dark">{fn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Core business solutions */}
      <section className="bg-natural-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="What We Deliver" title="Our Core Business Solutions" center />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((s) => (
              <div
                key={s.number}
                className="flex flex-col rounded-2xl border border-forest/10 bg-white p-6 shadow-sm"
              >
                <span className="font-heading text-sm font-bold text-harvest-gold">{s.number}</span>
                <h3 className="mt-2 font-heading text-lg font-semibold text-forest">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm text-forest-dark/70">{s.body}</p>
                <Link
                  href={s.href}
                  className="mt-4 text-sm font-semibold text-agri-green hover:text-forest"
                >
                  {s.cta} &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Priority value chains */}
      <section className="bg-forest text-natural-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Commodities" title="Our Priority Agricultural Value Chains" variant="dark" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {valueChains.map((vc) => (
              <Link
                key={vc.slug}
                href={`/value-chains/${vc.slug}`}
                className="rounded-2xl border border-natural-white/15 bg-natural-white/5 p-6 transition-colors hover:bg-natural-white/10"
              >
                <h3 className="font-heading text-lg font-semibold text-harvest-gold">{vc.name}</h3>
                <p className="mt-2 text-sm text-natural-white/75">{vc.body}</p>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-sm text-natural-white/60">
            Additional value chains such as poultry and livestock can be introduced as dedicated expansion areas.
          </p>
        </div>
      </section>

      {/* Section 6: How the business model works */}
      <section className="bg-natural-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Our Process" title="From Farm to Market – One Integrated System." center />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {businessModelSteps.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
                <span className="font-heading text-2xl font-bold text-agri-green">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-heading text-base font-semibold text-forest">{step.title}</h3>
                <p className="mt-2 text-sm text-forest-dark/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Section 7: For farmers */}
      <section className="bg-agri-green/10 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="For Farmers" title="Grow with AgriXpert. Access More Opportunities." />
            <ul className="mt-8 space-y-3">
              {farmerValueProps.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-forest-dark/80">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-agri-green" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/for-farmers"
              className="mt-8 inline-block rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white hover:bg-forest-dark"
            >
              Register as a Farmer Partner
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={stockImages.farmerField.src}
              alt={stockImages.farmerField.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Section 8: For buyers */}
      <section className="bg-natural-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-2xl lg:order-1">
            <Image
              src={stockImages.aggregationBags.src}
              alt={stockImages.aggregationBags.alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="For Buyers" title="Source Quality Agricultural Commodities with Confidence." />
            <ul className="mt-8 space-y-3">
              {buyerValueProps.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-forest-dark/80">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-harvest-gold" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/for-buyers"
              className="mt-8 inline-block rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white hover:bg-forest-dark"
            >
              Submit a Buyer Enquiry
            </Link>
          </div>
        </div>
      </section>

      {/* Section 9: Digital agriculture and supply-chain intelligence */}
      <section className="bg-forest-dark text-natural-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Digital Capability" title="Data-Driven Agriculture. Smarter Supply Chains." variant="dark" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {digitalCapabilities.map((cap) => (
              <div key={cap} className="flex items-center gap-3 rounded-xl bg-natural-white/5 p-4">
                <span className="rounded-full bg-harvest-gold/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-forest-dark">
                  Planned
                </span>
                <p className="text-sm text-natural-white/85">{cap}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-natural-white/60">
            Capabilities are labelled by actual development status. None of the above should be read as
            live functionality until explicitly confirmed otherwise.
          </p>
        </div>
      </section>

      {/* Section 10: Commercial and development impact */}
      <section className="bg-natural-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Impact" title="Creating Value Across the Agricultural Economy." center />
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] overflow-hidden rounded-2xl border border-forest/10 text-left text-sm">
              <thead className="bg-forest text-natural-white">
                <tr>
                  <th className="px-6 py-3 font-heading font-semibold">Impact Indicator</th>
                  <th className="px-6 py-3 font-heading font-semibold">Measurement</th>
                  <th className="px-6 py-3 font-heading font-semibold">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10 bg-white">
                {impactIndicators.map((row) => (
                  <tr key={row.label}>
                    <td className="px-6 py-4 font-medium text-forest-dark">{row.label}</td>
                    <td className="px-6 py-4 text-forest-dark/70">{row.measurement}</td>
                    <td className="px-6 py-4 italic text-forest-dark/50">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-forest-dark/50">
            Only verified figures will be published. Values above are placeholders pending data collection.
          </p>
        </div>
      </section>

      {/* Section 11: Strategic partners */}
      <section className="bg-forest/5 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading eyebrow="Our Network" title="Strategic Partners" center />
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-forest-dark/60">
            Agricultural financial institutions, development organisations, farmer cooperatives, commodity
            processors, agricultural technology companies, logistics and storage providers, and institutional
            buyers.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-[3/2] items-center justify-center rounded-xl border border-dashed border-forest/20 bg-white text-xs text-forest-dark/40"
              >
                Partner logo
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 12: Final conversion */}
      <section className="bg-harvest-gold py-20 text-forest-dark">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Let&apos;s Build Stronger Agricultural Supply Chains Together.
          </h2>
          <p className="mt-6 text-base text-forest-dark/80">
            Whether you are a farmer, buyer, processor, investor or institutional partner, AgriXpert offers an
            opportunity to participate in a more connected agricultural economy.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/partnerships"
              className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-natural-white hover:bg-forest-dark"
            >
              Become a Partner
            </Link>
            <Link
              href="/for-farmers"
              className="rounded-full border border-forest-dark/30 bg-white px-6 py-3 text-sm font-semibold text-forest hover:bg-forest-dark/5"
            >
              Register as a Farmer
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-forest-dark/30 bg-white px-6 py-3 text-sm font-semibold text-forest hover:bg-forest-dark/5"
            >
              Work With AgriXpert
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
