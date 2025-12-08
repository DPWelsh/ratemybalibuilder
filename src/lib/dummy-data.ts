// Dummy data for RateMyBaliBuilder
// This file simulates the database until real Supabase integration

export type BuilderStatus = 'recommended' | 'unknown' | 'blacklisted';

export type Location =
  | 'Canggu'
  | 'Seminyak'
  | 'Ubud'
  | 'Uluwatu'
  | 'Sanur'
  | 'Denpasar'
  | 'Tabanan';

export type TradeType =
  | 'General Contractor'
  | 'Pool Builder'
  | 'Architect'
  | 'Interior Designer'
  | 'Landscaper'
  | 'Renovation Specialist';

export type ProjectType =
  | 'Villas'
  | 'Renovations'
  | 'Pools'
  | 'Commercial'
  | 'Landscaping'
  | 'Interior Fit-out';

export interface Builder {
  id: string;
  name: string;
  phone: string;
  companyName?: string;
  instagram?: string;
  status: BuilderStatus;
  location: Location;
  tradeType: TradeType;
  projectTypes: ProjectType[];
  createdAt: string;
}

export interface Review {
  id: string;
  builderId: string;
  rating: number;
  text: string;
  photos: string[];
  createdAt: string;
}

// ============================================
// BUILDERS (8 total: 3 recommended, 3 unknown, 2 blacklisted)
// ============================================

export const builders: Builder[] = [
  // RECOMMENDED (3)
  {
    id: 'builder-1',
    name: 'Pak Wayan Construction',
    phone: '+62 812 3456 7890',
    companyName: 'Wayan & Sons Building',
    instagram: 'wayanbuilds',
    status: 'recommended',
    location: 'Canggu',
    tradeType: 'General Contractor',
    projectTypes: ['Villas', 'Renovations', 'Pools'],
    createdAt: '2023-06-15',
  },
  {
    id: 'builder-2',
    name: 'Bali Dream Villas',
    phone: '+62 813 9876 5432',
    companyName: 'PT Bali Dream Construction',
    instagram: 'balidreamvillas',
    status: 'recommended',
    location: 'Ubud',
    tradeType: 'General Contractor',
    projectTypes: ['Villas', 'Commercial'],
    createdAt: '2022-11-20',
  },
  {
    id: 'builder-3',
    name: 'Komang Renovations',
    phone: '+62 817 5555 1234',
    companyName: undefined,
    instagram: 'komangreno',
    status: 'recommended',
    location: 'Seminyak',
    tradeType: 'Renovation Specialist',
    projectTypes: ['Renovations', 'Interior Fit-out'],
    createdAt: '2024-01-10',
  },

  // UNKNOWN (3)
  {
    id: 'builder-4',
    name: 'Made Builders',
    phone: '+62 821 7777 8888',
    companyName: undefined,
    instagram: undefined,
    status: 'unknown',
    location: 'Denpasar',
    tradeType: 'General Contractor',
    projectTypes: ['Villas', 'Renovations'],
    createdAt: '2024-08-05',
  },
  {
    id: 'builder-5',
    name: 'Canggu Construction Co',
    phone: '+62 858 1234 5678',
    companyName: 'CV Canggu Build',
    instagram: 'cangguconstruction',
    status: 'unknown',
    location: 'Canggu',
    tradeType: 'General Contractor',
    projectTypes: ['Villas', 'Pools', 'Commercial'],
    createdAt: '2024-06-22',
  },
  {
    id: 'builder-6',
    name: 'Ketut Property Development',
    phone: '+62 819 4444 3333',
    companyName: undefined,
    instagram: undefined,
    status: 'unknown',
    location: 'Uluwatu',
    tradeType: 'Landscaper',
    projectTypes: ['Landscaping', 'Pools'],
    createdAt: '2024-09-01',
  },

  // BLACKLISTED (2)
  {
    id: 'builder-7',
    name: 'Bali Fast Build',
    phone: '+62 812 9999 0000',
    companyName: 'PT Fast Build Indo',
    instagram: 'balifastbuild',
    status: 'blacklisted',
    location: 'Sanur',
    tradeType: 'General Contractor',
    projectTypes: ['Villas', 'Renovations', 'Commercial'],
    createdAt: '2023-03-10',
  },
  {
    id: 'builder-8',
    name: 'Agus Contractor',
    phone: '+62 878 2222 1111',
    companyName: undefined,
    instagram: undefined,
    status: 'blacklisted',
    location: 'Tabanan',
    tradeType: 'Pool Builder',
    projectTypes: ['Pools', 'Renovations'],
    createdAt: '2023-09-25',
  },
];

