/**
 * Scrape phone numbers from builder websites
 * Run with: npx tsx data-collection/scrape-phones.ts
 */

// Builders that need phone numbers
const BUILDERS_TO_SCRAPE = [
  { name: 'Greenwise Constructions', url: 'https://www.greenwise-constructions.com/' },
  { name: 'IDL Bali Construction', url: 'https://baliconstruction.id/' },
  { name: 'Bali Contractors', url: 'https://balicontractors.com/' },
  { name: 'Image Bali Contractors', url: 'https://contractor.imagebali.com/' },
  { name: 'Nata Nusa', url: 'https://www.natanusa.id/' },
  { name: 'Bali General Contractor', url: 'https://www.baligeneralcontractor.com/' },
  { name: 'May & Lou International', url: 'https://www.mayloubalibuilder.com/contact-us/' },
  { name: 'Sunar Jaya Group', url: 'https://sunarjayagroup.com/' },
  { name: 'Archiola', url: 'https://archiola.com/' },
  { name: 'iLot Property Bali', url: 'https://ilotpropertybali.com/' },
  { name: 'Bali Interiors', url: 'https://www.bali-interiors.com/' },
  { name: 'Kapi Nala Landscape', url: 'https://www.kapinala.com/' },
  { name: 'Bali Landscaping', url: 'https://www.balilandscaping.com/' },
  { name: 'Rasita Karya Bali', url: 'https://rasitakaryabali.com/' },
  { name: 'Bali Villa Kontraktor', url: 'https://balivillakontraktor.com/' },
  { name: 'Karyanusa Asia', url: 'https://karyanusa.asia/' },
];

// Phone number regex patterns for Indonesian numbers
const PHONE_PATTERNS = [
  /\+62[\s\-]?\d{2,4}[\s\-]?\d{3,4}[\s\-]?\d{3,4}[\s\-]?\d{0,4}/g,  // +62 format
  /\(0\d{2,3}\)[\s\-]?\d{3,4}[\s\-]?\d{3,4}/g,                       // (021) format
  /0\d{2,3}[\s\-]?\d{3,4}[\s\-]?\d{3,4}[\s\-]?\d{0,4}/g,            // 08xx format
  /62[\s\-]?\d{2,4}[\s\-]?\d{3,4}[\s\-]?\d{3,4}/g,                   // 62 without +
];

// WhatsApp link patterns
const WHATSAPP_PATTERNS = [
  /wa\.me\/(\d+)/gi,
  /whatsapp\.com\/send\?phone=(\d+)/gi,
  /api\.whatsapp\.com\/send\?phone=(\d+)/gi,
];

async function fetchPage(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    throw error;
  }
}

function extractPhones(html: string): string[] {
  const phones = new Set<string>();

  // Extract from WhatsApp links first (most reliable)
  for (const pattern of WHATSAPP_PATTERNS) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      let phone = match[1];
      if (!phone.startsWith('+')) {
        phone = '+' + phone;
      }
      phones.add(phone);
    }
  }

  // Extract phone numbers from text
  for (const pattern of PHONE_PATTERNS) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      let phone = match[0].replace(/[\s\-\(\)]/g, '');
      // Normalize to +62 format
      if (phone.startsWith('0')) {
        phone = '+62' + phone.slice(1);
      } else if (phone.startsWith('62') && !phone.startsWith('+')) {
        phone = '+' + phone;
      }
      // Filter out obviously wrong numbers
      if (phone.length >= 10 && phone.length <= 15) {
        phones.add(phone);
      }
    }
  }

  return Array.from(phones);
}

async function scrapeBuilders() {
  console.log('Scraping phone numbers from builder websites...\n');
  console.log('='.repeat(60));

  const results: { name: string; url: string; phones: string[] }[] = [];

  for (const builder of BUILDERS_TO_SCRAPE) {
    process.stdout.write(`${builder.name}... `);

    try {
      const html = await fetchPage(builder.url);
      const phones = extractPhones(html);

      if (phones.length > 0) {
        console.log(`Found: ${phones.join(', ')}`);
        results.push({ ...builder, phones });
      } else {
        console.log('No phone found');
        results.push({ ...builder, phones: [] });
      }
    } catch (error: any) {
      console.log(`Error: ${error.message}`);
      results.push({ ...builder, phones: [] });
    }

    // Small delay between requests
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('\nSUMMARY - Builders with phones found:');
  console.log('-'.repeat(60));

  const found = results.filter(r => r.phones.length > 0);
  const notFound = results.filter(r => r.phones.length === 0);

  if (found.length > 0) {
    console.log('\nCSV format (copy to builders.csv):');
    console.log('-'.repeat(60));
    for (const r of found) {
      const phone = r.phones[0]; // Use first phone found
      console.log(`"${r.name}","${phone}","","Bali","General Contractor","${r.url}","Scraped"`);
    }
  }

  console.log(`\nFound phones for: ${found.length}/${BUILDERS_TO_SCRAPE.length} builders`);

  if (notFound.length > 0) {
    console.log('\nStill need manual lookup:');
    notFound.forEach(r => console.log(`  - ${r.name}: ${r.url}`));
  }
}

scrapeBuilders().catch(console.error);
