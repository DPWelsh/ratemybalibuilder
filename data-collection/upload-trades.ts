/**
 * Upload specialized trades to Supabase
 * Run with: npx tsx data-collection/upload-trades.ts
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

// New trades scraped from web searches
const NEW_TRADES = [
  // Plumbers
  { name: 'Plumber Bali', phone: '+6281808029595', location: 'Denpasar', trade_type: 'Plumber', website: 'https://www.plumberbali.com/' },
  { name: 'Bali Plumbing', phone: '+6281238999467', location: 'Uluwatu', trade_type: 'Plumber', website: 'https://www.baliplumbing.com/' },

  // Electricians
  { name: 'Electrician Bali', phone: '+6281808029595', location: 'Denpasar', trade_type: 'Electrician', website: 'https://www.electricianbali.com/' },

  // HVAC / AC
  { name: 'Air Conditioning Bali', phone: '+6281808029595', location: 'Denpasar', trade_type: 'HVAC', website: 'https://www.airconditioningbali.com/' },
  { name: 'Ducting System HVAC Bali', phone: '+6285239182454', location: 'Uluwatu', trade_type: 'HVAC', website: 'https://www.ductingsystemhvacbali.com/' },
  { name: 'Service AC Gede Bali', phone: '+6282147454647', location: 'Denpasar', trade_type: 'HVAC', website: 'https://www.serviceacgedebali.com/' },

  // Handyman / Multi-trade
  { name: 'The Bali Handyman', phone: '+6287719015093', location: 'Other', trade_type: 'Renovation Specialist', website: 'https://thebalihandyman.com/' },

  // Welders / Metal
  { name: 'Bali Pro Weld', phone: '', location: 'Denpasar', trade_type: 'Welder', website: 'https://baliproweld.com/' },

  // Carpenters / Furniture
  { name: 'Kalpa Taru Bali', phone: '', location: 'Other', trade_type: 'Carpenter', website: 'https://www.kalpatarubali.com/' },
  { name: 'Bares Furniture Bali', phone: '', location: 'Gianyar', trade_type: 'Carpenter', website: 'https://baresfurniturebali.com/' },
  { name: 'Creative Living Bali', phone: '', location: 'Other', trade_type: 'Carpenter', website: 'https://www.creativelivingbali.com/' },
];

async function upload() {
  console.log('Uploading new trades to database...\n');

  let success = 0;
  let skipped = 0;
  let noPhone = 0;

  for (const t of NEW_TRADES) {
    // Skip if no phone number
    if (!t.phone) {
      console.log(`No phone: ${t.name} (${t.trade_type})`);
      noPhone++;
      continue;
    }

    // Check if already exists by phone
    const { data: existing } = await supabase
      .from('builders')
      .select('id, name')
      .eq('phone', t.phone)
      .single();

    if (existing) {
      console.log(`Already exists: ${t.name} -> ${existing.name}`);
      skipped++;
      continue;
    }

    // Check if same name exists
    const { data: nameExists } = await supabase
      .from('builders')
      .select('id')
      .ilike('name', t.name)
      .single();

    if (nameExists) {
      console.log(`Name exists: ${t.name}`);
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('builders')
      .insert({
        name: t.name,
        phone: t.phone,
        location: t.location,
        trade_type: t.trade_type,
        status: 'unknown',
      });

    if (error) {
      console.error(`Error: ${t.name} - ${error.message}`);
    } else {
      console.log(`✓ Uploaded: ${t.name} (${t.trade_type}) - ${t.phone}`);
      success++;
    }
  }

  // Get total count
  const { count } = await supabase
    .from('builders')
    .select('*', { count: 'exact', head: true });

  console.log(`\n========================================`);
  console.log(`Uploaded: ${success}, Skipped: ${skipped}, No phone: ${noPhone}`);
  console.log(`Total builders in database: ${count}`);
  console.log(`========================================`);

  // Show trade type breakdown
  const { data: breakdown } = await supabase
    .from('builders')
    .select('trade_type');

  if (breakdown) {
    const counts: Record<string, number> = {};
    for (const b of breakdown) {
      counts[b.trade_type] = (counts[b.trade_type] || 0) + 1;
    }
    console.log('\nTrade type breakdown:');
    for (const [type, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${type}: ${count}`);
    }
  }
}

upload().catch(console.error);
