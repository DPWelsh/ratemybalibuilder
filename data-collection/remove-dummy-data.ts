/**
 * Remove dummy seed data from Supabase
 * Run with: npx tsx data-collection/remove-dummy-data.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load env from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const SUPABASE_SERVICE_KEY = envVars['SUPABASE_SERVICE_ROLE_KEY'];

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const DUMMY_IDS = [
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888',
  '99999999-9999-9999-9999-999999999999',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
];

async function removeDummyData() {
  console.log('Removing 15 dummy seed entries...\n');

  const { data, error } = await supabase
    .from('builders')
    .delete()
    .in('id', DUMMY_IDS)
    .select();

  if (error) {
    console.error('Error deleting dummy data:', error.message);
    process.exit(1);
  }

  console.log(`✓ Deleted ${data?.length || 0} dummy entries\n`);

  // Show remaining builders
  const { data: remaining, error: listError } = await supabase
    .from('builders')
    .select('name, phone, location, trade_type, status')
    .order('created_at', { ascending: false });

  if (listError) {
    console.error('Error listing builders:', listError.message);
  } else {
    console.log(`Remaining ${remaining?.length || 0} real builders:`);
    console.log('========================================');
    remaining?.forEach((b, i) => {
      console.log(`${i + 1}. ${b.name} (${b.phone}) - ${b.location}, ${b.trade_type}`);
    });
  }
}

removeDummyData().catch(console.error);
