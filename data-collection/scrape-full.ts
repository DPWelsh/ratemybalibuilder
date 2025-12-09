/**
 * Full scraper - extracts phones AND trade types from builder websites
 * Run with: npx tsx data-collection/scrape-full.ts
 */

const BUILDERS_TO_SCRAPE = [
  { name: 'Greenwise Constructions', url: 'https://www.greenwise-constructions.com/', location: 'Seminyak' },
  { name: 'IDL Bali Construction', url: 'https://baliconstruction.id/', location: 'Other' },
  { name: 'Bali Contractors', url: 'https://balicontractors.com/', location: 'Other' },
  { name: 'Image Bali Contractors', url: 'https://contractor.imagebali.com/', location: 'Other' },
  { name: 'Nata Nusa', url: 'https://www.natanusa.id/', location: 'Other' },
  { name: 'Bali General Contractor', url: 'https://www.baligeneralcontractor.com/', location: 'Other' },
  { name: 'May & Lou International', url: 'https://www.mayloubalibuilder.com/', location: 'Seminyak' },
  { name: 'Sunar Jaya Group', url: 'https://sunarjayagroup.com/', location: 'Other' },
  { name: 'Archiola', url: 'https://archiola.com/', location: 'Other' },
  { name: 'iLot Property Bali', url: 'https://ilotpropertybali.com/', location: 'Other' },
  { name: 'Bali Interiors', url: 'https://www.bali-interiors.com/', location: 'Other' },
  { name: 'Kapi Nala Landscape', url: 'https://www.kapinala.com/', location: 'Other' },
  { name: 'Bali Landscaping', url: 'https://www.balilandscaping.com/', location: 'Gianyar' },
  { name: 'Rasita Karya Bali', url: 'https://rasitakaryabali.com/', location: 'Other' },
  { name: 'Bali Villa Kontraktor', url: 'https://balivillakontraktor.com/', location: 'Other' },
  { name: 'Karyanusa Asia', url: 'https://karyanusa.asia/', location: 'Other' },
];

// Trade type keywords - ordered by specificity (most specific first)
const TRADE_KEYWORDS = {
  'Plumber': ['plumber', 'plumbing', 'pipa', 'water pipe', 'sanitary', 'drain'],
  'Electrician': ['electrician', 'electrical', 'listrik', 'wiring', 'elektrik'],
  'Pool Builder': ['pool', 'swimming pool', 'kolam renang', 'pool contractor'],
  'Architect': ['architect', 'arsitek', 'architectural'],
  'Interior Designer': ['interior design', 'interior designer', 'furniture', 'furnishing', 'fit out'],
  'Landscaper': ['landscape', 'landscaping', 'garden', 'taman', 'outdoor'],
  'Renovation Specialist': ['renovation', 'renovasi', 'remodel', 'refurbish', 'restore'],
  'Roofer': ['roof', 'roofing', 'atap'],
  'Painter': ['painter', 'painting', 'cat', 'wall finish'],
  'Tiler': ['tile', 'tiling', 'keramik', 'ceramic', 'marble'],
  'Carpenter': ['carpenter', 'carpentry', 'woodwork', 'kayu', 'joinery'],
  'Mason': ['mason', 'masonry', 'bricklayer', 'batu'],
  'HVAC': ['hvac', 'air conditioning', 'ac', 'cooling', 'ventilation'],
  'Welder': ['welder', 'welding', 'las', 'metal work', 'steel'],
  'Glass & Glazing': ['glass', 'glazing', 'kaca', 'window'],
  'General Contractor': ['contractor', 'kontraktor', 'construction', 'build', 'villa', 'rumah'],
};

// Phone patterns
const PHONE_PATTERNS = [
  /\+62[\s\-]?\d{2,4}[\s\-]?\d{3,4}[\s\-]?\d{3,4}[\s\-]?\d{0,4}/g,
  /0\d{2,3}[\s\-]?\d{3,4}[\s\-]?\d{3,4}[\s\-]?\d{0,4}/g,
];

const WHATSAPP_PATTERNS = [
  /wa\.me\/(\d+)/gi,
  /whatsapp\.com\/send\?phone=(\d+)/gi,
];

async function fetchPage(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    throw error;
  }
}

function extractPhones(html: string): string[] {
  const phones = new Set<string>();

  // WhatsApp links first
  for (const pattern of WHATSAPP_PATTERNS) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      let phone = match[1];
      if (!phone.startsWith('+')) phone = '+' + phone;
      if (phone.length >= 10 && phone.length <= 15) phones.add(phone);
    }
  }

  // Phone numbers from text
  for (const pattern of PHONE_PATTERNS) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      let phone = match[0].replace(/[\s\-\(\)]/g, '');
      if (phone.startsWith('0')) phone = '+62' + phone.slice(1);
      else if (phone.startsWith('62') && !phone.startsWith('+')) phone = '+' + phone;
      // Only valid Indonesian mobile numbers
      if (phone.match(/^\+628\d{8,11}$/)) phones.add(phone);
    }
  }

  return Array.from(phones);
}

function detectTradeType(html: string, url: string): string {
  const lowerHtml = html.toLowerCase();
  const lowerUrl = url.toLowerCase();

  // Check URL first for strong signals
  if (lowerUrl.includes('pool')) return 'Pool Builder';
  if (lowerUrl.includes('landscape')) return 'Landscaper';
  if (lowerUrl.includes('interior')) return 'Interior Designer';
  if (lowerUrl.includes('architect')) return 'Architect';

  // Count keyword matches
  const scores: Record<string, number> = {};
  for (const [trade, keywords] of Object.entries(TRADE_KEYWORDS)) {
    scores[trade] = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi');
      const matches = lowerHtml.match(regex);
      if (matches) scores[trade] += matches.length;
    }
  }

  // Return highest scoring trade type
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted[0][1] > 5) return sorted[0][0];

  return 'General Contractor'; // Default
}

async function scrape() {
  console.log('Scraping builder details...\n');
  console.log('='.repeat(70));

  const results: {
    name: string;
    url: string;
    location: string;
    phones: string[];
    trade_type: string;
  }[] = [];

  for (const builder of BUILDERS_TO_SCRAPE) {
    process.stdout.write(`${builder.name.padEnd(30)}... `);

    try {
      const html = await fetchPage(builder.url);
      const phones = extractPhones(html);
      const trade_type = detectTradeType(html, builder.url);

      if (phones.length > 0) {
        console.log(`${phones[0]} | ${trade_type}`);
      } else {
        console.log(`No phone | ${trade_type}`);
      }

      results.push({
        name: builder.name,
        url: builder.url,
        location: builder.location,
        phones,
        trade_type,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.log(`Error: ${message}`);
      results.push({
        name: builder.name,
        url: builder.url,
        location: builder.location,
        phones: [],
        trade_type: 'General Contractor',
      });
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n' + '='.repeat(70));
  console.log('\nRESULTS:\n');

  const found = results.filter(r => r.phones.length > 0);
  console.log(`Found phones for ${found.length}/${BUILDERS_TO_SCRAPE.length} builders\n`);

  console.log('CSV format:');
  console.log('name,phone,location,trade_type,url');
  for (const r of found) {
    console.log(`"${r.name}","${r.phones[0]}","${r.location}","${r.trade_type}","${r.url}"`);
  }
}

scrape().catch(console.error);
