// Structured content for each of AgriXpert's six core business-solution
// pages, following the same "problem -> opportunity -> approach -> who
// benefits -> participate" commercial storytelling model used on the
// value-chain pages.

export type SolutionSection = {
  heading: string;
  intro: string;
  items: string[];
  closing?: string;
};

export type SolutionContent = {
  slug: string;
  number: string;
  name: string;
  tagline: string;
  heroImageKey:
    | "farmerField"
    | "aggregationBags"
    | "tractorField"
    | "cropFieldsAerial"
    | "teamMeeting"
    | "warehouseLogistics"
    | "packagingLine"
    | "handshake";
  overview: {
    intro: string;
    paragraphs: string[];
    proposition: string;
  };
  sections: SolutionSection[];
  whoBenefits: { label: string; body: string }[];
  partnerships: { intro: string; items: string[] };
  closing: {
    headline: string;
    body: string;
    ctas: { label: string; sub: string; href: string }[];
  };
};

export const solutionsContent: Record<string, SolutionContent> = {
  "production-coordination": {
    slug: "production-coordination",
    number: "01",
    name: "Production Coordination",
    tagline: "Turning Agricultural Production into Structured Commercial Opportunities.",
    heroImageKey: "farmerField",
    overview: {
      intro: "From Fragmented Farming to Coordinated Production",
      paragraphs: [
        "Agricultural production is the foundation of every successful agricultural value chain. Yet many farmers operate independently, make production decisions without sufficient market information and face challenges accessing the resources, technical support and commercial relationships needed to grow their businesses.",
        "For commercial buyers and processors, this fragmentation creates another challenge: securing consistent quantities of quality agricultural commodities at the right time.",
        "AgriXpert seeks to bridge this gap through structured production coordination that connects farmers, agricultural service providers and commercial buyers, aligning production activities with market demand and helping farmers understand what to produce, when to produce it and how to meet the requirements of intended markets.",
        "Our approach moves beyond individual farming activities towards coordinated production systems that create opportunities for farmers and more predictable supply arrangements for buyers.",
      ],
      proposition: "Organise production. Strengthen farmers. Supply markets with confidence.",
    },
    sections: [
      {
        heading: "Farmer Mobilisation & Network Development",
        intro:
          "Strong agricultural supply chains begin with organised farmers. AgriXpert seeks to mobilise individual farmers, farmer-based organisations, cooperatives, community groups and commercial producers into structured production networks. Our approach focuses on:",
        items: [
          "Identifying suitable farming communities.",
          "Mapping farmers and production capacity.",
          "Organising farmers into production groups.",
          "Assessing land availability and production potential.",
          "Establishing relationships with farmer organisations.",
          "Coordinating farmer participation around commercial opportunities.",
        ],
        closing: "By building organised farmer networks, we aim to create stronger connections between agricultural production and commercial markets.",
      },
      {
        heading: "Contract Farming & Outgrower Schemes",
        intro:
          "Commercial agriculture requires stronger relationships between producers and buyers. AgriXpert seeks to facilitate structured production arrangements that connect farmers with processors, commodity buyers and other commercial partners, which may include:",
        items: [
          "Pre-agreed production targets.",
          "Commodity specifications.",
          "Production schedules.",
          "Input and service arrangements.",
          "Technical support.",
          "Harvest and delivery schedules.",
          "Agreed purchasing and pricing mechanisms.",
        ],
        closing: "Our objective is to encourage transparent production and purchasing relationships that benefit both farmers and commercial buyers.",
      },
      {
        heading: "Production Planning & Scheduling",
        intro:
          "Successful production begins with proper planning. AgriXpert promotes market-informed production planning that considers crop selection, seasonal conditions, available resources, production capacity and anticipated buyer demand. Our proposed coordination activities include:",
        items: [
          "Crop and commodity selection.",
          "Seasonal production calendars.",
          "Land and acreage planning.",
          "Input requirements assessment.",
          "Production scheduling.",
          "Harvest forecasting.",
          "Production monitoring.",
          "Supply planning around market requirements.",
        ],
        closing: "This helps reduce production uncertainty and improves coordination between farmers and downstream market participants.",
      },
      {
        heading: "Farm Management Coordination",
        intro:
          "Good farm management is essential to improving productivity, controlling costs and achieving consistent output. AgriXpert seeks to coordinate access to appropriate farm management support, including:",
        items: [
          "Farm establishment and planning.",
          "Input application schedules.",
          "Crop monitoring.",
          "Good agricultural practices.",
          "Pest and disease management guidance.",
          "Labour and farm activity coordination.",
          "Production record-keeping.",
          "Harvest management.",
        ],
        closing: "Through appropriate technical and operational partnerships, we aim to strengthen farm-level performance.",
      },
    ],
    whoBenefits: [
      { label: "Farmers", body: "Access more organised production opportunities, technical support and potential market linkages." },
      { label: "Commercial buyers", body: "Build relationships with coordinated farmer networks and planned production volumes." },
      { label: "Processors", body: "Improve visibility of anticipated raw material availability." },
      { label: "Agricultural investors", body: "Explore structured production arrangements and scalable outgrower opportunities." },
      { label: "Development partners", body: "Support organised agricultural production and commercially sustainable farmer engagement." },
    ],
    partnerships: {
      intro: "We welcome collaboration with:",
      items: [
        "Farmer cooperatives and associations.",
        "Commercial agricultural producers.",
        "Food processors.",
        "Poultry feed manufacturers.",
        "Commodity buyers.",
        "Agricultural input suppliers.",
        "Mechanisation providers.",
        "Financial institutions.",
        "Agricultural development organisations.",
      ],
    },
    closing: {
      headline: "Let's Coordinate Production Around Real Market Opportunities.",
      body: "Are you a farmer seeking structured production opportunities? A buyer interested in developing an outgrower scheme? Or an organisation looking to coordinate agricultural production at scale? AgriXpert welcomes your partnership.",
      ctas: [
        { label: "Register as a Farmer Partner", sub: "Join a structured production network", href: "/for-farmers?commodity=Production%20Coordination#register" },
        { label: "Develop an Outgrower Scheme", sub: "Buyers and processors building supply", href: "/for-buyers?commodity=Production%20Coordination#enquiry" },
        { label: "Coordinate Contract Farming", sub: "Set up a structured production arrangement", href: "/contact?type=Partnership%20%26%20Investment&commodity=Production%20Coordination#form" },
        { label: "Discuss a Production Partnership", sub: "Explore collaboration with AgriXpert", href: "/contact?type=Partnership%20%26%20Investment&commodity=Production%20Coordination#form" },
      ],
    },
  },

  "aggregation-procurement": {
    slug: "aggregation-procurement",
    number: "02",
    name: "Aggregation & Procurement",
    tagline: "Bringing Agricultural Produce Together. Connecting Supply to Commercial Demand.",
    heroImageKey: "aggregationBags",
    overview: {
      intro: "Making Agricultural Supply More Reliable",
      paragraphs: [
        "Agricultural production is often fragmented across numerous farmers and communities. While individual farmers may produce valuable quantities of commodities, commercial buyers frequently require larger volumes, consistent quality and dependable delivery arrangements.",
        "This creates an important opportunity for organised agricultural aggregation and procurement.",
        "AgriXpert seeks to bridge the gap between dispersed agricultural production and commercial demand by facilitating structured commodity sourcing, aggregation and procurement arrangements — connecting farmers and suppliers to buyers, while helping processors, manufacturers, distributors and institutional purchasers access agricultural commodities through more coordinated sourcing systems.",
        "Our approach focuses on consolidating supply, improving quality management and strengthening commercial relationships across agricultural markets.",
      ],
      proposition: "Aggregate supply. Assure quality. Connect commodities to markets.",
    },
    sections: [
      {
        heading: "Commodity Sourcing",
        intro:
          "Reliable procurement begins with identifying the right suppliers and understanding available supply. AgriXpert seeks to develop sourcing relationships with farmers, cooperatives, aggregators and commercial producers across priority agricultural value chains. Our sourcing activities will consider:",
        items: [
          "Commodity availability.",
          "Production locations.",
          "Seasonal supply patterns.",
          "Available quantities.",
          "Supplier capacity.",
          "Quality requirements.",
          "Indicative pricing.",
          "Transportation and delivery arrangements.",
        ],
        closing: "Our objective is to build a sourcing network capable of responding to genuine commercial demand.",
      },
      {
        heading: "Farmer & Supplier Aggregation",
        intro:
          "Aggregation creates an opportunity to transform small and fragmented commodity volumes into commercially useful quantities. AgriXpert seeks to coordinate the collection and consolidation of agricultural commodities from multiple producers and suppliers. Our proposed activities include:",
        items: [
          "Identifying and registering suppliers.",
          "Mapping commodity availability.",
          "Establishing collection arrangements.",
          "Coordinating commodity deliveries.",
          "Consolidating supply volumes.",
          "Maintaining supplier records.",
          "Tracking aggregated quantities.",
        ],
        closing: "This approach can help farmers participate in larger markets while improving access to organised commodity supply for buyers.",
      },
      {
        heading: "Procurement Management",
        intro:
          "For commercial buyers, dependable procurement is essential to maintaining production, processing and distribution operations. AgriXpert aims to facilitate procurement processes that connect buyer requirements with suitable agricultural suppliers. Our procurement coordination may include:",
        items: [
          "Buyer requirement assessment.",
          "Commodity sourcing.",
          "Supplier identification and verification.",
          "Price and specification coordination.",
          "Purchase order management.",
          "Quantity verification.",
          "Delivery coordination.",
          "Procurement documentation.",
        ],
        closing: "Our objective is to make agricultural commodity sourcing more organised, transparent and responsive to buyer requirements.",
      },
      {
        heading: "Grading, Weighing & Quality Assurance",
        intro:
          "Commercial value depends not only on quantity but also on the quality of agricultural commodities. AgriXpert seeks to coordinate quality management processes that help ensure commodities meet agreed specifications. These may include:",
        items: [
          "Weighing and quantity verification.",
          "Moisture assessment.",
          "Cleaning and sorting.",
          "Commodity grading.",
          "Inspection for foreign materials.",
          "Quality documentation.",
          "Supplier quality records.",
          "Buyer acceptance verification.",
        ],
        closing: "Final quality requirements will be aligned with the commodity, applicable standards and buyer specifications.",
      },
      {
        heading: "Buyer–Supplier Matching",
        intro: "A successful aggregation system must connect available commodities to real purchasing opportunities. AgriXpert seeks to facilitate commercial relationships between:",
        items: [
          "Farmers and commodity buyers.",
          "Aggregators and processors.",
          "Agricultural cooperatives and institutional purchasers.",
          "Suppliers and food manufacturers.",
          "Producers and poultry feed companies.",
          "Local commodity suppliers and distributors.",
        ],
        closing: "We aim to create a more connected sourcing environment where buyers can communicate their requirements and suppliers can respond with available quantities and quality information.",
      },
    ],
    whoBenefits: [
      { label: "Farmers", body: "Opportunities to access organised commodity markets." },
      { label: "Aggregators", body: "Opportunities to participate in structured sourcing and procurement arrangements." },
      { label: "Processors", body: "Access to consolidated raw material supplies." },
      { label: "Institutional buyers", body: "More coordinated commodity procurement." },
      { label: "Distributors and traders", body: "Access to supplier networks and sourcing opportunities." },
    ],
    partnerships: {
      intro: "We welcome collaboration with:",
      items: [
        "Farmer groups and cooperatives.",
        "Commodity aggregators.",
        "Food processors.",
        "Feed manufacturers.",
        "Wholesale distributors.",
        "Institutional buyers.",
        "Warehouse operators.",
        "Quality inspection service providers.",
        "Financial institutions.",
      ],
    },
    closing: {
      headline: "Let's Connect Agricultural Supply to Commercial Demand.",
      body: "Are you a farmer looking for buyers? A processor requiring reliable raw materials? Or a business seeking to establish a structured agricultural procurement arrangement? Let's explore the opportunity together.",
      ctas: [
        { label: "Register as a Commodity Supplier", sub: "Farmers and aggregators joining our sourcing network", href: "/for-farmers?commodity=Aggregation%20%26%20Procurement#register" },
        { label: "Submit a Procurement Request", sub: "Tell us what you need to source", href: "/for-buyers?commodity=Aggregation%20%26%20Procurement#enquiry" },
        { label: "Source Agricultural Commodities", sub: "Browse aggregated supply opportunities", href: "/for-buyers?commodity=Aggregation%20%26%20Procurement#enquiry" },
        { label: "Become an Aggregation Partner", sub: "Warehouses, inspectors and logistics providers", href: "/contact?type=Partnership%20%26%20Investment&commodity=Aggregation%20%26%20Procurement#form" },
      ],
    },
  },

  "mechanisation-farm-services": {
    slug: "mechanisation-farm-services",
    number: "03",
    name: "Mechanisation & Farm Services",
    tagline: "Making Modern Agricultural Services More Accessible, Productive and Commercially Viable.",
    heroImageKey: "tractorField",
    overview: {
      intro: "Removing Barriers to Agricultural Productivity",
      paragraphs: [
        "Timely access to agricultural machinery and specialised farm services is essential for improving productivity, reducing labour constraints and expanding commercial agricultural production. However, many farmers and agricultural businesses face challenges accessing mechanisation services when they need them.",
        "Limited equipment availability, high acquisition costs, inadequate maintenance arrangements and seasonal demand can affect the efficiency of agricultural operations.",
        "AgriXpert seeks to address these challenges by coordinating access to mechanisation, irrigation, land development and other essential agricultural services, connecting farmers and commercial producers to equipment owners, service providers and technical partners through more organised service arrangements.",
        "We aim to make agricultural mechanisation more accessible while creating commercial opportunities for equipment owners and service providers.",
      ],
      proposition: "Better access to equipment. Timely farm operations. Improved production efficiency.",
    },
    sections: [
      {
        heading: "Land Preparation & Development",
        intro:
          "Successful farming begins with suitable land preparation and development. AgriXpert seeks to facilitate access to land preparation and development services for smallholder farmers, commercial producers and agricultural investors. Our proposed services include:",
        items: [
          "Land clearing and preparation.",
          "Ploughing and harrowing.",
          "Ridging and land levelling.",
          "Farm layout planning.",
          "Access road development coordination.",
          "Site preparation for irrigation.",
          "Farm establishment support.",
        ],
        closing: "Service delivery will depend on land conditions, equipment availability and qualified service providers.",
      },
      {
        heading: "Tractor & Equipment Services",
        intro: "Access to appropriate machinery can help farmers undertake essential agricultural activities more efficiently. AgriXpert seeks to coordinate access to:",
        items: [
          "Tractors.",
          "Ploughs and harrows.",
          "Planters and seed drills.",
          "Ridgers.",
          "Harvesting equipment.",
          "Sprayers.",
          "Trailers and transport equipment.",
          "Other specialised agricultural machinery.",
        ],
        closing: "Our model aims to connect farmers requiring services with available equipment owners and mechanisation providers.",
      },
      {
        heading: "Planting & Crop Establishment",
        intro:
          "Timely planting is critical to achieving successful crop establishment and managing agricultural production cycles. AgriXpert seeks to facilitate planting services and equipment coordination based on crop requirements and production schedules. These may include:",
        items: [
          "Land preparation coordination.",
          "Seedbed preparation.",
          "Mechanical planting.",
          "Row spacing and planting arrangements.",
          "Crop establishment support.",
          "Planting schedule coordination.",
        ],
        closing: "Our objective is to help farmers access timely services that support better-organised production.",
      },
      {
        heading: "Irrigation & Water Management",
        intro:
          "Reliable water access is essential for agricultural production, particularly where dry-season farming and year-round production opportunities are concerned. AgriXpert seeks to connect farmers and agricultural businesses to suitable irrigation solutions and technical service providers. Potential service areas include:",
        items: [
          "Irrigation system assessment.",
          "Solar-powered irrigation solutions.",
          "Pumping systems.",
          "Drip irrigation.",
          "Sprinkler irrigation.",
          "Water storage and distribution.",
          "Irrigation equipment sourcing.",
          "Irrigation system installation and maintenance through qualified partners.",
        ],
        closing: "Our ambition is to support more efficient water use and strengthen opportunities for year-round agricultural production.",
      },
      {
        heading: "Harvesting & Post-Harvest Services",
        intro:
          "Harvesting at the right time and using appropriate equipment can influence commodity quality, production costs and overall farm profitability. AgriXpert seeks to facilitate:",
        items: [
          "Mechanical harvesting.",
          "Harvesting equipment coordination.",
          "Threshing services.",
          "Shelling services.",
          "Crop handling.",
          "Produce collection coordination.",
          "Post-harvest equipment access.",
        ],
        closing: "These services will be coordinated according to crop requirements and available service providers.",
      },
      {
        heading: "Equipment Owners & Service Provider Network",
        intro:
          "Mechanisation also presents commercial opportunities for tractor owners, equipment suppliers, irrigation companies and specialised service providers. AgriXpert seeks to develop relationships with equipment owners and service providers who want to reach agricultural customers and participate in structured service delivery arrangements. Potential collaboration areas include:",
        items: [
          "Equipment rental and leasing.",
          "Pay-per-use service models.",
          "Equipment maintenance.",
          "Operator availability.",
          "Service scheduling.",
          "Equipment sourcing.",
          "Agricultural equipment distribution.",
        ],
      },
    ],
    whoBenefits: [
      { label: "Farmers", body: "Improved access to timely and appropriate farm services." },
      { label: "Commercial producers", body: "Opportunities to improve operational efficiency." },
      { label: "Equipment owners", body: "Opportunities to reach customers and generate equipment-service revenue." },
      { label: "Agricultural investors", body: "Opportunities to invest in mechanisation and irrigation services." },
      { label: "Agricultural businesses", body: "Access to coordinated equipment and specialised service providers." },
    ],
    partnerships: {
      intro: "We welcome collaboration with:",
      items: [
        "Tractor owners and operators.",
        "Agricultural machinery dealers.",
        "Irrigation companies.",
        "Solar technology providers.",
        "Equipment leasing companies.",
        "Agricultural engineering firms.",
        "Farm service providers.",
        "Financial institutions.",
        "Agricultural investors.",
      ],
    },
    closing: {
      headline: "Let's Make Agricultural Mechanisation More Accessible.",
      body: "Are you a farmer requiring tractor or irrigation services? An equipment owner seeking customers? Or an investor interested in agricultural mechanisation? AgriXpert welcomes your enquiry.",
      ctas: [
        { label: "Request Mechanisation Services", sub: "Tractors, land prep, irrigation and more", href: "/for-farmers?commodity=Mechanisation%20%26%20Farm%20Services#register" },
        { label: "Register as an Equipment Provider", sub: "Reach farmers who need your services", href: "/contact?type=Partnership%20%26%20Investment&commodity=Mechanisation%20%26%20Farm%20Services#form" },
        { label: "Explore Irrigation Solutions", sub: "Solar, drip and water-management partners", href: "/contact?type=General%20Enquiry&commodity=Mechanisation%20%26%20Farm%20Services#form" },
        { label: "Discuss an Equipment Partnership", sub: "Dealers, lessors and engineering firms", href: "/contact?type=Partnership%20%26%20Investment&commodity=Mechanisation%20%26%20Farm%20Services#form" },
      ],
    },
  },

  "storage-supply-chain": {
    slug: "storage-supply-chain",
    number: "04",
    name: "Storage & Supply Chain Management",
    tagline: "Protecting Agricultural Value. Improving Commodity Movement. Strengthening Supply Reliability.",
    heroImageKey: "warehouseLogistics",
    overview: {
      intro: "Preserving Value Beyond the Farm Gate",
      paragraphs: [
        "Agricultural value is not created through production alone. How commodities are handled, stored, transported and delivered determines whether farmers and agricultural businesses can preserve quality and capture their full commercial potential.",
        "Poor storage arrangements, inadequate handling, inefficient transportation and limited inventory visibility can contribute to post-harvest losses, quality deterioration and supply disruptions. For commercial buyers, these challenges can affect procurement planning, production schedules and customer commitments.",
        "AgriXpert seeks to strengthen agricultural supply chains by coordinating storage, commodity handling, inventory management, transportation and traceability arrangements — connecting production and aggregation activities to dependable delivery systems, helping agricultural commodities move more efficiently from sourcing locations to their intended markets.",
      ],
      proposition: "Preserve quality. Manage inventory. Deliver with confidence.",
    },
    sections: [
      {
        heading: "Warehousing & Storage Solutions",
        intro:
          "Appropriate storage is essential for maintaining commodity quality and ensuring availability beyond the immediate harvesting period. AgriXpert seeks to facilitate access to suitable warehousing and storage facilities through commercial and infrastructure partnerships. Our proposed activities include:",
        items: [
          "Identifying suitable storage facilities.",
          "Coordinating warehouse access.",
          "Commodity storage planning.",
          "Storage condition monitoring.",
          "Stock documentation.",
          "Inventory reporting.",
          "Warehouse partner coordination.",
          "Commodity dispatch management.",
        ],
        closing: "Storage arrangements will be determined by commodity characteristics, required conditions and applicable safety standards.",
      },
      {
        heading: "Commodity Handling & Post-Harvest Management",
        intro:
          "The way agricultural commodities are handled after harvesting can significantly influence their market value. AgriXpert seeks to coordinate appropriate post-harvest management processes, including:",
        items: [
          "Produce collection.",
          "Cleaning and sorting.",
          "Drying.",
          "Grading.",
          "Packaging.",
          "Weighing and documentation.",
          "Handling and loading.",
          "Commodity preservation.",
        ],
        closing: "For moisture-sensitive commodities, we aim to explore suitable storage and temperature-management partnerships.",
      },
      {
        heading: "Inventory Management",
        intro: "Effective inventory management provides visibility into available quantities, commodity movements and stock levels. AgriXpert seeks to promote structured inventory management systems that support:",
        items: [
          "Commodity stock records.",
          "Inbound and outbound tracking.",
          "Warehouse stock reconciliation.",
          "Batch identification.",
          "Inventory movement records.",
          "Stock availability reporting.",
          "Storage duration monitoring.",
          "Dispatch documentation.",
        ],
        closing: "Our objective is to improve transparency and support better procurement and supply planning.",
      },
      {
        heading: "Transportation & Logistics Coordination",
        intro:
          "Agricultural commodities must move efficiently between production communities, aggregation centres, warehouses, processing facilities and commercial buyers. AgriXpert seeks to coordinate logistics arrangements through relationships with transport operators and supply-chain service providers. Potential services include:",
        items: [
          "Farm-to-aggregation transportation.",
          "Warehouse-to-processor delivery.",
          "Commodity distribution.",
          "Vehicle and transporter coordination.",
          "Delivery scheduling.",
          "Route planning.",
          "Dispatch documentation.",
          "Delivery confirmation.",
        ],
        closing: "Our focus is to improve coordination between commodity availability and delivery requirements.",
      },
      {
        heading: "Traceability & Supply Chain Visibility",
        intro: "Commercial buyers increasingly require information about the origin, handling and movement of agricultural commodities. AgriXpert aims to develop digital and operational systems that improve supply-chain visibility. Potential capabilities include:",
        items: [
          "Supplier identification.",
          "Commodity origin records.",
          "Farm and sourcing location information.",
          "Batch identification.",
          "Aggregation records.",
          "Warehouse movement tracking.",
          "Delivery records.",
          "Supplier and buyer transaction histories.",
        ],
        closing: "These capabilities can support transparency, accountability and stronger commercial relationships.",
      },
    ],
    whoBenefits: [
      { label: "Farmers", body: "Better opportunities to preserve commodity quality and reduce avoidable post-harvest losses." },
      { label: "Aggregators", body: "Improved storage and inventory coordination." },
      { label: "Processors", body: "More visibility into raw material availability." },
      { label: "Buyers", body: "Better coordination of commodity deliveries." },
      { label: "Warehouse operators", body: "Opportunities to provide storage and handling services." },
      { label: "Transport operators", body: "Access to structured agricultural logistics opportunities." },
    ],
    partnerships: {
      intro: "We welcome partnerships with:",
      items: [
        "Warehouse operators.",
        "Grain storage companies.",
        "Cold-chain providers.",
        "Transportation companies.",
        "Logistics operators.",
        "Packaging companies.",
        "Digital traceability providers.",
        "Commodity processors.",
        "Institutional buyers.",
      ],
    },
    closing: {
      headline: "Let's Build More Reliable Agricultural Supply Chains.",
      body: "Are you a warehouse operator, transport company, commodity buyer or agricultural producer seeking improved storage and logistics arrangements? Let's explore how we can work together.",
      ctas: [
        { label: "Enquire About Storage Solutions", sub: "Warehousing, handling and inventory support", href: "/contact?type=General%20Enquiry&commodity=Storage%20%26%20Supply%20Chain%20Management#form" },
        { label: "Request Transportation Services", sub: "Farm-to-market logistics coordination", href: "/for-buyers?commodity=Storage%20%26%20Supply%20Chain%20Management#enquiry" },
        { label: "Become a Logistics Partner", sub: "Warehouse, cold-chain and transport operators", href: "/contact?type=Partnership%20%26%20Investment&commodity=Storage%20%26%20Supply%20Chain%20Management#form" },
        { label: "Discuss a Supply Chain Partnership", sub: "Traceability, packaging and digital systems", href: "/contact?type=Partnership%20%26%20Investment&commodity=Storage%20%26%20Supply%20Chain%20Management#form" },
      ],
    },
  },

  "processing-value-addition": {
    slug: "processing-value-addition",
    number: "05",
    name: "Processing & Value Addition",
    tagline: "Transforming Agricultural Commodities into Higher-Value Commercial Products.",
    heroImageKey: "packagingLine",
    overview: {
      intro: "Moving Beyond Raw Agricultural Production",
      paragraphs: [
        "Agricultural commodities create greater economic opportunities when they can be transformed into products that meet the needs of consumers, manufacturers and commercial markets. However, many agricultural value chains remain heavily dependent on the sale of raw commodities, limiting opportunities for local processing, product development, employment creation and value retention.",
        "AgriXpert seeks to strengthen agricultural value addition by connecting producers, commodity aggregators, processors, equipment suppliers and commercial buyers.",
        "Our approach focuses on facilitating access to processing infrastructure, coordinating raw material supply and developing commercial relationships that support agricultural transformation. From cleaning and drying to milling, packaging and specialised processing, we aim to help create stronger connections between agricultural production and value-added markets.",
      ],
      proposition: "Add value locally. Strengthen agricultural businesses. Expand market opportunities.",
    },
    sections: [
      {
        heading: "Cleaning & Pre-Processing",
        intro:
          "Quality processing begins with proper preparation of agricultural raw materials. AgriXpert seeks to facilitate access to cleaning and pre-processing services that improve commodity suitability for subsequent processing and commercial use. Potential activities include:",
        items: [
          "Cleaning and removal of foreign materials.",
          "Sorting and separation.",
          "Shelling and threshing.",
          "Drying.",
          "Preliminary grading.",
          "Moisture assessment.",
          "Raw material preparation.",
        ],
        closing: "The specific services will depend on the commodity and intended processing requirements.",
      },
      {
        heading: "Drying & Quality Preparation",
        intro: "Moisture management is essential for many agricultural commodities, particularly grains and oilseeds. AgriXpert seeks to coordinate access to appropriate drying infrastructure and services. These may include:",
        items: [
          "Mechanical drying.",
          "Solar drying solutions.",
          "Moisture assessment.",
          "Drying and handling equipment.",
          "Quality checks.",
          "Post-drying storage coordination.",
        ],
        closing: "Our objective is to help preserve raw material quality and improve readiness for processing and commercial distribution.",
      },
      {
        heading: "Grading & Product Standardisation",
        intro: "Commercial markets require products that meet defined quality and presentation requirements. AgriXpert seeks to facilitate grading and standardisation arrangements that help processors and buyers receive commodities according to agreed specifications. These may include:",
        items: [
          "Commodity classification.",
          "Size grading.",
          "Quality inspection.",
          "Product sorting.",
          "Batch identification.",
          "Packaging preparation.",
          "Quality documentation.",
        ],
        closing: "Final grading arrangements will follow applicable commodity standards and buyer requirements.",
      },
      {
        heading: "Milling & Processing Partnerships",
        intro:
          "Processing infrastructure creates opportunities to transform raw agricultural commodities into products with additional commercial value. AgriXpert seeks to develop relationships with processing companies and infrastructure operators across priority value chains, including:",
        items: [
          "Maize: Flour, grits and other maize-based products.",
          "Soybeans: Soybean meal, edible oil and food ingredients.",
          "Rice: Milled rice, packaged rice and milling by-products.",
          "Groundnuts: Groundnut oil, peanut butter and other food products.",
        ],
        closing: "Our role is to facilitate commercial connections between raw material suppliers, processors and downstream markets.",
      },
      {
        heading: "Packaging & Product Development",
        intro: "Packaging and product presentation influence how agricultural products access different commercial markets. AgriXpert seeks to explore partnerships that support:",
        items: [
          "Product packaging.",
          "Labelling.",
          "Packaging material sourcing.",
          "Product presentation.",
          "Private-label opportunities.",
          "Brand development.",
          "Market-oriented product specifications.",
        ],
        closing: "All food products must meet relevant food safety, labelling and regulatory requirements.",
      },
      {
        heading: "Commercialisation & Market Linkages",
        intro: "Processing investments must be connected to viable markets. AgriXpert seeks to facilitate commercial relationships between processors and potential buyers, including:",
        items: [
          "Wholesale distributors.",
          "Supermarkets and retailers.",
          "Food manufacturers.",
          "Hospitality businesses.",
          "Institutional buyers.",
          "Exporters.",
          "Industrial commodity users.",
        ],
        closing: "Our approach is to encourage market-led processing decisions rather than investing in processing capacity without sufficient demand validation.",
      },
    ],
    whoBenefits: [
      { label: "Farmers", body: "Potentially stronger demand for agricultural raw materials." },
      { label: "Processors", body: "Opportunities to access organised commodity supplies and commercial markets." },
      { label: "Investors", body: "Opportunities to explore agricultural processing infrastructure and value-added products." },
      { label: "Consumers", body: "Access to processed agricultural products that meet market and quality requirements." },
      { label: "Local communities", body: "Potential employment and enterprise development opportunities." },
    ],
    partnerships: {
      intro: "We welcome collaboration with:",
      items: [
        "Agricultural processors.",
        "Milling companies.",
        "Food manufacturers.",
        "Packaging companies.",
        "Processing equipment suppliers.",
        "Commodity aggregators.",
        "Investors.",
        "Financial institutions.",
        "Food distribution companies.",
        "Export businesses.",
      ],
    },
    closing: {
      headline: "Let's Turn Agricultural Commodities into Greater Value.",
      body: "Are you a processor looking for reliable raw materials? An investor exploring agro-processing opportunities? Or a business interested in developing agricultural products? Let's explore the possibilities.",
      ctas: [
        { label: "Explore Processing Partnerships", sub: "Millers, manufacturers and equipment suppliers", href: "/contact?type=Partnership%20%26%20Investment&commodity=Processing%20%26%20Value%20Addition#form" },
        { label: "Source Agricultural Raw Materials", sub: "Connect with aggregated commodity supply", href: "/for-buyers?commodity=Processing%20%26%20Value%20Addition#enquiry" },
        { label: "Discuss a Value Addition Investment", sub: "Explore agro-processing infrastructure", href: "/contact?type=Partnership%20%26%20Investment&commodity=Processing%20%26%20Value%20Addition#form" },
        { label: "Become a Processing Partner", sub: "Join our value-addition network", href: "/contact?type=Partnership%20%26%20Investment&commodity=Processing%20%26%20Value%20Addition#form" },
      ],
    },
  },

  "market-access-trade": {
    slug: "market-access-trade",
    number: "06",
    name: "Market Access & Commercial Trade",
    tagline: "Connecting Agricultural Producers to Buyers. Turning Market Opportunities into Commercial Transactions.",
    heroImageKey: "handshake",
    overview: {
      intro: "Making Markets Work Better for Agriculture",
      paragraphs: [
        "Agricultural production becomes commercially meaningful when farmers and businesses can sell their commodities at viable prices through dependable market relationships. Yet many agricultural producers struggle to identify reliable buyers, negotiate commercial arrangements, meet purchasing specifications and coordinate deliveries.",
        "At the same time, processors, manufacturers, distributors and institutional buyers require consistent supplies of agricultural commodities that meet their operational needs.",
        "AgriXpert seeks to bridge this gap by facilitating market access, buyer sourcing, offtake arrangements, commodity trading and commercial partnerships — connecting agricultural supply to actual market demand, helping producers identify commercial opportunities while enabling buyers to source commodities through more organised supply relationships.",
        "We aim to build a commercially responsive agricultural ecosystem where production, aggregation and procurement are connected to viable market opportunities.",
      ],
      proposition: "Find the market. Connect the supply. Deliver commercial value.",
    },
    sections: [
      {
        heading: "Buyer Sourcing & Market Identification",
        intro:
          "Access to the right buyers is essential for sustainable agricultural businesses. AgriXpert seeks to identify and develop relationships with potential buyers across domestic, regional and, where commercially viable, international markets. Potential buyer segments include:",
        items: [
          "Food processing companies.",
          "Poultry feed manufacturers.",
          "Livestock feed producers.",
          "Commodity traders.",
          "Wholesale distributors.",
          "Supermarkets and retailers.",
          "Hotels and hospitality businesses.",
          "Institutional procurement organisations.",
          "Export businesses.",
        ],
        closing: "Our approach focuses on understanding buyer requirements and matching them with suitable agricultural supply opportunities.",
      },
      {
        heading: "Offtake Facilitation",
        intro:
          "Offtake arrangements can help create stronger relationships between producers and commercial buyers. AgriXpert seeks to facilitate structured offtake opportunities that connect farmers, cooperatives, aggregators and commercial producers to buyers. Depending on the commercial arrangement, these may involve:",
        items: [
          "Buyer requirement identification.",
          "Commodity and quality specifications.",
          "Estimated purchasing volumes.",
          "Supply schedules.",
          "Pricing mechanisms.",
          "Delivery arrangements.",
          "Payment terms.",
          "Contractual documentation.",
        ],
        closing: "Offtake arrangements will be subject to buyer confirmation, supply capacity, due diligence and mutually agreed contractual terms.",
      },
      {
        heading: "Commodity Trading",
        intro:
          "Agricultural commodity trading presents opportunities to connect available supply with market demand. AgriXpert seeks to explore commercial trading opportunities across selected agricultural commodities, subject to verified supply, buyer demand, pricing, quality and working-capital requirements. Potential trading activities include:",
        items: [
          "Commodity sourcing.",
          "Supplier negotiations.",
          "Buyer negotiations.",
          "Purchase and sale coordination.",
          "Commodity grading and verification.",
          "Order management.",
          "Delivery coordination.",
          "Transaction documentation.",
        ],
        closing: "Our approach will prioritise commercially viable transactions and transparent trading relationships.",
      },
      {
        heading: "Institutional & Bulk Supply",
        intro:
          "Large-scale buyers often require reliable commodity volumes, consistent quality and structured procurement arrangements. AgriXpert seeks to develop supply relationships with organisations that require agricultural commodities for food production, manufacturing, distribution and institutional consumption. Potential market segments include:",
        items: [
          "Food manufacturers.",
          "Feed manufacturing companies.",
          "Hospitality businesses.",
          "Wholesale distributors.",
          "Retail chains.",
          "Institutional catering businesses.",
          "Other bulk commodity purchasers.",
        ],
        closing: "We aim to coordinate supply arrangements that respond to buyer specifications and delivery requirements.",
      },
      {
        heading: "Commercial Partnerships & Market Development",
        intro:
          "Building sustainable agricultural markets requires more than individual transactions. AgriXpert seeks to develop long-term commercial relationships with businesses and institutions that can strengthen agricultural production, procurement, processing and distribution. Potential partnership arrangements include:",
        items: [
          "Strategic sourcing agreements.",
          "Long-term supply relationships.",
          "Commodity aggregation partnerships.",
          "Processing and distribution partnerships.",
          "Joint agricultural production arrangements.",
          "Institutional procurement partnerships.",
          "Regional commodity trade relationships.",
        ],
        closing: "Our objective is to build commercial relationships that create value for all participating actors.",
      },
      {
        heading: "Market Intelligence & Commercial Information",
        intro: "Good commercial decisions depend on reliable market information. AgriXpert aims to strengthen market intelligence capabilities that support producers, buyers and agricultural businesses. Potential information services include:",
        items: [
          "Commodity price monitoring.",
          "Seasonal market analysis.",
          "Buyer demand assessments.",
          "Commodity availability information.",
          "Market opportunity identification.",
          "Supply and demand analysis.",
          "Commercial sourcing intelligence.",
        ],
        closing: "Market information will be presented with appropriate dates, geographical coverage and source references.",
      },
    ],
    whoBenefits: [
      { label: "Farmers", body: "Better access to buyer networks and commercial market opportunities." },
      { label: "Aggregators", body: "Opportunities to supply larger commercial markets." },
      { label: "Processors", body: "Access to potential raw material suppliers and structured procurement relationships." },
      { label: "Commodity traders", body: "Opportunities to develop new sourcing and distribution relationships." },
      { label: "Institutional buyers", body: "More coordinated agricultural commodity sourcing." },
      { label: "Investors", body: "Opportunities to explore commercial agricultural trade and supply-chain investments." },
    ],
    partnerships: {
      intro: "We welcome collaboration with:",
      items: [
        "Domestic and regional commodity buyers.",
        "Food processors.",
        "Poultry feed manufacturers.",
        "Commodity traders.",
        "Institutional procurement organisations.",
        "Export businesses.",
        "Wholesale distributors.",
        "Farmer cooperatives.",
        "Logistics companies.",
        "Financial institutions.",
      ],
    },
    closing: {
      headline: "Let's Turn Agricultural Market Opportunities into Business.",
      body: "Are you a farmer seeking buyers? A manufacturer looking for raw materials? An institutional buyer requiring bulk agricultural commodities? Or a commercial investor exploring agricultural trade? AgriXpert is ready to explore potential collaboration.",
      ctas: [
        { label: "Submit a Commodity Sourcing Request", sub: "Tell us your buyer requirements", href: "/for-buyers?commodity=Market%20Access%20%26%20Commercial%20Trade#enquiry" },
        { label: "Find Agricultural Supply Opportunities", sub: "Farmers and aggregators seeking buyers", href: "/for-farmers?commodity=Market%20Access%20%26%20Commercial%20Trade#register" },
        { label: "Discuss an Offtake Arrangement", sub: "Structured buyer-producer agreements", href: "/contact?type=Partnership%20%26%20Investment&commodity=Market%20Access%20%26%20Commercial%20Trade#form" },
        { label: "Become a Commercial Partner", sub: "Traders, distributors and institutions", href: "/contact?type=Partnership%20%26%20Investment&commodity=Market%20Access%20%26%20Commercial%20Trade#form" },
      ],
    },
  },
};

export const solutionsList = Object.values(solutionsContent).sort((a, b) => a.number.localeCompare(b.number));
