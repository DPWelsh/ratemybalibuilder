/**
 * Upload newly scraped builders to Supabase
 * Run with: npx tsx data-collection/upload-scraped.ts
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

// Newly scraped builders with valid Indonesian mobile numbers
const NEW_BUILDERS = [
  { name: 'IDL Bali Construction', phone: '+6282146772060', location: 'Other', trade_type: 'General Contractor', url: 'https://baliconstruction.id/' },
  { name: 'Bali Contractors', phone: '+6287865305473', location: 'Other', trade_type: 'General Contractor', url: 'https://balicontractors.com/' },
  { name: 'Nata Nusa', phone: '+6285747151995', location: 'Other', trade_type: 'General Contractor', url: 'https://www.natanusa.id/' },
  { name: 'Bali General Contractor', phone: '+6281337055551', location: 'Other', trade_type: 'General Contractor', url: 'https://www.baligeneralcontractor.com/' },
  { name: 'May & Lou International', phone: '+6281238238473', location: 'Seminyak', trade_type: 'General Contractor', url: 'https://www.mayloubalibuilder.com/' },
  { name: 'iLot Property Bali', phone: '+6282322888090', location: 'Other', trade_type: 'Architect', url: 'https://ilotpropertybali.com/' },
  { name: 'Karyanusa Asia', phone: '+6281803888872', location: 'Other', trade_type: 'General Contractor', url: 'https://karyanusa.asia/' },
  { name: 'Rasita Karya Bali', phone: '+6287749855868', location: 'Ubud', trade_type: 'General Contractor', url: 'https://rasitakaryabali.com/' },
];

async function upload() {
  console.log('Uploading newly scraped builders...\n');

  let success = 0;
  let skipped = 0;

  for (const b of NEW_BUILDERS) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('builders')
      .select('id')
      .eq('phone', b.phone)
      .single();

    if (existing) {
      console.log(`Already exists: ${b.name}`);
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('builders')
      .insert({
        name: b.name,
        phone: b.phone,
        location: b.location,
        trade_type: b.trade_type,
        status: 'unknown',
      });

    if (error) {
      console.error(`Error: ${b.name} - ${error.message}`);
    } else {
      console.log(`✓ Uploaded: ${b.name} (${b.phone})`);
      success++;
    }
  }

  // Get total count
  const { count } = await supabase
    .from('builders')
    .select('*', { count: 'exact', head: true });

  console.log(`\n========================================`);
  console.log(`Uploaded: ${success}, Skipped: ${skipped}`);
  console.log(`Total builders in database: ${count}`);
  console.log(`========================================`);
}

upload().catch(console.error);