// ============================================
// REVIEWS (25-30 total)
// ============================================

export const reviews: Review[] = [
  // Reviews for Pak Wayan Construction (builder-1) - RECOMMENDED
  {
    id: 'review-1',
    builderId: 'builder-1',
    rating: 5,
    text: 'Built our 3-bedroom villa in Canggu. Finished in 6 months as promised and stayed within our $120k budget. Pak Wayan was very communicative on WhatsApp and sent daily photo updates. Highly recommend for villa builds.',
    photos: ['https://picsum.photos/seed/villa1a/800/600', 'https://picsum.photos/seed/villa1b/800/600'],
    createdAt: '2024-06-20',
  },
  {
    id: 'review-2',
    builderId: 'builder-1',
    rating: 5,
    text: 'Renovated our entire ground floor including new kitchen and bathroom. Quality of work was excellent - used proper waterproofing and good quality tiles. Only took 2 months. Fair price at $25k.',
    photos: ['https://picsum.photos/seed/reno1/800/600'],
    createdAt: '2024-04-15',
  },
  {
    id: 'review-3',
    builderId: 'builder-1',
    rating: 4,
    text: 'Good experience overall with our pool installation. Took slightly longer than quoted (10 weeks instead of 8) but the end result is great. Communication could be better but he always responds within a day.',
    photos: ['https://picsum.photos/seed/pool1/800/600', 'https://picsum.photos/seed/pool1b/800/600'],
    createdAt: '2024-02-28',
  },
  {
    id: 'review-4',
    builderId: 'builder-1',
    rating: 5,
    text: 'Second project with Pak Wayan - built a guest house on our property. Same great quality as our main villa. He even fixed a small issue from the first build at no charge. Trustworthy.',
    photos: [],
    createdAt: '2024-08-10',
  },

  // Reviews for Bali Dream Villas (builder-2) - RECOMMENDED
  {
    id: 'review-5',
    builderId: 'builder-2',
    rating: 5,
    text: 'Professional operation from start to finish. They have architects on staff and handled all permits. Built our $180k villa in Ubud with amazing rice field views. The attention to detail in the traditional Balinese elements was incredible.',
    photos: ['https://picsum.photos/seed/ubud1/800/600', 'https://picsum.photos/seed/ubud2/800/600', 'https://picsum.photos/seed/ubud3/800/600'],
    createdAt: '2024-05-12',
  },
  {
    id: 'review-6',
    builderId: 'builder-2',
    rating: 4,
    text: 'Great quality but on the pricier side compared to other quotes we got. That said, you get what you pay for. No cutting corners, proper materials, and they actually follow building codes.',
    photos: ['https://picsum.photos/seed/bdv1/800/600'],
    createdAt: '2024-03-20',
  },
  {
    id: 'review-7',
    builderId: 'builder-2',
    rating: 5,
    text: 'They managed our entire build while we were back in Australia. Weekly video calls, detailed progress reports, and the finished villa was exactly what we wanted. Worth every rupiah.',
    photos: ['https://picsum.photos/seed/bdv2/800/600', 'https://picsum.photos/seed/bdv3/800/600'],
    createdAt: '2024-01-08',
  },

  // Reviews for Komang Renovations (builder-3) - RECOMMENDED
  {
    id: 'review-8',
    builderId: 'builder-3',
    rating: 5,
    text: 'Komang is the best for smaller renovation jobs. Redid our two bathrooms and outdoor kitchen area. Very clean worksite, finished on time, and fixed a small leak issue quickly when we noticed it a month later.',
    photos: ['https://picsum.photos/seed/bath1/800/600'],
    createdAt: '2024-07-05',
  },
  {
    id: 'review-9',
    builderId: 'builder-3',
    rating: 4,
    text: 'Good work on our carport and driveway. Reasonable price. He is a one-man operation with a small crew so dont expect fast turnaround on bigger projects, but quality is solid.',
    photos: [],
    createdAt: '2024-09-18',
  },
  {
    id: 'review-10',
    builderId: 'builder-3',
    rating: 5,
    text: 'Fixed all the issues left by our previous contractor (who we should have vetted better). Komang was honest about what needed redoing and what could be saved. Saved us a lot of money.',
    photos: ['https://picsum.photos/seed/fix1/800/600', 'https://picsum.photos/seed/fix2/800/600'],
    createdAt: '2024-06-30',
  },

  // Reviews for Made Builders (builder-4) - UNKNOWN
  {
    id: 'review-11',
    builderId: 'builder-4',
    rating: 3,
    text: 'Did an okay job on our boundary wall. Nothing special but nothing terrible either. Took a bit longer than expected. Would need more reviews before I could fully recommend.',
    photos: [],
    createdAt: '2024-10-01',
  },
  {
    id: 'review-12',
    builderId: 'builder-4',
    rating: 4,
    text: 'Built a small bungalow for us. Decent work, fair price. Communication was sometimes slow but he got the job done.',
    photos: ['https://picsum.photos/seed/bung1/800/600'],
    createdAt: '2024-08-22',
  },

  // Reviews for Canggu Construction Co (builder-5) - UNKNOWN
  {
    id: 'review-13',
    builderId: 'builder-5',
    rating: 3,
    text: 'Mixed experience. The structural work was fine but finishing was rushed. Had to get them back twice to fix tiling issues. They did fix it without extra charge at least.',
    photos: ['https://picsum.photos/seed/tile1/800/600'],
    createdAt: '2024-07-14',
  },
  {
    id: 'review-14',
    builderId: 'builder-5',
    rating: 4,
    text: 'New company but seem to know what theyre doing. Built our pool house. Good modern design sense. Will update this review after rainy season to see how it holds up.',
    photos: ['https://picsum.photos/seed/poolhouse/800/600'],
    createdAt: '2024-09-05',
  },

  // Reviews for Ketut Property Development (builder-6) - UNKNOWN
  {
    id: 'review-15',
    builderId: 'builder-6',
    rating: 2,
    text: 'Started well but ran into issues mid-project. Communication dropped off. Project finished eventually but took 3 months longer than quoted. Not sure if I would use again.',
    photos: [],
    createdAt: '2024-08-30',
  },
  {
    id: 'review-16',
    builderId: 'builder-6',
    rating: 4,
    text: 'Did our landscaping and outdoor area. Good work, nice design ideas. Different experience than other reviewer - maybe depends on project type?',
    photos: ['https://picsum.photos/seed/land1/800/600'],
    createdAt: '2024-10-10',
  },

  // Reviews for Bali Fast Build (builder-7) - BLACKLISTED
  {
    id: 'review-17',
    builderId: 'builder-7',
    rating: 1,
    text: 'AVOID. Asked for 70% upfront which was a red flag we ignored. After receiving payment, work slowed to a crawl. They subcontracted everything to random workers. Took 14 months for what should have been 6 months. Final quality was terrible.',
    photos: ['https://picsum.photos/seed/bad1/800/600', 'https://picsum.photos/seed/bad2/800/600'],
    createdAt: '2024-02-15',
  },
  {
    id: 'review-18',
    builderId: 'builder-7',
    rating: 1,
    text: 'Worst building experience ever. Hidden costs kept appearing. They claimed materials cost more than quoted and demanded extra money or would stop work. Ended up paying 40% over budget. DO NOT USE.',
    photos: ['https://picsum.photos/seed/bad3/800/600'],
    createdAt: '2024-04-20',
  },
  {
    id: 'review-19',
    builderId: 'builder-7',
    rating: 1,
    text: 'They disappeared with our deposit. Paid 50M IDR upfront, they did foundation work for 2 weeks then stopped showing up. Phone goes unanswered. Had to hire someone else to finish. Currently pursuing legal action.',
    photos: [],
    createdAt: '2024-06-08',
  },
  {
    id: 'review-20',
    builderId: 'builder-7',
    rating: 2,
    text: 'Not as bad as other reviews but still wouldnt recommend. Constant delays, excuses about materials and workers. Quality was mediocre. Used cheap materials despite us paying for premium.',
    photos: ['https://picsum.photos/seed/cheap1/800/600'],
    createdAt: '2024-01-25',
  },

  // Reviews for Agus Contractor (builder-8) - BLACKLISTED
  {
    id: 'review-21',
    builderId: 'builder-8',
    rating: 1,
    text: 'Nightmare from start to finish. Agus quoted 80M IDR for renovation, we paid 50% upfront. Work was shoddy - walls not straight, plumbing leaking within a week. When we complained he got aggressive and refused to fix anything.',
    photos: ['https://picsum.photos/seed/agus1/800/600', 'https://picsum.photos/seed/agus2/800/600'],
    createdAt: '2024-05-18',
  },
  {
    id: 'review-22',
    builderId: 'builder-8',
    rating: 1,
    text: 'Hired for pool installation. He dug the hole, poured concrete, then disappeared for 3 weeks. Came back demanding more money. We refused, he never returned. Had to pay another contractor double to fix and complete.',
    photos: ['https://picsum.photos/seed/poolbad/800/600'],
    createdAt: '2024-07-02',
  },
  {
    id: 'review-23',
    builderId: 'builder-8',
    rating: 1,
    text: 'Uses unlicensed workers, no insurance, cuts every corner possible. Our roof started leaking 2 months after completion. Absolute cowboy operator. Check references carefully - the ones he gave us were fake.',
    photos: [],
    createdAt: '2024-03-14',
  },
  {
    id: 'review-24',
    builderId: 'builder-8',
    rating: 2,
    text: 'Small job only - just a garden wall. It was okay but I later heard horror stories from neighbors. Seems he behaves differently on small vs large projects. Would not trust with anything significant.',
    photos: [],
    createdAt: '2024-08-08',
  },
];

