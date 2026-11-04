// Stock photography sourced from Unsplash (free to use under the Unsplash
// License). Hotlinked via next/image remotePatterns rather than stored
// locally. Replace with AgriXpert's own photography when available —
// these are placeholders, not AgriXpert's actual farmers, fields or sites.
export const stockImages = {
  heroField: {
    src: "https://images.unsplash.com/photo-1704270269033-9600fcc6d0d7?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "A farmer standing in a cornfield",
  },
  farmerField: {
    src: "https://images.unsplash.com/photo-1647463121865-696ca458e9d5?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    alt: "A farmer standing in a cornfield",
  },
  aggregationBags: {
    src: "https://images.unsplash.com/photo-1774946103680-3d34a461a581?fm=jpg&q=80&w=1600&auto=format&fit=crop",
    alt: "Neatly stacked sacks of aggregated commodity in a warehouse, ready for market",
  },
  teamMeeting: {
    src: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "A group of people in a professional meeting",
  },
  tractorField: {
    src: "https://images.unsplash.com/photo-1717702576954-c07131c54169?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "A tractor preparing land in a field at sunset",
  },
  cropFieldsAerial: {
    src: "https://images.unsplash.com/photo-1757518417669-eaf434a7d877?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "Aerial view of agricultural fields with varied crops",
  },
  dataCharts: {
    src: "https://images.unsplash.com/photo-1763038311036-6d18805537e5?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "A person reviewing data charts and graphs on a laptop",
  },
  handshake: {
    src: "https://images.unsplash.com/photo-1752159400890-d906038f1b35?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "Two business partners shaking hands in agreement",
  },
  conferenceTable: {
    src: "https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "People at a conference table in discussion",
  },
  dataScreen: {
    src: "https://images.unsplash.com/photo-1686061593213-98dad7c599b9?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "A computer screen displaying data",
  },
  documentSigning: {
    src: "https://images.unsplash.com/photo-1763729805496-b5dbf7f00c79?fm=jpg&q=80&w=2400&auto=format&fit=crop",
    alt: "A hand signing a document with a pen",
  },
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "What We Do", href: "/what-we-do" },
  { label: "Value Chains", href: "/value-chains" },
  { label: "For Farmers", href: "/for-farmers" },
  { label: "For Buyers", href: "/for-buyers" },
  { label: "Insights", href: "/insights" },
  { label: "Partnerships", href: "/partnerships" },
  { label: "Contact", href: "/contact" },
];

export const portalCta = { label: "Farmer / Buyer Portal", href: "/portal" };

export const problems = [
  {
    title: "Fragmented Production",
    body: "Farmers operate independently, making it difficult to coordinate reliable commercial supply.",
  },
  {
    title: "Post-Harvest Losses",
    body: "Limited storage, handling and processing infrastructure affects product quality and value.",
  },
  {
    title: "Market Access Barriers",
    body: "Farmers struggle to connect with reliable buyers and commercial markets.",
  },
  {
    title: "Production Constraints",
    body: "Limited access to mechanisation, inputs, financing and technical services.",
  },
];

export const coreFunctions = [
  "Coordinate agricultural production.",
  "Aggregate and manage agricultural commodities.",
  "Connect producers to commercial buyers.",
  "Facilitate processing, logistics and value addition.",
];

export const solutions = [
  {
    number: "01",
    title: "Production Coordination",
    anchor: "production-coordination",
    body: "Farmer mobilisation, contract farming, production planning, outgrower schemes and farm management coordination.",
    cta: "Explore production solutions",
  },
  {
    number: "02",
    title: "Aggregation & Procurement",
    anchor: "aggregation-procurement",
    body: "Commodity sourcing, farmer aggregation, procurement, grading, weighing and quality assurance.",
    cta: "Explore aggregation",
  },
  {
    number: "03",
    title: "Mechanisation & Farm Services",
    anchor: "mechanisation-farm-services",
    body: "Tractor services, land preparation, land development, planting, harvesting, irrigation and agricultural equipment coordination.",
    cta: "Explore farm services",
  },
  {
    number: "04",
    title: "Storage & Supply Chain Management",
    anchor: "storage-supply-chain",
    body: "Warehousing, inventory management, commodity handling, transportation and traceability.",
    cta: "Explore supply chain solutions",
  },
  {
    number: "05",
    title: "Processing & Value Addition",
    anchor: "processing-value-addition",
    body: "Cleaning, drying, grading, milling, packaging and connecting commodities to processing facilities.",
    cta: "Explore processing solutions",
  },
  {
    number: "06",
    title: "Market Access & Commercial Trade",
    anchor: "market-access-trade",
    body: "Buyer sourcing, offtake facilitation, commodity trading, institutional supply and commercial partnerships.",
    cta: "Explore market solutions",
  },
].map((s) => ({ ...s, href: `/what-we-do#${s.anchor}` }));

