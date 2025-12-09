/**
 * Upload builders from CSV to Supabase
 * Run with: npx tsx data-collection/upload-builders.ts
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

// Simple CSV parser
function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

  return lines.slice(1).map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const record: Record<string, string> = {};
    headers.forEach((header, i) => {
      record[header] = values[i] || '';
    });
    return record;
  });
}

// Normalize phone number
function normalizePhone(phone: string): string {
  if (!phone) return '';
  let normalized = phone.replace(/[\s\-\(\)]/g, '');
  if (normalized.startsWith('0')) {
    normalized = '+62' + normalized.slice(1);
  } else if (!normalized.startsWith('+')) {
    normalized = '+62' + normalized;
  }
  return normalized;
}

async function uploadBuilders() {
  const csvPath = path.join(__dirname, 'builders.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parseCSV(csvContent);

  console.log(`Found ${records.length} builders to process`);

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const record of records) {
    const phone = normalizePhone(record.phone);

    // Skip if no phone number
    if (!phone || phone === '+62') {
      console.log(`Skipping ${record.name}: No phone number`);
      skipCount++;
      continue;
    }

    // Map trade_type to valid enum
    let tradeType = 'General Contractor';
    const t = record.trade_type?.toLowerCase() || '';
    if (t.includes('pool')) tradeType = 'Pool Builder';
    else if (t.includes('architect')) tradeType = 'Architect';
    else if (t.includes('interior')) tradeType = 'Interior Designer';
    else if (t.includes('landscape')) tradeType = 'Landscaper';
    else if (t.includes('renovation')) tradeType = 'Renovation Specialist';

    // Map location to valid enum
    let location = 'Other';
    const l = record.location?.toLowerCase() || '';
    if (l.includes('canggu')) location = 'Canggu';
    else if (l.includes('seminyak')) location = 'Seminyak';
    else if (l.includes('ubud')) location = 'Ubud';
    else if (l.includes('uluwatu')) location = 'Uluwatu';
    else if (l.includes('sanur')) location = 'Sanur';
    else if (l.includes('denpasar')) location = 'Denpasar';
    else if (l.includes('kuta')) location = 'Canggu'; // Close enough
    else if (l.includes('jimbaran')) location = 'Uluwatu'; // Close enough
    else if (l.includes('kerobokan')) location = 'Seminyak'; // Close enough
    else if (l.includes('legian')) location = 'Seminyak'; // Close enough
    else if (l.includes('gianyar')) location = 'Ubud'; // Close enough
    else if (l.includes('tibubeneng')) location = 'Canggu'; // Close enough

    const builder = {
      name: record.name || 'Unknown Builder',
      phone: phone,
      company_name: record.company_name || null,
      location: location,
      trade_type: tradeType,
      status: 'unknown' as const,
    };

    // Check if already exists
    const { data: existing } = await supabase
      .from('builders')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existing) {
      console.log(`Already exists: ${record.name} (${phone})`);
      skipCount++;
      continue;
    }

    const { error } = await supabase
      .from('builders')
      .insert(builder);

    if (error) {
      console.error(`Error uploading ${record.name}:`, error.message);
      errorCount++;
    } else {
      console.log(`✓ Uploaded: ${record.name} (${phone}) - ${location}, ${tradeType}`);
      successCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Done! Uploaded: ${successCount}, Skipped: ${skipCount}, Errors: ${errorCount}`);
  console.log(`========================================`);
}

uploadBuilders().catch(console.error);
