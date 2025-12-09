/**
 * Upload builders from CSV to Supabase
 *
 * Usage:
 * 1. Fill in builders.csv with scraped data
 * 2. Run: node upload-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function uploadBuilders() {
  // Read CSV file
  const csvPath = './builders.csv';

  if (!fs.existsSync(csvPath)) {
    console.error('builders.csv not found. Copy builders-template.csv to builders.csv and fill in data.');
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Found ${records.length} builders to upload`);

  let successCount = 0;
  let errorCount = 0;

  for (const record of records) {
    // Skip if no phone number
    if (!record.phone) {
      console.warn(`Skipping ${record.name}: No phone number`);
      continue;
    }

    // Normalize phone number (remove spaces, ensure +62 prefix)
    let phone = record.phone.replace(/\s+/g, '').replace(/-/g, '');
    if (phone.startsWith('0')) {
      phone = '+62' + phone.slice(1);
    } else if (!phone.startsWith('+')) {
      phone = '+62' + phone;
    }

    const builder = {
      name: record.name || 'Unknown Builder',
      phone: phone,
      company_name: record.company_name || null,
      location: record.location || 'Other',
      trade_type: record.trade_type || 'General Contractor',
      status: 'unknown', // Default status for new builders
    };

    const { error } = await supabase
      .from('builders')
      .upsert(builder, {
        onConflict: 'phone',
        ignoreDuplicates: true
      });

    if (error) {
      console.error(`Error uploading ${record.name}:`, error.message);
      errorCount++;
    } else {
      console.log(`Uploaded: ${record.name} (${phone})`);
      successCount++;
    }
  }

  console.log(`\nDone! Uploaded ${successCount} builders, ${errorCount} errors.`);
}

uploadBuilders().catch(console.error);
