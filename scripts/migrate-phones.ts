// Script to migrate existing phone data to the new phones JSONB array
// Run with: npx tsx scripts/migrate-phones.ts

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables. Make sure .env.local exists with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface PhoneEntry {
  number: string;
  type: 'primary' | 'whatsapp' | 'office' | 'mobile' | 'other';
  label: string;
}

async function migratePhones() {
  console.log('Fetching all builders...');

  const { data: builders, error } = await supabase
    .from('builders')
    .select('id, name, phone, phones');

  if (error) {
    console.error('Error fetching builders:', error);
    return;
  }

  if (!builders || builders.length === 0) {
    console.log('No builders found.');
    return;
  }

  console.log(`Found ${builders.length} builders. Checking for migration needs...`);

  let migrated = 0;
  let skipped = 0;

  for (const builder of builders) {
    const existingPhones = (builder.phones as PhoneEntry[]) || [];

    // Skip if phones array already has entries
    if (existingPhones.length > 0) {
      console.log(`Skipping ${builder.name}: already has ${existingPhones.length} phone(s) in array`);
      skipped++;
      continue;
    }

    // Skip if no primary phone to migrate
    if (!builder.phone || builder.phone.trim() === '') {
      console.log(`Skipping ${builder.name}: no primary phone to migrate`);
      skipped++;
      continue;
    }

    // Create new phones array with the primary phone
    const newPhones: PhoneEntry[] = [
      {
        number: builder.phone,
        type: 'primary',
        label: 'Primary',
      },
    ];

    const { error: updateError } = await supabase
      .from('builders')
      .update({ phones: newPhones })
      .eq('id', builder.id);

    if (updateError) {
      console.error(`Error updating ${builder.name}:`, updateError);
    } else {
      console.log(`Migrated ${builder.name}: ${builder.phone}`);
      migrated++;
    }
  }

  console.log(`\nMigration complete!`);
  console.log(`  Migrated: ${migrated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total: ${builders.length}`);
}

migratePhones().catch(console.error);
