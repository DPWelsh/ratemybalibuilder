import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Normalize phone to +62 format
function normalizePhone(phone: string | null): string | null {
  if (!phone) return null;

  // Remove all non-digits
  let digits = phone.replace(/[^\d]/g, '');

  // Handle various formats
  if (digits.startsWith('62')) {
    return '+' + digits;
  } else if (digits.startsWith('0')) {
    return '+62' + digits.substring(1);
  } else if (digits.length >= 9 && digits.length <= 12) {
    // Assume Indonesian number without prefix
    return '+62' + digits;
  }

  return '+62' + digits;
}

interface BlacklistEntry {
  name: string;
  company: string | null;
  phones: string[];
  trade_type: string;
  reason: string | null;
}

const blacklistData: BlacklistEntry[] = [
  {
    name: "Margaretha Rotua Gultom",
    company: "Duradera / Jaya Construction / Jaya Yoga Artha",
    phones: ["+62 812-2022-0992", "+62 889-8751-9087"],
    trade_type: "General Contractor",
    reason: "Scamming contractor - payment done and disappeared"
  },
  {
    name: "Lanang Budi Setiawan",
    company: "Aksara Constructions",
    phones: ["+62 821-4455-5181", "+62 821-4434-7445"],
    trade_type: "General Contractor",
    reason: "Low price bait - first payment they work, second payment they disappear"
  },
  {
    name: "Kris F Hartia Errytha Chrisandy",
    company: null,
    phones: ["+62 851-6181-0182"],
    trade_type: "General Contractor",
    reason: "Ghost employee scheme, unauthorized bank transfers, payroll fraud"
  },
  {
    name: "Nanang",
    company: null,
    phones: ["+62 878-5631-9013"],
    trade_type: "General Contractor",
    reason: null
  },
  {
    name: "I Gede Nyoman Satria Sura Praba",
    company: "Maitra / CV Lestair Emas",
    phones: ["+62 823-3939-9399"],
    trade_type: "General Contractor",
    reason: "Goes client to client, runs out of money, never finishes projects"
  },
  {
    name: "Sony Mukhlasson",
    company: "Xspace",
    phones: [],
    trade_type: "General Contractor",
    reason: "Many construction sites abandoned. Has no idea about construction and finances. Architect claiming to be contractor."
  },
  {
    name: "Muhammad Arifin / Pak Roji",
    company: null,
    phones: ["+62 821-4444-2488", "+62 852-3830-4043"],
    trade_type: "General Contractor",
    reason: "Abandoned construction sites - everything is leaking"
  },
  {
    name: "Rosadi Tua Sihombing",
    company: null,
    phones: [],
    trade_type: "General Contractor",
    reason: null
  },
  {
    name: "Diar Ni Putu Sudiartini",
    company: "Dibali Assistances",
    phones: ["+62 811-203-1212"],
    trade_type: "Other",
    reason: "Took DP for SLF and disappeared"
  },
  {
    name: "Simbolon",
    company: "Raya/Simbolon",
    phones: [],
    trade_type: "Other",
    reason: "Took DP for SLF and gone. Will blackmail you."
  },
  {
    name: "Didi Wahyudi",
    company: "DND Contractor",
    phones: [],
    trade_type: "General Contractor",
    reason: "Abandoned multiple villas in multiple different locations - gone"
  },
  {
    name: "Ody Gunadiksa",
    company: "Abyudaya Bali Luxury Architecture & General Contractor",
    phones: ["+62 823-4946-0934"],
    trade_type: "Architect",
    reason: "Poor quality designs, many issues to resolve later, asks for more money to supply SKA license"
  },
  {
    name: "Dewa Putu Rinta Ekanaya (Dewarinta)",
    company: null,
    phones: ["+62 812-3787-8585"],
    trade_type: "General Contractor",
    reason: "Built retaining wall with stone instead of concrete - fully collapsed after first rain"
  },
  {
    name: "Pande Putu Puskar",
    company: null,
    phones: ["+62 821-4714-7010"],
    trade_type: "General Contractor",
    reason: "Abandoned project at ~70% completion, taking 100jt prepayment. Very poor supervision, many faults discovered after."
  },
  {
    name: "Mandiranatha Putu Gd (Putu)",
    company: null,
    phones: ["+62 812-4615-0792"],
    trade_type: "General Contractor",
    reason: "After second payment stopped working, keeping 1B. Very poor quality building, parts need demolishing. Spent money on other projects."
  },
  {
    name: "Andy Gardener & Harry Cullum",
    company: null,
    phones: [],
    trade_type: "General Contractor",
    reason: "Microcement work cracking and falling apart. Refused to fix, blamed building. Threatens customers."
  },
  {
    name: "Anggi Parulian Yushi Klisman (Jo)",
    company: null,
    phones: ["+62 882-9144-1584"],
    trade_type: "General Contractor",
    reason: "Unreliable, cheap work, arrogant, delayed by weeks, demands more payments, threatened customer, left at 90% finished demanding full payment."
  },
  {
    name: "Jamintar Obet Ginting (Pak Robert)",
    company: "CV Anugrah Bangun Persada",
    phones: ["+62 812-3953-0888"],
    trade_type: "General Contractor",
    reason: "Fully paid but didn't finish. Many delays, chose materials without permission, manipulations and threats. Takes money to gamble."
  },
  {
    name: "Wanda Murti",
    company: "La Belle Construction Bali",
    phones: ["+62 818-531-436", "+62 877-6262-1772", "+62 819-9042-0000"],
    trade_type: "General Contractor",
    reason: "Very high prices claiming quality but uses low-quality materials. Poor finishes, refuses responsibility. Mafia-like attitude, blames customer for defects."
  },
  {
    name: "Bayu (Dejuma Studio)",
    company: "Dejuma Studio",
    phones: ["+62 812-9405-0874"],
    trade_type: "Architect",
    reason: "Many mistakes in different projects, disappears and won't help fix them. Not responsible for wrong construction."
  },
  {
    name: "Ida Bagus Ngurah Mantra",
    company: "PT Dipa Pusaka",
    phones: ["+62 812-3812-640"],
    trade_type: "General Contractor",
    reason: "Works with Dejuma Studio (family). Offers below-market contracts then cuts corners on foundations and structure. Stops ordering materials and paying workers. Scam operation."
  },
  {
    name: "Bara (PT Dipa Pusaka)",
    company: "PT Dipa Pusaka",
    phones: ["+62 817-555-837"],
    trade_type: "General Contractor",
    reason: "Director's son at PT Dipa Pusaka. Part of family scam operation cutting corners on construction."
  }
];