// ============================================
// RED FLAGS (for blacklisted builders)
// ============================================

export interface RedFlag {
  builderId: string;
  flags: string[];
}

export const redFlags: RedFlag[] = [
  {
    builderId: 'builder-7',
    flags: [
      'Demands excessive upfront payment (70%+)',
      'Subcontracts work without disclosure',
      'Significant project delays',
      'Hidden costs and budget overruns',
      'Poor communication after payment received',
    ],
  },
  {
    builderId: 'builder-8',
    flags: [
      'Disappears mid-project',
      'Aggressive when confronted about issues',
      'Uses unlicensed workers',
      'No insurance coverage',
      'Fake references provided',
      'Poor quality workmanship',
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getBuilderById(id: string): Builder | undefined {
  return builders.find((b) => b.id === id);
}

export function searchBuilders(name?: string, phone?: string): Builder[] {
  return builders.filter((builder) => {
    const nameMatch = !name || builder.name.toLowerCase().includes(name.toLowerCase());
    const phoneMatch = !phone || builder.phone.replace(/\s/g, '').includes(phone.replace(/\s/g, ''));
    return nameMatch || phoneMatch;
  });
}

export function getReviewsForBuilder(builderId: string): Review[] {
  return reviews.filter((r) => r.builderId === builderId);
}

export function getAverageRating(builderId: string): number {
  const builderReviews = getReviewsForBuilder(builderId);
  if (builderReviews.length === 0) return 0;
  const sum = builderReviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / builderReviews.length) * 10) / 10;
}

export function getRedFlagsForBuilder(builderId: string): string[] {
  const redFlag = redFlags.find((rf) => rf.builderId === builderId);
  return redFlag?.flags || [];
}

export function maskPhone(phone: string): string {
  // +62 812 3456 7890 → +62 812 •••• ••••
  const parts = phone.split(' ');
  if (parts.length >= 4) {
    return `${parts[0]} ${parts[1]} •••• ••••`;
  }
  // Fallback for different formats
  return phone.slice(0, 8) + ' •••• ••••';
}

// ============================================
// FILTER OPTIONS
// ============================================

export const locations: Location[] = [
  'Canggu',
  'Seminyak',
  'Ubud',
  'Uluwatu',
  'Sanur',
  'Denpasar',
  'Tabanan',
];

export const tradeTypes: TradeType[] = [
  'General Contractor',
  'Pool Builder',
  'Architect',
  'Interior Designer',
  'Landscaper',
  'Renovation Specialist',
];

export const projectTypes: ProjectType[] = [
  'Villas',
  'Renovations',
  'Pools',
  'Commercial',
  'Landscaping',
  'Interior Fit-out',
];

// ============================================
// STATS HELPERS
// ============================================

export function getTotalBuilders(): number {
  return builders.length;
}

export function getTotalReviews(): number {
  return reviews.length;
}
