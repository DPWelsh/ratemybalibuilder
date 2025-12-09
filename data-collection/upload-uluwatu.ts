/**
 * Upload Uluwatu builders to Supabase
 * Run with: npx tsx data-collection/upload-uluwatu.ts
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

// Uluwatu builders
const ULUWATU_BUILDERS = [
  { name: 'Yolla Group', phone: '+6282266220431', location: 'Uluwatu', trade_type: 'General Contractor' },
  { name: 'Akura Villas', phone: '+628179727273', location: 'Uluwatu', trade_type: 'General Contractor' },
  { name: '888 Design & Build', phone: '+6281338367208', location: 'Uluwatu', trade_type: 'Architect' },
  { name: 'Bali Construction', phone: '', location: 'Uluwatu', trade_type: 'General Contractor' },
  { name: 'Gahing Karya', phone: '+6285205959776', location: 'Uluwatu', trade_type: 'General Contractor' },
  { name: 'Kingswood Bali', phone: '', location: 'Uluwatu', trade_type: 'General Contractor' },
  { name: 'Construct Bali', phone: '', location: 'Uluwatu', trade_type: 'General Contractor' },
];

async function upload() {
  console.log('Uploading Uluwatu builders...\n');

  let success = 0;
  let skipped = 0;
  let noPhone = 0;

  for (const b of ULUWATU_BUILDERS) {
    // Skip if no phone number
    if (!b.phone) {
      console.log(`No phone: ${b.name}`);
      noPhone++;
      continue;
    }

    // Check if already exists by phone
    const { data: existing } = await supabase
      .from('builders')
      .select('id, name')
      .eq('phone', b.phone)
      .single();

    if (existing) {
      console.log(`Already exists: ${b.name} -> ${existing.name}`);
      skipped++;
      continue;
    }

    // Check if same name exists
    const { data: nameExists } = await supabase
      .from('builders')
      .select('id')
      .ilike('name', `%${b.name}%`)
      .single();

    if (nameExists) {
      console.log(`Name exists: ${b.name}`);
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
  console.log(`Uploaded: ${success}, Skipped: ${skipped}, No phone: ${noPhone}`);
  console.log(`Total builders in database: ${count}`);
  console.log(`========================================`);
}

upload().catch(console.error);
