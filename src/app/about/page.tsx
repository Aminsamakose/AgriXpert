import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { stockImages } from "@/lib/site-data";
import { getSiteContent, pick } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const instant = false;

export const metadata: Metadata = pageMetadata({
  title: "About Us | AgriXpert",
  description:
    "AgriXpert is a market-led agricultural value chain integration company connecting farmers, agricultural businesses, service providers, processors and buyers across Ghana and Africa. Learn our story, mission, vision and leadership.",
  path: "/about",
  image: stockImages.teamMeeting,
});

const commodities = ["Maize", "Soybeans", "Rice", "Groundnuts", "Vegetables"];

const solutionPillars = [
  {
    number: "01",
    title: "Production Coordination",
    body: "Organising farmers and aligning production with market demand.",
  },
  {
    number: "02",
    title: "Aggregation & Procurement",
    body: "Connecting fragmented agricultural supply to commercial buyers.",
  },
  {
    number: "03",
    title: "Mechanisation & Farm Services",
    body: "Facilitating access to equipment and essential agricultural services.",
  },
  {
    number: "04",
    title: "Storage & Supply Chain Management",
    body: "Coordinating commodity handling, storage and transportation.",
  },
  {
    number: "05",
    title: "Processing & Value Addition",
    body: "Connecting agricultural commodities to processing infrastructure and higher-value markets.",
  },
  {
    number: "06",
    title: "Market Access & Commercial Trade",
    body: "Developing buyer relationships, offtake opportunities and commercial supply arrangements.",
  },
];

const strategicObjectives = [
  {
    number: "01",
    title: "Strengthening Agricultural Production",
    body: "Promote organised, market-informed agricultural production through farmer mobilisation, production coordination and structured supply arrangements.",
  },
  {
    number: "02",
    title: "Improving Market Connectivity",
    body: "Connect farmers and agricultural businesses to reliable buyers, processors, distributors and institutional markets.",
  },
  {
    number: "03",
    title: "Building Efficient Supply Chains",
    body: "Improve agricultural commodity sourcing, aggregation, storage, handling and transportation through coordinated supply-chain solutions.",
  },
  {
    number: "04",
    title: "Expanding Access to Agricultural Services",
    body: "Facilitate access to mechanisation, irrigation, equipment, technical expertise and other essential agricultural services.",
  },
  {
    number: "05",
    title: "Promoting Agricultural Value Addition",
    body: "Support stronger connections between raw agricultural commodity production, processing infrastructure, product development and commercial markets.",
  },
  {
    number: "06",
    title: "Mobilising Strategic Partnerships and Investment",
    body: "Build partnerships with financial institutions, investors, agricultural businesses, development organisations and technology providers to unlock commercially viable agricultural opportunities.",
  },
];

const coreValues = [
  {
    title: "Market Orientation",
    body: "We believe agricultural activities should respond to real market demand and commercially viable opportunities.",
  },
  {
    title: "Integrity & Transparency",
    body: "We promote honest business relationships, accountability and transparency in our engagements and transactions.",
  },
  {
    title: "Collaboration",
    body: "We believe sustainable agricultural development requires strong partnerships across the entire value chain.",
  },
  {
    title: "Innovation",
    body: "We embrace practical solutions, appropriate technologies and new business models that improve agricultural efficiency and competitiveness.",
  },
  {
    title: "Sustainability",
    body: "We promote responsible agricultural practices, resource efficiency and commercially sustainable business relationships.",
  },
  {
    title: "Value Creation",
    body: "We focus on creating measurable economic value for farmers, businesses, partners, investors and the communities we serve.",
  },
];

const expertiseAreas = [
  "Agricultural production and agronomy",
  "Agricultural engineering and mechanisation",
  "Commodity sourcing and procurement",
  "Supply chain and logistics management",
  "Food processing and value addition",
  "Commercial trade and market development",
  "Finance and investment",
  "Technology and digital agriculture",
];

