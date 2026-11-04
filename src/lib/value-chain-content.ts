// Structured content for each value-chain page, following the commercial
// opportunity-story journey: Opportunity -> Production -> Farmers ->
// Coordination -> Aggregation -> Quality -> Markets -> Partnerships -> CTA.

export type ValueChainContent = {
  slug: string;
  name: string;
  tagline: string;
  heroImageKey: "maizeHarvest" | "soybeanField" | "ricePaddy" | "groundnutsPile";
  overview: {
    intro: string;
    paragraphs: string[];
    proposition?: string;
  };
  sourcing: {
    intro: string;
    factors: string[];
    note: string;
  };
  farmerNetwork: {
    intro: string;
    groups: string[];
    closing: string;
  };
  coordination: {
    intro: string;
    items: string[];
    closing: string;
  };
  aggregation: {
    intro: string;
    items: string[];
    closing: string;
  };
  quality: {
    intro: string;
    groups: { label?: string; items: string[] }[];
    closing: string;
  };
  markets: {
    intro: string;
    items: { label: string; body: string }[];
    closing: string;
  };
  partnerships: {
    intro: string;
    items: string[];
  };
  closing: {
    headline: string;
    body: string;
  };
};

export const valueChainContent: Record<string, ValueChainContent> = {
  maize: {
    slug: "maize",
    name: "Maize",
    tagline: "From the Farmer's Field to the Industries That Feed a Nation.",
    heroImageKey: "maizeHarvest",
    overview: {
      intro: "Turning Maize Production into Commercial Opportunity",
      paragraphs: [
        "Maize is more than a staple food. It is a critical commodity supporting food security, livestock production, poultry feed manufacturing and agro-industrial development.",
        "Across Ghana, demand for maize creates opportunities for farmers, aggregators, processors, feed manufacturers and commodity traders. However, unlocking this opportunity requires more than increasing production. It requires reliable supply, coordinated production systems, appropriate post-harvest handling and dependable connections to commercial markets.",
        "At AgriXpert, we are building a market-led maize value chain that connects farmers to commercial buyers while helping businesses access quality maize through more coordinated sourcing and aggregation arrangements. Our ambition is to transform fragmented maize production into a more organised, commercially responsive and sustainable supply system.",
      ],
      proposition: "Grow with the market. Supply with confidence. Create value at every stage.",
    },
    sourcing: {
      intro:
        "AgriXpert seeks to establish structured maize sourcing networks across major production areas, beginning with opportunities in Northern Ghana and expanding as commercial demand develops. We intend to work with farmers, farmer-based organisations, cooperatives and commercial producers to identify production opportunities and coordinate supply around market requirements.",
      factors: [
        "Production potential and seasonal availability.",
        "Farmer concentration and production capacity.",
        "Accessibility and transportation infrastructure.",
        "Proximity to aggregation and storage facilities.",
        "Demand from processors and institutional buyers.",
      ],
      note: "Specific sourcing communities and production locations will be published as operational partnerships are confirmed.",
    },
    farmerNetwork: {
      intro:
        "Behind every reliable maize supply is a network of committed farmers and dependable agricultural service providers. AgriXpert aims to develop a structured network of smallholder farmers, commercial producers, cooperatives, input suppliers, mechanisation providers and commodity aggregators.",
      groups: [],
      closing:
        "Through this network, farmers can access coordinated production opportunities while buyers benefit from more organised sourcing arrangements. We seek to build relationships based on transparency, dependable supply, fair commercial arrangements and long-term collaboration.",
    },
    coordination: {
      intro:
        "Reliable markets begin with well-coordinated production. AgriXpert's approach focuses on aligning production activities with market demand, helping farmers plan what to produce, when to produce it and how to meet the requirements of intended buyers.",
      items: [
        "Production planning and seasonal scheduling.",
        "Access to quality agricultural inputs through suppliers.",
        "Mechanisation and land preparation services.",
        "Technical guidance and production monitoring.",
        "Harvest planning and post-harvest management.",
        "Coordination around anticipated buyer demand.",
      ],
      closing: "Our objective is to reduce the disconnect between what farmers produce and what the market needs.",
    },
    aggregation: {
      intro:
        "Harvesting maize is only one part of the journey. Preserving quality, consolidating volumes and ensuring timely delivery are equally important. AgriXpert seeks to facilitate structured aggregation arrangements that bring together maize from different producers to meet commercial purchasing requirements.",
      items: [
        "Farmer-level commodity collection.",
        "Weighing and volume verification.",
        "Cleaning and grading.",
        "Moisture assessment and appropriate drying.",
        "Safe storage and inventory management.",
        "Coordinated transportation and delivery.",
      ],
      closing: "Through strategic partnerships, we aim to strengthen the infrastructure connecting production communities to commercial markets.",
    },
    quality: {
      intro: "Quality is essential to building trust between farmers, suppliers, processors and buyers. AgriXpert intends to coordinate maize sourcing around agreed buyer specifications, including:",
      groups: [
        {
          items: [
            "Moisture content.",
            "Grain cleanliness.",
            "Foreign matter and impurities.",
            "Damaged and discoloured grains.",
            "Pest infestation.",
            "Grain condition and storage suitability.",
          ],
        },
      ],
      closing: "Final acceptance criteria will be determined by applicable standards and individual buyer requirements.",
    },
    markets: {
      intro: "Maize creates opportunities across several commercial markets. AgriXpert seeks to connect aggregated maize supplies to:",
      items: [
        { label: "Food processing", body: "Mills, flour producers and food manufacturers." },
        { label: "Poultry feed manufacturing", body: "Feed producers requiring dependable maize supplies." },
        { label: "Livestock feed", body: "Businesses producing animal feed and related products." },
        { label: "Institutional markets", body: "Organisations requiring maize for structured food procurement." },
        { label: "Commodity trading", body: "Traders and distributors supplying domestic markets." },
      ],
      closing: "By connecting production to these markets, AgriXpert seeks to create commercial opportunities for farmers while improving sourcing reliability for buyers.",
    },
    partnerships: {
      intro: "We welcome partnerships with:",
      items: [
        "Maize farmers and cooperatives.",
        "Poultry feed manufacturers.",
        "Food processing companies.",
        "Commodity traders.",
        "Warehouse and storage operators.",
        "Financial institutions.",
        "Agricultural technology and mechanisation providers.",
        "Institutional commodity buyers.",
      ],
    },
    closing: {
      headline: "Let's Build a Stronger Maize Supply Chain.",
      body: "Are you a farmer seeking reliable market opportunities? A processor looking for dependable maize supplies? Or an investor interested in agricultural aggregation and storage?",
    },
  },

  soybeans: {
    slug: "soybeans",
    name: "Soybeans",
    tagline: "Connecting Farmers to the Growing Demand for Protein, Feed and Industrial Raw Materials.",
    heroImageKey: "soybeanField",
    overview: {
      intro: "Unlocking the Commercial Potential of Soybeans",
      paragraphs: [
        "Soybeans are an important agricultural commodity with applications extending beyond traditional crop production. They provide raw materials for animal feed manufacturing, edible oil processing, food production and other industrial applications.",
        "As demand for poultry feed, livestock nutrition and processed food products creates opportunities across agricultural markets, soybeans offer an important entry point for commercially coordinated agricultural production. However, the opportunity depends on connecting farmers to reliable markets, ensuring consistent quality and coordinating production with the requirements of processors and industrial buyers.",
        "AgriXpert seeks to build a structured soybean supply chain that connects producers, aggregators, processors and commercial buyers. Our vision is to make soybean production more market-responsive while improving the reliability of commodity sourcing.",
      ],
    },
    sourcing: {
      intro: "AgriXpert intends to develop soybean sourcing networks in suitable production communities, prioritising areas with agricultural potential, farmer participation and access to commercial markets.",
      factors: [
        "Suitable agroecological conditions.",
        "Farmer production capacity.",
        "Seasonal production patterns.",
        "Access to aggregation facilities.",
        "Transportation and market connectivity.",
        "Proximity to feed manufacturers and processors.",
      ],
      note: "Specific production locations will be confirmed through field assessments and sourcing partnerships.",
    },
    farmerNetwork: {
      intro: "A competitive soybean industry requires organised farmers and dependable supply relationships. AgriXpert seeks to engage smallholder farmers, farmer cooperatives, commercial producers, input suppliers and agricultural service providers.",
      groups: [],
      closing: "We aim to create a coordinated network where farmers understand market expectations before production begins. This will help establish stronger relationships between production communities and commercial buyers.",
    },
    coordination: {
      intro: "AgriXpert will promote market-oriented soybean production through:",
      items: [
        "Seasonal production planning.",
        "Improved access to suitable seeds and inputs.",
        "Mechanisation and farm service coordination.",
        "Technical guidance on crop management.",
        "Production monitoring.",
        "Harvest scheduling.",
        "Coordination with anticipated buyer demand.",
      ],
      closing: "Our objective is to improve production consistency and create a more dependable supply pipeline for commercial markets.",
    },
    aggregation: {
      intro: "Soybeans require appropriate harvesting, drying, handling and storage to preserve their quality and commercial value. AgriXpert seeks to facilitate aggregation systems that consolidate soybean volumes from multiple farmers.",
      items: [
        "Commodity collection and weighing.",
        "Cleaning and grading.",
        "Moisture assessment.",
        "Removal of foreign materials.",
        "Appropriate storage arrangements.",
        "Inventory monitoring.",
        "Transportation coordination.",
      ],
      closing: "These activities will help buyers access more organised supplies while creating opportunities for farmers to participate in larger commercial transactions.",
    },
    quality: {
      intro: "AgriXpert intends to coordinate soybean sourcing according to agreed commercial specifications. Key quality considerations include:",
      groups: [
        {
          items: [
            "Moisture content.",
            "Grain cleanliness.",
            "Foreign matter.",
            "Damaged and discoloured grains.",
            "Pest infestation.",
            "Variety and suitability for intended processing.",
            "Storage condition.",
          ],
        },
      ],
      closing: "Final specifications will be aligned with buyer requirements and applicable standards.",
    },
    markets: {
      intro: "Soybeans offer opportunities across several interconnected industries.",
      items: [
        { label: "Animal feed manufacturing", body: "Soybean meal is an important protein ingredient in poultry and livestock feed." },
        { label: "Edible oil processing", body: "Soybeans can be processed into vegetable oil." },
        { label: "Food processing", body: "Soybeans provide raw materials for soy-based food products." },
        { label: "Industrial applications", body: "Soybean derivatives serve different food and manufacturing applications." },
        { label: "Commodity trading", body: "Aggregated soybeans can supply domestic processors and other commercial markets." },
      ],
      closing: "AgriXpert aims to connect farmers to these opportunities through coordinated production, aggregation and buyer relationships.",
    },
    partnerships: {
      intro: "We invite collaboration with:",
      items: [
        "Soybean farmers and cooperatives.",
        "Poultry and livestock feed manufacturers.",
        "Soybean oil processors.",
        "Food manufacturing companies.",
        "Commodity traders.",
        "Agricultural input suppliers.",
        "Storage and logistics providers.",
        "Agricultural finance institutions.",
      ],
    },
    closing: {
      headline: "Let's Unlock the Value of Soybeans Together.",
      body: "Whether you want to cultivate soybeans, source raw materials, process soybean products or invest in agricultural supply chains, AgriXpert provides a platform for exploring commercial collaboration.",
    },
  },

  rice: {
    slug: "rice",
    name: "Rice",
    tagline: "From Paddy Fields to Quality Rice on Every Table.",
    heroImageKey: "ricePaddy",
    overview: {
      intro: "Building a More Connected Rice Economy",
      paragraphs: [
        "Rice is an important staple food with significant commercial opportunities across production, aggregation, milling, packaging, distribution and institutional supply. The rice industry presents opportunities for farmers, millers, distributors, retailers and food businesses.",
        "Yet, building a competitive rice supply chain requires coordinated production, effective post-harvest handling, reliable milling arrangements and consistent product quality.",
        "AgriXpert seeks to strengthen the connections between rice farmers, aggregators, processors and commercial markets. Our ambition is to develop a structured rice value chain that supports local production, strengthens commercial relationships and creates opportunities for value addition.",
      ],
    },
    sourcing: {
      intro: "AgriXpert seeks to establish sourcing relationships with rice farmers and production groups in suitable rice-growing communities.",
      factors: [
        "Irrigated and rain-fed production opportunities.",
        "Access to water and agricultural infrastructure.",
        "Farmer production capacity.",
        "Paddy availability and seasonal cycles.",
        "Proximity to milling facilities.",
        "Access to institutional and commercial buyers.",
      ],
      note: "Production locations will be confirmed through sourcing assessments and farmer partnerships.",
    },
    farmerNetwork: {
      intro: "A reliable rice supply chain begins with farmers who can produce quality paddy consistently. AgriXpert intends to work with:",
      groups: [
        "Individual rice farmers.",
        "Farmer cooperatives.",
        "Irrigation-based farmer groups.",
        "Commercial rice producers.",
        "Agricultural input suppliers.",
        "Mechanisation providers.",
        "Rice millers and aggregators.",
      ],
      closing: "Our approach is to build relationships that connect farmers with the wider rice industry.",
    },
    coordination: {
      intro: "Rice production requires careful coordination of land preparation, water management, planting, crop maintenance and harvesting. AgriXpert aims to support production through:",
      items: [
        "Seasonal production planning.",
        "Mechanisation and land preparation services.",
        "Coordination of quality seeds and agricultural inputs.",
        "Irrigation and water-management support through service partners.",
        "Technical production guidance.",
        "Harvest scheduling.",
        "Post-harvest management.",
      ],
      closing: "By coordinating production with anticipated demand, we seek to create more predictable commercial supply arrangements.",
    },
    aggregation: {
      intro: "The journey from paddy harvesting to market-ready rice requires appropriate handling and processing. AgriXpert intends to coordinate:",
      items: [
        "Paddy collection.",
        "Weighing and volume verification.",
        "Drying and moisture assessment.",
        "Temporary storage.",
        "Cleaning and grading.",
        "Transportation to milling facilities.",
        "Inventory and delivery management.",
      ],
      closing: "Strategic relationships with millers and warehouse operators will be important to this model.",
    },
    quality: {
      intro: "Rice quality determines its acceptance in food markets, institutional procurement and retail distribution. Key quality considerations include:",
      groups: [
        {
          items: [
            "Moisture content.",
            "Grain cleanliness.",
            "Broken grain percentage.",
            "Foreign matter.",
            "Grain uniformity.",
            "Discolouration.",
            "Milling recovery.",
            "Packaging and storage conditions.",
          ],
        },
      ],
      closing: "Final specifications will be established according to applicable standards and buyer requirements.",
    },
    markets: {
      intro: "Rice creates opportunities across multiple commercial segments.",
      items: [
        { label: "Rice milling", body: "Converting paddy into milled rice for commercial distribution." },
        { label: "Packaging and branding", body: "Developing packaged rice products for retailers and institutional buyers." },
        { label: "Institutional supply", body: "Supplying schools, hospitality businesses, caterers and other bulk purchasers." },
        { label: "Wholesale distribution", body: "Supplying wholesalers, distributors and retailers." },
        { label: "By-product utilisation", body: "Exploring commercial uses for rice bran, husks and other milling by-products." },
      ],
      closing: "AgriXpert seeks to connect local production to these opportunities through structured sourcing and processing partnerships.",
    },
    partnerships: {
      intro: "We welcome partnerships with:",
      items: [
        "Rice farmers and cooperatives.",
        "Irrigation schemes.",
        "Rice millers.",
        "Packaging companies.",
        "Institutional food buyers.",
        "Wholesale distributors.",
        "Warehouse operators.",
        "Agricultural financial institutions.",
      ],
    },
    closing: {
      headline: "Let's Connect Rice Farmers to Bigger Markets.",
      body: "Are you producing rice, operating a rice mill, distributing packaged rice or sourcing rice for institutional consumption? AgriXpert welcomes your participation.",
    },
  },

  groundnuts: {
    slug: "groundnuts",
    name: "Groundnuts",
    tagline: "Transforming Groundnuts into Food, Industrial Products and Commercial Opportunities.",
    heroImageKey: "groundnutsPile",
    overview: {
      intro: "Beyond the Harvest",
      paragraphs: [
        "Groundnuts are an important agricultural commodity with opportunities in food processing, edible oil production, snacks, confectionery and other agro-industrial applications. From smallholder farms to processing facilities and commercial markets, groundnuts support a diverse network of agricultural and business activities.",
        "However, realising their commercial potential requires improved production coordination, appropriate drying and storage, quality management and dependable market connections.",
        "AgriXpert seeks to connect groundnut farmers with aggregators, processors and commercial buyers through a coordinated value-chain approach. Our ambition is to create opportunities that allow farmers to participate more effectively in the commercial groundnut economy.",
      ],
    },
    sourcing: {
      intro: "AgriXpert intends to build sourcing relationships in suitable groundnut-producing communities.",
      factors: [
        "Production potential.",
        "Farmer networks and cooperative structures.",
        "Seasonal availability.",
        "Access to drying and storage facilities.",
        "Transportation infrastructure.",
        "Proximity to processors and commodity buyers.",
      ],
      note: "Specific sourcing locations will be confirmed through production assessments and supplier partnerships.",
    },
    farmerNetwork: {
      intro: "AgriXpert seeks to engage groundnut farmers, farmer cooperatives, commercial producers, input suppliers, aggregators and processors.",
      groups: [],
      closing: "We aim to establish a network that supports production planning, commodity consolidation and stronger commercial relationships. Our goal is to help farmers access more organised markets while enabling processors to source suitable raw materials.",
    },
    coordination: {
      intro: "Groundnut production requires attention to seed quality, soil conditions, crop management, harvesting and drying. AgriXpert seeks to coordinate:",
      items: [
        "Seasonal production planning.",
        "Access to suitable seeds and inputs.",
        "Mechanisation and farm services.",
        "Technical production guidance.",
        "Harvest scheduling.",
        "Drying and post-harvest management.",
        "Coordination with anticipated market demand.",
      ],
      closing: "This approach is intended to improve production consistency and strengthen the commercial value of harvested groundnuts.",
    },
    aggregation: {
      intro: "Proper handling is essential to preserving groundnut quality and reducing post-harvest risks. AgriXpert intends to facilitate:",
      items: [
        "Farmer-level commodity collection.",
        "Weighing and volume verification.",
        "Drying and moisture assessment.",
        "Cleaning and sorting.",
        "Removal of damaged and unsuitable nuts.",
        "Appropriate storage.",
        "Transportation to processors and buyers.",
      ],
      closing: "Particular attention will be given to moisture management and aflatoxin risk prevention.",
    },
    quality: {
      intro: "Quality assurance is critical, particularly where groundnuts are destined for food and oil processing. Key quality considerations include:",
      groups: [
        {
          items: [
            "Moisture content.",
            "Foreign matter.",
            "Broken and damaged kernels.",
            "Pest infestation.",
            "Mould contamination.",
            "Aflatoxin levels.",
            "Kernel size and uniformity.",
            "Storage conditions.",
          ],
        },
      ],
      closing: "Applicable food safety standards and buyer specifications will guide final quality requirements.",
    },
    markets: {
      intro: "Groundnuts create opportunities across several commercial industries.",
      items: [
        { label: "Groundnut oil production", body: "Processing raw groundnuts into edible oil." },
        { label: "Groundnut paste and peanut butter", body: "Supplying raw materials for packaged food products." },
        { label: "Snacks and confectionery", body: "Supporting roasted groundnut and other food businesses." },
        { label: "Food manufacturing", body: "Supplying processors requiring groundnut ingredients." },
        { label: "Commodity trading", body: "Supplying wholesalers, processors and distributors." },
        { label: "By-product utilisation", body: "Exploring commercial applications for groundnut cake in livestock feed, subject to appropriate processing and safety requirements." },
      ],
      closing: "AgriXpert aims to facilitate commercial connections across these market segments.",
    },
    partnerships: {
      intro: "We welcome collaboration with:",
      items: [
        "Groundnut farmers and cooperatives.",
        "Oil processing companies.",
        "Peanut butter manufacturers.",
        "Food processors.",
        "Commodity aggregators.",
        "Wholesale distributors.",
        "Storage and logistics operators.",
        "Agricultural finance institutions.",
      ],
    },
    closing: {
      headline: "Let's Turn Groundnut Production into Greater Commercial Value.",
      body: "Are you a groundnut farmer, processor, trader or investor looking for structured agricultural opportunities? Let's build a stronger and more connected groundnut value chain.",
    },
  },

};