export const valueChains = [
  { name: "Maize", slug: "maize", body: "Food processing, poultry feed and commercial supply." },
  { name: "Soybeans", slug: "soybeans", body: "Feed manufacturing, oil processing and industrial markets." },
  { name: "Rice", slug: "rice", body: "Production, aggregation, milling and institutional supply." },
  { name: "Groundnuts", slug: "groundnuts", body: "Food processing, oil production and commodity trade." },
  { name: "Shea", slug: "shea", body: "Raw material sourcing and processing opportunities." },
  { name: "Vegetables", slug: "vegetables", body: "Fresh produce sourcing and structured supply." },
];

export const businessModelSteps = [
  {
    title: "Farmer mobilisation",
    body: "Identify farmers, cooperatives and production communities.",
  },
  {
    title: "Production coordination",
    body: "Coordinate production plans, inputs, mechanisation and technical support.",
  },
  {
    title: "Aggregation and quality control",
    body: "Collect, grade, weigh and consolidate commodities.",
  },
  {
    title: "Storage and processing",
    body: "Manage post-harvest handling, warehousing and processing partnerships.",
  },
  {
    title: "Commercial market linkage",
    body: "Connect commodities to verified buyers and institutional markets.",
  },
  {
    title: "Delivery and performance measurement",
    body: "Manage fulfilment, transactions, traceability and supply-chain performance.",
  },
];

export const farmerValueProps = [
  "Access to structured markets.",
  "Production planning and technical support.",
  "Mechanisation and agricultural services.",
  "Commodity aggregation.",
  "Quality and post-harvest support.",
  "Potential access to finance through financial partners.",
];

export const buyerValueProps = [
  "Submit commodity sourcing requests.",
  "Specify commodity, quantity and quality.",
  "Access aggregated supply opportunities.",
  "Establish procurement relationships.",
  "Explore long-term supply arrangements.",
];

export const digitalCapabilities = [
  "Digital farmer registration.",
  "Farm and production records.",
  "Commodity availability tracking.",
  "Buyer and supplier management.",
  "Commodity pricing and market intelligence.",
  "Digital traceability.",
  "Supply-chain performance dashboards.",
];

// Placeholder only: no verified figures have been supplied yet.
// Replace each value before this section goes live publicly.
export const impactIndicators = [
  { label: "Farmers engaged", measurement: "Number of registered and active farmers", value: "Figures pending verification" },
  { label: "Production coordinated", measurement: "Hectares or tonnes", value: "Figures pending verification" },
  { label: "Commodities aggregated", measurement: "Tonnes per season", value: "Figures pending verification" },
  { label: "Buyers connected", measurement: "Active commercial buyers", value: "Figures pending verification" },
  { label: "Jobs supported", measurement: "Direct and indirect employment", value: "Figures pending verification" },
  { label: "Women and youth", measurement: "Participation and economic opportunities", value: "Figures pending verification" },
];

export const footerColumns = [
  {
    heading: "AgriXpert",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about#story" },
      { label: "Leadership", href: "/about#leadership" },
    ],
  },
  {
    heading: "Solutions",
    links: [
      { label: "Production Coordination", href: "/what-we-do#production-coordination" },
      { label: "Aggregation & Procurement", href: "/what-we-do#aggregation-procurement" },
      { label: "Mechanisation & Farm Services", href: "/what-we-do#mechanisation-farm-services" },
      { label: "Processing & Value Addition", href: "/what-we-do#processing-value-addition" },
    ],
    // Kept as literal anchors above: these must stay in sync with the `anchor`
    // field on each entry in `solutions`.
  },
  {
    heading: "Value Chains",
    links: [
      { label: "Maize", href: "/value-chains/maize" },
      { label: "Soybeans", href: "/value-chains/soybeans" },
      { label: "Rice", href: "/value-chains/rice" },
      { label: "Groundnuts", href: "/value-chains/groundnuts" },
    ],
  },
  {
    heading: "Get Involved",
    links: [
      { label: "For Farmers", href: "/for-farmers" },
      { label: "For Buyers", href: "/for-buyers" },
      { label: "Partnerships", href: "/partnerships" },
    ],
  },
  {
    heading: "Contact",
    links: [
      // Phone and address are still placeholders — replace once confirmed.
      { label: "agrixpert@samakose.com", href: "mailto:agrixpert@samakose.com" },
      { label: "+233 (0) 00-000-0000", href: "/contact" },
      { label: "Tamale, Northern Ghana", href: "/contact" },
    ],
  },
];

export const enquiryTypes = [
  "General Enquiry",
  "Farmer Registration & Partnership",
  "Buyer / Commodity Sourcing",
  "Partnership & Investment",
  "Media & Press",
  "Other",
];

export const contactEmail = "agrixpert@samakose.com";