export default async function AboutPage() {
  const content = await getSiteContent();
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={pick(content, "about.hero.title", "Connecting Agricultural Production to Profitable Markets")}
        description={pick(
          content,
          "about.hero.description",
          "AgriXpert is a market-led agricultural value chain integration company focused on connecting farmers, agricultural businesses, service providers, processors, commodity suppliers and commercial buyers."
        )}
        image={{ src: pick(content, "about.hero.image", stockImages.teamMeeting.src), alt: stockImages.teamMeeting.alt }}
      />

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        {/* Intro */}
        <div className="space-y-4 text-forest-dark/80">
          <p>
            We work to address the structural challenges that limit agricultural productivity, market access and
            commercial growth by coordinating the resources, services, infrastructure and partnerships required
            to make agricultural value chains more efficient and commercially viable.
          </p>
          <p>
            Through production coordination, aggregation and procurement, mechanisation, storage and logistics,
            processing, and market access, AgriXpert seeks to create stronger connections between agricultural
            production and commercial demand.
          </p>
          <p>
            Our ambition is to contribute to a more organised, productive, inclusive and commercially sustainable
            agricultural sector in Ghana and across Africa.
          </p>
          <p className="rounded-xl bg-forest text-natural-white px-6 py-4 font-heading text-lg font-semibold">
            We believe agriculture becomes more profitable when the entire value chain works together.
          </p>
        </div>

        {/* Our Story */}
        <div id="story" className="mt-16 border-t border-forest/10 pt-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">Our Story</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-forest">
            Agriculture Has Potential. The Challenge Is Connecting the Value Chain.
          </h2>
          <div className="mt-4 space-y-4 text-forest-dark/75">
            <p>
              Agriculture remains one of Africa&apos;s most important economic sectors, supporting millions of
              livelihoods, providing raw materials for industries and creating opportunities for enterprise
              development, investment and employment.
            </p>
            <p>Yet, significant opportunities remain untapped.</p>
            <p>
              Across agricultural communities, farmers often produce without reliable access to structured
              markets. Buyers and processors struggle to secure consistent supplies of quality commodities.
              Equipment owners have difficulty reaching farmers who need mechanisation services. Storage and
              transportation gaps contribute to post-harvest losses, while limited processing capacity restricts
              opportunities to create additional value from agricultural commodities.
            </p>
            <p>These challenges are interconnected.</p>
            <p>
              A farmer may have the capacity to produce, but without reliable buyers, the commercial opportunity
              remains uncertain. A processor may have the capacity to manufacture, but without dependable raw
              material supplies, production becomes difficult to sustain. Similarly, an investor may recognise an
              attractive agricultural opportunity but struggle to identify the right producers, infrastructure and
              commercial partners.
            </p>
            <p>
              The problem is therefore not simply agricultural production. It is the lack of effective
              coordination across the entire agricultural value chain.
            </p>
          </div>

          <h3 className="mt-8 font-heading text-lg font-bold text-forest">Why AgriXpert Exists</h3>
          <div className="mt-3 space-y-4 text-forest-dark/75">
            <p>AgriXpert was conceived to help close this gap.</p>
            <p>
              We recognise that sustainable agricultural growth requires more than individual interventions. It
              requires a coordinated approach that connects production to aggregation, aggregation to processing,
              and processing to markets.
            </p>
            <p>
              Our model is built around the belief that farmers should not operate in isolation, buyers should not
              struggle unnecessarily to find reliable suppliers, and agricultural businesses should have better
              access to the services and partnerships required to grow.
            </p>
            <p>We bring these different actors together through an integrated, market-led approach.</p>
            <p>
              Rather than looking at agriculture as disconnected activities, we see it as an interconnected
              commercial ecosystem in which every participant has a role to play.
            </p>
          </div>

          <h3 className="mt-8 font-heading text-lg font-bold text-forest">Where We Operate</h3>
          <div className="mt-3 space-y-4 text-forest-dark/75">
            <p>
              AgriXpert is rooted in Ghana, with an ambition to develop commercially viable agricultural value
              chains across the country and progressively expand into other African markets.
            </p>
            <p>
              Our geographical focus recognises the significant agricultural opportunities within Northern Ghana,
              particularly across the Northern, Savannah, North East, Upper East and Upper West regions.
            </p>
            <p className="text-sm font-semibold text-forest-dark">
              These areas offer opportunities across several strategic agricultural commodities, including:
            </p>
            <div className="flex flex-wrap gap-2">
              {commodities.map((c) => (
                <span key={c} className="rounded-full bg-agri-green/10 px-4 py-1.5 text-sm font-semibold text-agri-green">
                  {c}
                </span>
              ))}
            </div>
            <p>
              We see opportunities to connect farming communities, agricultural service providers, commodity
              aggregators, processors and commercial buyers through coordinated sourcing, production and market
              development arrangements.
            </p>
            <p>
              Our longer-term ambition is to establish a scalable agricultural value chain integration model that
              can be replicated across other regions of Ghana and selected African markets.
            </p>
          </div>

          <h3 className="mt-8 font-heading text-lg font-bold text-forest">What Makes AgriXpert Different?</h3>
          <div className="mt-3 space-y-4 text-forest-dark/75">
            <p>We approach agriculture from a value-chain integration perspective.</p>
            <p>
              Our focus is not limited to helping farmers produce more. We are equally concerned with what
              happens before production, during production and after harvesting.
            </p>
            <p className="text-sm font-semibold text-forest-dark">
              Our approach brings together six interconnected business solutions:
            </p>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {solutionPillars.map((s) => (
              <div key={s.number} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
                <span className="font-heading text-sm font-bold text-harvest-gold">{s.number}</span>
                <p className="mt-1 font-semibold text-forest-dark">{s.title}</p>
                <p className="mt-1 text-sm text-forest-dark/70">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-forest-dark/75">
            Together, these solutions provide a foundation for building stronger agricultural businesses and more
            reliable supply chains.
          </p>

          <h3 className="mt-8 font-heading text-lg font-bold text-forest">Our Belief</h3>
          <div className="mt-3 space-y-4 text-forest-dark/75">
            <p>
              We believe the future of African agriculture depends on moving beyond fragmented production towards
              organised, market-oriented and commercially connected agricultural systems.
            </p>
            <p>
              We believe farmers deserve better market opportunities, businesses need dependable supply chains,
              investors need commercially viable opportunities, and agricultural communities deserve greater
              participation in the value created across the sector.
            </p>
          </div>
          <p className="mt-4 rounded-xl bg-forest text-natural-white px-6 py-4 font-heading text-lg font-semibold">
            This is the opportunity AgriXpert exists to pursue.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mt-16 border-t border-forest/10 pt-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">Our Mission &amp; Vision</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-forest">Our Mission</h3>
              <p className="mt-3 text-sm text-forest-dark/75">
                To integrate agricultural value chains by connecting farmers, businesses, service providers,
                processors and buyers through market-led solutions, strategic partnerships and coordinated
                agricultural services that improve productivity, strengthen market access and create sustainable
                commercial opportunities.
              </p>
            </div>
            <div className="rounded-2xl border border-forest/10 bg-white p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-forest">Our Vision</h3>
              <p className="mt-3 text-sm text-forest-dark/75">
                To become a leading agricultural value chain integration company in Africa, transforming how
                agricultural commodities are produced, sourced, aggregated, processed and connected to profitable
                markets.
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-forest-dark px-6 py-8 text-center text-natural-white">
            <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">Our Core Purpose</p>
            <p className="mt-2 font-heading text-xl font-bold">
              Making Agriculture Work Better for Everyone Across the Value Chain.
            </p>
          </div>
        </div>

        {/* Strategic Objectives */}
        <div className="mt-16 border-t border-forest/10 pt-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">Our Strategic Objectives</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-forest">
            We pursue our mission through six strategic priorities.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {strategicObjectives.map((o) => (
              <div key={o.number} className="rounded-xl border border-forest/10 bg-white p-5 shadow-sm">
                <span className="font-heading text-sm font-bold text-harvest-gold">{o.number}</span>
                <p className="mt-1 font-semibold text-forest-dark">{o.title}</p>
                <p className="mt-1 text-sm text-forest-dark/70">{o.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="mt-16 border-t border-forest/10 pt-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">Our Core Values</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-forest">
            Our values guide how we work, how we build partnerships and how we create value across agricultural
            value chains.
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coreValues.map((v, i) => (
              <div key={v.title} className="rounded-xl bg-forest/5 p-5">
                <span className="font-heading text-sm font-bold text-agri-green">0{i + 1}</span>
                <p className="mt-1 font-semibold text-forest-dark">{v.title}</p>
                <p className="mt-1 text-sm text-forest-dark/70">{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership */}
        <div id="leadership" className="mt-16 border-t border-forest/10 pt-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">Our Leadership</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-forest">
            Driven by Purpose. Connected by Opportunity.
          </h2>
          <div className="mt-4 space-y-4 text-forest-dark/75">
            <p>
              AgriXpert&apos;s ambition is driven by a commitment to building stronger agricultural enterprises,
              improving market connectivity and unlocking commercial opportunities across African agricultural
              value chains.
            </p>
            <p>
              Our leadership philosophy combines entrepreneurial thinking, business development, organisational
              development, agricultural enterprise support and strategic partnership development.
            </p>
            <p>
              We believe effective leadership in agriculture requires an understanding of both the realities of
              agricultural production and the commercial systems that make agricultural businesses sustainable.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-forest/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-forest font-heading text-xl font-bold text-natural-white">
                AY
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-forest">Amin Yahaya</h3>
                <p className="text-sm font-semibold text-harvest-gold">Chief Executive Officer | AgriXpert</p>
              </div>
            </div>
            <div className="mt-5 space-y-4 text-sm text-forest-dark/75">
              <p>
                Amin Yahaya is an organisational development and enterprise development professional with over
                eight years of experience supporting businesses, entrepreneurs and organisations to strengthen
                their operations, improve performance and pursue sustainable growth.
              </p>
              <p>
                His professional experience spans business development, enterprise acceleration, organisational
                transformation, strategic planning, market development and access to finance.
              </p>
              <p>
                Through his work with agribusinesses, startups and development programmes, he has supported more
                than 50 agribusinesses and contributed to strengthening entrepreneurial capacity, business
                systems and commercial opportunities.
              </p>
              <p>
                His experience includes engagements with enterprise development initiatives and agricultural
                innovation programmes, working with entrepreneurs and businesses to address operational
                challenges, develop growth strategies and improve their readiness for investment and market
                opportunities.
              </p>
              <p>
                At AgriXpert, his leadership focuses on developing an integrated agricultural value chain
                business model that connects agricultural production to commercial markets while building
                strategic partnerships across the agricultural ecosystem.
              </p>
            </div>
            <blockquote className="mt-6 border-l-4 border-harvest-gold bg-forest/5 px-5 py-4 text-sm italic text-forest-dark/80">
              &ldquo;Strong agricultural businesses are not built through production alone. They are built through
              the right systems, the right partnerships and access to markets that reward value creation.&rdquo;
            </blockquote>
          </div>

          <h3 className="mt-10 font-heading text-lg font-bold text-forest">Our Growing Network of Expertise</h3>
          <div className="mt-3 space-y-4 text-forest-dark/75">
            <p>AgriXpert recognises that transforming agricultural value chains requires diverse expertise.</p>
            <p>We are building relationships with professionals, businesses and institutions across:</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {expertiseAreas.map((area) => (
              <div key={area} className="flex gap-3 rounded-xl bg-forest/5 p-4 text-sm text-forest-dark/80">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-agri-green" />
                {area}
              </div>
            ))}
          </div>
          <p className="mt-4 text-forest-dark/75">
            Through these relationships, we seek to bring the right expertise and capabilities together to
            respond to specific agricultural opportunities.
          </p>

          <div className="mt-10 rounded-2xl bg-forest/5 px-6 py-8 text-center sm:px-10">
            <h3 className="font-heading text-xl font-bold text-forest">Become Part of Our Network</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm text-forest-dark/70">
              Are you an agricultural professional, service provider, commercial partner or investor interested in
              strengthening agricultural value chains? We welcome conversations with individuals and
              organisations that share our ambition.
            </p>
            <div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-3">
              <Link
                href="/partnerships"
                className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-natural-white hover:bg-forest-dark"
              >
                Partner With AgriXpert
              </Link>
              <Link
                href="/solutions"
                className="rounded-full border-2 border-forest px-5 py-2.5 text-sm font-semibold text-forest hover:bg-forest/10"
              >
                Explore Our Solutions
              </Link>
              <Link
                href="/contact"
                className="rounded-full border-2 border-forest px-5 py-2.5 text-sm font-semibold text-forest hover:bg-forest/10"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>

        {/* Our Commitment / Closing CTA */}
        <div className="mt-16 rounded-2xl bg-forest-dark px-6 py-10 text-center text-natural-white sm:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-harvest-gold">Our Commitment</p>
          <h2 className="mt-2 font-heading text-2xl font-bold">
            Building the Connections That Make Agriculture Work.
          </h2>
          <div className="mx-auto mt-4 max-w-2xl space-y-3 text-sm text-natural-white/80">
            <p>
              We are committed to developing agricultural value chains where farmers have stronger market
              opportunities, buyers can access dependable supplies, businesses can grow through value addition,
              and investors can participate in commercially viable opportunities.
            </p>
            <p>
              We recognise that meaningful transformation requires patience, partnerships, strong execution and a
              clear understanding of market realities.
            </p>
            <p>
              Our journey is about creating these connections, strengthening the businesses within them and
              contributing to a more competitive agricultural sector.
            </p>
          </div>
          <p className="mx-auto mt-6 max-w-2xl font-heading text-lg font-semibold">
            AgriXpert &ndash; Market-Led Agricultural Value Chain Integrator.
            <br />
            Connecting Agricultural Production to Profitable Markets.
          </p>
        </div>
      </section>
    </>
  );
}
