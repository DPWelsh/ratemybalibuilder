/**
 * Update trade types for existing builders in Supabase
 * Uses the name to match builders and their websites
 * Run with: npx tsx data-collection/update-trade-types.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load env
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  envVars['NEXT_PUBLIC_SUPABASE_URL'],
  envVars['SUPABASE_SERVICE_ROLE_KEY']
);

// Builders with their known websites
const BUILDER_WEBSITES: Record<string, string> = {
  'Greenwise Constructions': 'https://www.greenwise-constructions.com/',
  'IDL Bali Construction': 'https://baliconstruction.id/',
  'Bali Contractors': 'https://balicontractors.com/',
  'Image Bali Contractors': 'https://contractor.imagebali.com/',
  'Nata Nusa': 'https://www.natanusa.id/',
  'Bali General Contractor': 'https://www.baligeneralcontractor.com/',
  'May & Lou International': 'https://www.mayloubalibuilder.com/',
  'Sunar Jaya Group': 'https://sunarjayagroup.com/',
  'Archiola': 'https://archiola.com/',
  'iLot Property Bali': 'https://ilotpropertybali.com/',
  'Bali Interiors': 'https://www.bali-interiors.com/',
  'Kapi Nala Landscape': 'https://www.kapinala.com/',
  'Bali Landscaping': 'https://www.balilandscaping.com/',
  'Rasita Karya Bali': 'https://rasitakaryabali.com/',
  'Bali Villa Kontraktor': 'https://balivillakontraktor.com/',
  'Karyanusa Asia': 'https://karyanusa.asia/',
};

// Trade type keywords - ordered by specificity
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

function detectTradeType(html: string, url: string, name: string): string {
  const lowerHtml = html.toLowerCase();
  const lowerUrl = url.toLowerCase();
  const lowerName = name.toLowerCase();

  // Check URL and name first for strong signals
  if (lowerUrl.includes('pool') || lowerName.includes('pool')) return 'Pool Builder';
  if (lowerUrl.includes('landscape') || lowerName.includes('landscape')) return 'Landscaper';
  if (lowerUrl.includes('interior') || lowerName.includes('interior')) return 'Interior Designer';
  if (lowerUrl.includes('architect') || lowerName.includes('architect')) return 'Architect';
  if (lowerUrl.includes('plumb') || lowerName.includes('plumb')) return 'Plumber';
  if (lowerUrl.includes('electri') || lowerName.includes('electri')) return 'Electrician';

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

async function updateTradeTypes() {
  console.log('Fetching builders from database...\n');

  // Get all builders
  const { data: builders, error } = await supabase
    .from('builders')
    .select('id, name, trade_type');

  if (error) {
    console.error('Error fetching builders:', error);
    return;
  }

  console.log(`Found ${builders?.length || 0} builders\n`);
  console.log('='.repeat(70));

  let updated = 0;
  let failed = 0;
  let unchanged = 0;
  let noWebsite = 0;

  for (const builder of builders || []) {
    const website = BUILDER_WEBSITES[builder.name];

    if (!website) {
      console.log(`${builder.name.padEnd(35)} - No website mapped`);
      noWebsite++;
      continue;
    }

    process.stdout.write(`${builder.name.padEnd(35)}... `);

    try {
      const html = await fetchPage(website);
      const detectedType = detectTradeType(html, website, builder.name);

      if (detectedType !== builder.trade_type) {
        const { error: updateError } = await supabase
          .from('builders')
          .update({ trade_type: detectedType })
          .eq('id', builder.id);

        if (updateError) {
          console.log(`Error: ${updateError.message}`);
          failed++;
        } else {
          console.log(`${builder.trade_type || 'null'} -> ${detectedType}`);
          updated++;
        }
      } else {
        console.log(`${detectedType} (unchanged)`);
        unchanged++;
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.log(`Fetch error: ${message}`);
      failed++;
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n' + '='.repeat(70));
  console.log(`\nRESULTS:`);
  console.log(`Updated: ${updated}`);
  console.log(`Unchanged: ${unchanged}`);
  console.log(`No website: ${noWebsite}`);
  console.log(`Failed: ${failed}`);
}

updateTradeTypes().catch(console.error);