async function importBlacklist() {
  console.log(`Importing ${blacklistData.length} blacklisted builders...\n`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const entry of blacklistData) {
    const primaryPhone = entry.phones[0] ? normalizePhone(entry.phones[0]) : null;

    // Check if already exists by name (fuzzy) or phone
    if (primaryPhone) {
      const { data: existing } = await supabase
        .from('builders')
        .select('id, name, phone')
        .or(`phone.eq.${primaryPhone},name.ilike.%${entry.name.split(' ')[0]}%`)
        .limit(1);

      if (existing && existing.length > 0) {
        console.log(`⏭️  SKIP: "${entry.name}" - similar entry exists: "${existing[0].name}" (${existing[0].phone})`);
        skipped++;
        continue;
      }
    }

    // Build phones array
    const phonesArray = entry.phones
      .map(p => normalizePhone(p))
      .filter(Boolean)
      .map(p => ({ number: p, label: 'WhatsApp' }));

    const builderData = {
      name: entry.name,
      phone: primaryPhone || '+62 000-0000-0000', // Placeholder if no phone
      phones: phonesArray.length > 0 ? phonesArray : null,
      company_name: entry.company,
      trade_type: entry.trade_type,
      location: 'Other',
      status: 'blacklisted',
      project_types: [],
      notes: entry.reason
    };

    const { data, error } = await supabase
      .from('builders')
      .insert(builderData)
      .select('id, name')
      .single();

    if (error) {
      console.log(`❌ ERROR: "${entry.name}" - ${error.message}`);
      errors++;
    } else {
      console.log(`✅ IMPORTED: "${entry.name}" (${primaryPhone || 'no phone'})`);
      imported++;
    }
  }

  console.log(`\n========== SUMMARY ==========`);
  console.log(`Imported: ${imported}`);
  console.log(`Skipped (duplicates): ${skipped}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total processed: ${blacklistData.length}`);
}

importBlacklist().catch(console.error);
