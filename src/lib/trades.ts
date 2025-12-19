// Trade types with SEO-optimized content for landing pages

export interface TradeInfo {
  slug: string;
  name: string;
  plural: string;
  description: string;
  metaDescription: string;
  faqs: { question: string; answer: string }[];
}

export const trades: TradeInfo[] = [
  {
    slug: 'general-contractor',
    name: 'General Contractor',
    plural: 'General Contractors',
    description: 'General contractors manage entire construction projects in Bali, coordinating all trades and ensuring your villa or renovation is completed on time and on budget.',
    metaDescription: 'Find trusted general contractors in Bali. Read verified reviews, check ratings, and avoid scams before hiring a contractor for your villa or renovation project.',
    faqs: [
      {
        question: 'How do I find a reliable general contractor in Bali?',
        answer: 'Search their phone number on RateMyBaliBuilder to see reviews from previous clients. Look for contractors with multiple positive reviews, a track record of completing projects on time, and transparent pricing. Always get references and visit their completed projects if possible.'
      },
      {
        question: 'How much do general contractors charge in Bali?',
        answer: 'General contractors in Bali typically charge 10-15% of the total project cost as their fee, or quote a per-square-meter rate ranging from $600-1500 USD depending on quality and finishes. Always get itemized quotes from multiple contractors.'
      },
      {
        question: 'What should I include in a contract with a Bali contractor?',
        answer: 'Include detailed specifications, materials list, payment schedule (never more than 30% upfront), timeline with penalties for delays, warranty terms, and dispute resolution process. Have a local lawyer review the contract before signing.'
      },
    ],
  },
  {
    slug: 'architect',
    name: 'Architect',
    plural: 'Architects',
    description: 'Architects in Bali design beautiful tropical homes that blend modern living with traditional Balinese elements while meeting local building regulations.',
    metaDescription: 'Find experienced architects in Bali. Browse reviews from villa owners, check portfolios, and find the right architect for your tropical dream home.',
    faqs: [
      {
        question: 'How much does an architect cost in Bali?',
        answer: 'Architects in Bali typically charge 5-10% of the total construction cost, or a fixed fee ranging from $5,000-30,000 USD depending on project complexity. This usually includes concept design, detailed drawings, and construction supervision.'
      },
      {
        question: 'Do I need a local architect to build in Bali?',
        answer: 'Yes, you need a licensed Indonesian architect (IAI certified) to submit building permits. Foreign architects can collaborate on design, but a local architect must stamp the official drawings. They also understand local regulations and building practices.'
      },
      {
        question: 'What style of architecture works best in Bali?',
        answer: 'Tropical modern architecture works well, incorporating open-air living, natural ventilation, and materials like teak wood and natural stone. Good architects balance aesthetics with practical considerations like humidity, rain, and termite resistance.'
      },
    ],
  },
  {
    slug: 'interior-designer',
    name: 'Interior Designer',
    plural: 'Interior Designers',
    description: 'Interior designers in Bali create stunning tropical interiors using local craftsmen, custom furniture, and materials that withstand the tropical climate.',
    metaDescription: 'Find talented interior designers in Bali. Read reviews, see portfolios, and hire designers who understand tropical living and local craftsmanship.',
    faqs: [
      {
        question: 'How much do interior designers charge in Bali?',
        answer: 'Interior designers in Bali typically charge 10-15% of the furniture and fixtures budget, or a flat fee starting from $3,000 USD for smaller projects. Some charge hourly rates of $50-150 USD. Always clarify if procurement fees are included.'
      },
      {
        question: 'Can interior designers source local Balinese furniture?',
        answer: 'Yes, experienced Bali designers have relationships with local craftsmen and furniture makers in areas like Mas and Gianyar. They can source custom teak furniture, stone carvings, and textiles at better prices than you would find on your own.'
      },
      {
        question: 'What materials work best for Bali interiors?',
        answer: 'Teak and other hardwoods resist humidity and termites. Natural stone like Palimanan works well for floors. Avoid materials that absorb moisture like certain fabrics. A good designer will specify materials suited to the tropical climate.'
      },
    ],
  },
  {
    slug: 'pool-builder',
    name: 'Pool Builder',
    plural: 'Pool Builders',
    description: 'Pool builders in Bali specialize in infinity pools, natural pools, and tropical designs that complement villa architecture and Bali\'s stunning landscapes.',
    metaDescription: 'Find reputable pool builders in Bali. Read reviews from villa owners, compare prices, and avoid common pool construction problems.',
    faqs: [
      {
        question: 'How much does it cost to build a pool in Bali?',
        answer: 'Pool costs in Bali range from $15,000-50,000 USD depending on size, type, and finishes. A basic 8x4m pool starts around $15,000, while infinity pools with premium finishes can exceed $40,000. Get multiple quotes and check what\'s included.'
      },
      {
        question: 'How long does it take to build a pool in Bali?',
        answer: 'A standard pool takes 6-10 weeks to build. Infinity pools and complex designs may take 12-16 weeks. Factor in Bali\'s rainy season (November-March) which can cause delays. Get timeline commitments in writing with delay penalties.'
      },
      {
        question: 'What type of pool is best for Bali?',
        answer: 'Concrete pools with tile or stone finishes are most common and durable in Bali. Infinity pools are popular for views. Consider overflow systems for heavy rain, quality filtration for the humid climate, and proper waterproofing to prevent leaks.'
      },
    ],
  },
  {
    slug: 'renovation-specialist',
    name: 'Renovation Specialist',
    plural: 'Renovation Specialists',
    description: 'Renovation specialists in Bali transform existing villas and properties, handling everything from minor updates to complete structural overhauls.',
    metaDescription: 'Find trusted renovation specialists in Bali. Read reviews, compare quotes, and find experts for villa renovations, updates, and property improvements.',
    faqs: [
      {
        question: 'How much do renovations cost in Bali?',
        answer: 'Renovation costs vary widely: bathroom renovations $3,000-10,000 USD, kitchen updates $5,000-20,000 USD, full villa renovations $50,000+ USD. Costs depend on scope, materials, and structural changes needed. Always budget 15-20% contingency.'
      },
      {
        question: 'Can I renovate a leased property in Bali?',
        answer: 'Yes, but get written permission from the landowner first. Clarify who owns the improvements at lease end. Major renovations should be reflected in your lease agreement. Some landlords contribute to renovations in exchange for longer lease terms.'
      },
      {
        question: 'What are common renovation problems in Bali?',
        answer: 'Watch for water damage, termite issues, poor original construction, and unpermitted structures. Have a specialist inspect before buying or leasing. Budget extra for surprises - older Bali buildings often have hidden issues that emerge during renovation.'
      },
    ],
  },
  {
    slug: 'mason',
    name: 'Mason',
    plural: 'Masons',
    description: 'Masons in Bali work with natural stone, brick, and concrete to create beautiful walls, floors, and structures suited to tropical construction.',
    metaDescription: 'Find skilled masons in Bali for stonework, brickwork, and concrete construction. Read reviews and hire trusted craftsmen for your project.',
    faqs: [
      {
        question: 'What types of stone do Bali masons work with?',
        answer: 'Common stones include Palimanan (cream limestone), Sukabumi (green stone for pools), Batu Candi (temple stone), and various local sandstones. Good masons know which stones suit different applications and how to properly seal them for longevity.'
      },
      {
        question: 'How much do masons charge in Bali?',
        answer: 'Bali masons typically charge daily rates of 150,000-300,000 IDR ($10-20 USD) depending on skill level. Complex decorative stonework or specialized skills command higher rates. Stone material costs are additional and vary significantly by type.'
      },
      {
        question: 'How do I ensure quality masonry work?',
        answer: 'Check previous work samples, especially joints and finishing. Good masons use proper mortar mixes, install adequate drainage behind retaining walls, and seal porous stones. Specify quality expectations in writing before work begins.'
      },
    ],
  },
  {
    slug: 'roofer',
    name: 'Roofer',
    plural: 'Roofers',
    description: 'Roofers in Bali install and repair traditional alang-alang thatch, modern tiles, and metal roofing designed to handle tropical rain and heat.',
    metaDescription: 'Find experienced roofers in Bali. Get reviews on thatch, tile, and metal roofing installation. Protect your villa from Bali\'s tropical weather.',
    faqs: [
      {
        question: 'What roofing is best for Bali?',
        answer: 'Options include alang-alang thatch (traditional, needs replacement every 3-5 years), clay tiles (durable, good insulation), metal roofing (long-lasting but hot), and shingles. Consider maintenance requirements, budget, and aesthetic when choosing.'
      },
      {
        question: 'How often does thatch roofing need replacement in Bali?',
        answer: 'Quality alang-alang thatch lasts 3-5 years with proper maintenance. Factors affecting lifespan include roof pitch, ventilation, and exposure to rain. Annual treatment and repairs extend life. Budget for regular maintenance when choosing thatch.'
      },
      {
        question: 'How do I prevent roof leaks in Bali?',
        answer: 'Ensure proper roof pitch for water runoff, quality underlayment, sealed flashings around penetrations, and adequate overhangs. Regular inspections before rainy season catch problems early. Good roofers understand Bali\'s heavy rainfall requirements.'
      },
    ],
  },
  {
    slug: 'plumber',
    name: 'Plumber',
    plural: 'Plumbers',
    description: 'Plumbers in Bali handle water systems, drainage, and septic installations for villas and properties, working with local infrastructure requirements.',
    metaDescription: 'Find reliable plumbers in Bali. Read reviews for water system installation, drainage, septic tanks, and repairs. Avoid common plumbing disasters.',
    faqs: [
      {
        question: 'How does plumbing work differently in Bali?',
        answer: 'Bali relies on septic systems (not municipal sewage), water tanks with pumps, and often well water. Water pressure varies. Good plumbers understand local water quality issues and install appropriate filtration. Drainage design for heavy rain is critical.'
      },
      {
        question: 'How much do plumbers charge in Bali?',
        answer: 'Plumbers charge 200,000-400,000 IDR ($13-27 USD) per day for general work. Complex installations or emergency calls cost more. Material quality varies significantly - specify good brands like Rucika or Wavin for pipes to avoid future problems.'
      },
      {
        question: 'What size septic tank do I need in Bali?',
        answer: 'Septic tank size depends on bedrooms and expected occupancy. A 3-bedroom villa typically needs 3-4 cubic meter capacity. Include a proper soak-away field. Some areas require bio-septic systems. Check local regulations before installation.'
      },
    ],
  },
  {
    slug: 'electrician',
    name: 'Electrician',
    plural: 'Electricians',
    description: 'Electricians in Bali handle power installations, PLN connections, solar systems, and electrical safety for homes and commercial properties.',
    metaDescription: 'Find certified electricians in Bali. Read reviews for electrical installation, PLN connections, and solar systems. Ensure safe, reliable power.',
    faqs: [
      {
        question: 'How does electrical power work in Bali?',
        answer: 'Bali uses 220V/50Hz power through PLN (state electricity). Power capacity is measured in VA - villas typically need 3,500-7,700 VA. Outages occur, so many properties install backup generators or batteries. Proper grounding is essential for safety.'
      },
      {
        question: 'How do I increase PLN power capacity for my villa?',
        answer: 'Apply through PLN office with your property documents. Upgrades can take 2-4 weeks and cost varies by capacity increase. Some areas have limited infrastructure. Your electrician can assess needs and handle the application process.'
      },
      {
        question: 'Is solar power viable in Bali?',
        answer: 'Yes, Bali gets excellent sun exposure. Solar systems cost $5,000-20,000 USD depending on capacity. Grid-tied systems can reduce PLN bills, while off-grid systems with batteries provide backup power. ROI is typically 5-8 years.'
      },
    ],
  },
  {
    slug: 'hvac',
    name: 'HVAC Specialist',
    plural: 'HVAC Specialists',
    description: 'HVAC specialists in Bali install and maintain air conditioning systems designed for tropical humidity and heat.',
    metaDescription: 'Find HVAC specialists in Bali. Read reviews for AC installation, maintenance, and repair. Keep your villa cool in Bali\'s tropical climate.',
    faqs: [
      {
        question: 'What type of AC is best for Bali?',
        answer: 'Split-system ACs are most common and efficient. Inverter models save electricity long-term. Size correctly based on room dimensions and sun exposure. Consider ceiling fans to reduce AC dependence. Ducted systems suit larger villas.'
      },
      {
        question: 'How often should AC be serviced in Bali?',
        answer: 'Service AC units every 3-4 months in Bali due to high dust and humidity. Regular cleaning prevents mold growth and maintains efficiency. Annual deep cleaning and gas top-ups extend unit life. Neglected units fail quickly in tropical conditions.'
      },
      {
        question: 'How much does AC installation cost in Bali?',
        answer: 'AC units cost $300-1,500 USD depending on brand and capacity. Installation adds $50-150 USD per unit. Premium brands like Daikin and Panasonic last longer than budget options. Consider total cost of ownership including electricity and maintenance.'
      },
    ],
  },
  {
    slug: 'welder',
    name: 'Welder',
    plural: 'Welders',
    description: 'Welders in Bali fabricate gates, railings, furniture frames, and structural steel for construction and renovation projects.',
    metaDescription: 'Find skilled welders in Bali for gates, railings, and custom metalwork. Read reviews and hire trusted fabricators for your project.',
    faqs: [
      {
        question: 'What metals work best in Bali\'s climate?',
        answer: 'Stainless steel and galvanized steel resist Bali\'s humidity best. Regular steel rusts quickly unless properly treated. Aluminum works for lighter applications. Good welders apply anti-rust treatment and quality paint for longevity.'
      },
      {
        question: 'How much do welders charge in Bali?',
        answer: 'Welders charge 200,000-350,000 IDR ($13-23 USD) daily. Custom fabrication is priced by project complexity and materials. Get detailed quotes including materials, finishing, and installation. Quality varies significantly between welders.'
      },
      {
        question: 'How do I prevent rust on metal gates and railings?',
        answer: 'Use galvanized or stainless steel, apply rust-inhibiting primer, use quality outdoor paint, and maintain regularly. Coastal areas need extra protection. Repainting every 2-3 years extends life. Cheap initial work costs more long-term.'
      },
    ],
  },
  {
    slug: 'glass-glazing',
    name: 'Glass & Glazing Specialist',
    plural: 'Glass & Glazing Specialists',
    description: 'Glass specialists in Bali install windows, doors, shower screens, and custom glass features for modern tropical architecture.',
    metaDescription: 'Find glass and glazing specialists in Bali. Read reviews for window installation, shower screens, and architectural glass features.',
    faqs: [
      {
        question: 'What type of glass is best for Bali?',
        answer: 'Tempered safety glass is essential for doors and large panels. Tinted or Low-E glass reduces heat and UV. Laminated glass provides security and sound reduction. Frameless glass creates modern looks but needs quality hardware for humidity resistance.'
      },
      {
        question: 'How much do glass installations cost in Bali?',
        answer: 'Standard window glass costs $30-80 USD per sqm installed. Tempered glass costs 2-3x more. Frameless shower screens run $300-800 USD. Large sliding doors with frames can exceed $1,000 USD per panel. Quality frames matter for longevity.'
      },
      {
        question: 'How do I maintain glass in Bali\'s humid climate?',
        answer: 'Clean regularly to prevent hard water stains. Apply rain repellent treatments. Check and maintain rubber seals and hardware. Aluminum frames need occasional treatment to prevent oxidation. Quality initial installation reduces ongoing maintenance.'
      },
    ],
  },
  {
    slug: 'painter',
    name: 'Painter',
    plural: 'Painters',
    description: 'Painters in Bali apply interior and exterior finishes designed to withstand tropical humidity, rain, and intense sun exposure.',
    metaDescription: 'Find professional painters in Bali. Read reviews for interior, exterior, and specialty painting. Get quality finishes that last in tropical conditions.',
    faqs: [
      {
        question: 'What paint brands work best in Bali?',
        answer: 'Quality brands like Dulux, Nippon, and Jotun perform well in Bali\'s climate. Use exterior-grade paint with mold and UV resistance. Cheap paint fades and peels quickly. Invest in quality primer and paint for longer-lasting results.'
      },
      {
        question: 'How often should I repaint in Bali?',
        answer: 'Exterior walls need repainting every 3-5 years due to sun, rain, and humidity. Interior walls last 5-7 years. Coastal properties need more frequent maintenance. Quality initial application extends repaint intervals significantly.'
      },
      {
        question: 'How much do painters charge in Bali?',
        answer: 'Painters charge 150,000-250,000 IDR ($10-17 USD) daily. Per-square-meter rates range from $2-5 USD including materials for basic work. Premium finishes, texture coats, and specialty applications cost more. Get itemized quotes specifying paint brands.'
      },
    ],
  },
  {
    slug: 'tiler',
    name: 'Tiler',
    plural: 'Tilers',
    description: 'Tilers in Bali install floor tiles, wall tiles, pool tiles, and natural stone finishes for tropical homes and outdoor spaces.',
    metaDescription: 'Find skilled tilers in Bali. Read reviews for floor, wall, and pool tiling. Get beautiful, durable tile installations for your villa.',
    faqs: [
      {
        question: 'What tiles work best for Bali?',
        answer: 'Porcelain tiles resist moisture and are easy to maintain. Natural stone like terrazzo is traditional and cool underfoot. Use non-slip tiles for wet areas and pool surrounds. Avoid polished tiles in bathrooms and outdoor areas.'
      },
      {
        question: 'How much does tiling cost in Bali?',
        answer: 'Tiler labor costs 50,000-100,000 IDR ($3-7 USD) per sqm depending on complexity. Tile materials range from $5-50 USD per sqm. Pattern layouts and natural stone cost more to install. Budget for 10% tile waste and quality adhesive.'
      },
      {
        question: 'How do I choose between ceramic and natural stone?',
        answer: 'Ceramic/porcelain is lower maintenance and more consistent. Natural stone (marble, granite, terrazzo) is beautiful but needs sealing and more care. Consider room use, maintenance commitment, and budget. Both work well when properly installed.'
      },
    ],
  },
  {
    slug: 'carpenter',
    name: 'Carpenter',
    plural: 'Carpenters',
    description: 'Carpenters in Bali craft custom woodwork, built-ins, doors, windows, and structural timber for traditional and modern construction.',
    metaDescription: 'Find skilled carpenters in Bali. Read reviews for custom woodwork, built-in furniture, and structural carpentry using quality Indonesian timber.',
    faqs: [
      {
        question: 'What wood is best for building in Bali?',
        answer: 'Teak is the gold standard - naturally resistant to termites and humidity. Merbau and Ulin are strong alternatives. Avoid softwoods that rot quickly. Always verify wood is legally sourced with proper documentation. Kiln-dried wood prevents warping.'
      },
      {
        question: 'How much do carpenters charge in Bali?',
        answer: 'Skilled carpenters charge 200,000-400,000 IDR ($13-27 USD) daily. Custom furniture is priced per piece. Teak doors cost $300-800 USD each. Built-in wardrobes run $500-2,000 USD depending on size and complexity. Material costs are additional.'
      },
      {
        question: 'How do I protect wood from termites in Bali?',
        answer: 'Use naturally resistant woods like teak, treat all timber with anti-termite solution, and maintain proper ventilation. Regular inspections catch problems early. Avoid wood-to-ground contact. Quality carpentry with proper treatment lasts decades.'
      },
    ],
  },
  {
    slug: 'furniture-maker',
    name: 'Furniture Maker',
    plural: 'Furniture Makers',
    description: 'Furniture makers in Bali create custom pieces from teak and other Indonesian hardwoods, from traditional Balinese to modern designs.',
    metaDescription: 'Find furniture makers in Bali for custom tables, chairs, beds, and more. Read reviews and commission beautiful pieces in quality Indonesian timber.',
    faqs: [
      {
        question: 'Where can I find furniture makers in Bali?',
        answer: 'Major furniture workshops are in Mas (near Ubud), Jepara (Java, many ship to Bali), and scattered throughout Gianyar regency. RateMyBaliBuilder lists reviewed furniture makers. Visit workshops to assess quality before ordering.'
      },
      {
        question: 'How much does custom furniture cost in Bali?',
        answer: 'Custom teak dining tables cost $400-2,000 USD, beds $500-1,500 USD, wardrobes $600-2,500 USD depending on size and complexity. Prices are 50-70% cheaper than Western countries. Factor in finishing time of 2-6 weeks for custom orders.'
      },
      {
        question: 'Can I ship furniture from Bali to other countries?',
        answer: 'Yes, many furniture makers handle export. Costs vary by destination and volume. Ensure proper fumigation certificates for customs. Container shipping is economical for large orders. Sea freight takes 4-8 weeks to most destinations.'
      },
    ],
  },
  {
    slug: 'landscaper',
    name: 'Landscaper',
    plural: 'Landscapers',
    description: 'Landscapers in Bali design and install tropical gardens, irrigation systems, and outdoor living spaces that thrive in the island\'s climate.',
    metaDescription: 'Find landscapers in Bali for tropical garden design, irrigation, and outdoor spaces. Read reviews and create your paradise garden.',
    faqs: [
      {
        question: 'What plants grow well in Bali gardens?',
        answer: 'Tropical favorites include frangipani, heliconia, bird of paradise, palms, and bamboo. Bougainvillea provides color. Native plants need less maintenance. Good landscapers know what thrives in different Bali microclimates and sun exposures.'
      },
      {
        question: 'How much does landscaping cost in Bali?',
        answer: 'Basic landscaping costs $10-30 USD per sqm including plants and labor. Premium designs with mature plants, water features, and hardscaping can exceed $100 per sqm. Maintenance runs $100-300 USD monthly for villa-sized gardens.'
      },
      {
        question: 'Do I need irrigation in Bali?',
        answer: 'Yes, despite rainfall, dry season (April-October) requires irrigation. Drip systems are most efficient. Include rainwater harvesting to reduce costs. Good landscapers design systems with proper zoning for different plant water needs.'
      },
    ],
  },
];

// Helper to get trade by slug
export function getTradeBySlug(slug: string): TradeInfo | undefined {
  return trades.find(t => t.slug === slug);
}

// Get all trade slugs for static generation
export function getAllTradeSlugs(): string[] {
  return trades.map(t => t.slug);
}
