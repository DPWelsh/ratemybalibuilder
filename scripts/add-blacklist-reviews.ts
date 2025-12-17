import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Normalize phone to digits only for matching
function normalizePhone(phone: string): string {
  return phone.replace(/[^\d]/g, '');
}

// Review data mapped to phone numbers (normalized)
const reviewData: { phones: string[]; reviews: string[] }[] = [
  {
    phones: ['+62 812-2022-0992', '+62 889-8751-9087'],
    reviews: ['Scamming contractor - payment done and disappeared']
  },
  {
    phones: ['0062 821-4455-5181', '0062 821 4434 7445'],
    reviews: ['Low price bait - first payment they do something, second payment they disappear']
  },
  {
    phones: ['0062 851 6181 0182'],
    reviews: ['Ghost employee scheme, unauthorized bank transfers, payroll fraud']
  },
  {
    phones: ['+62 878 56319013'],
    reviews: [] // No review text provided
  },
  {
    phones: ['0823 39399399'],
    reviews: ['Goes client to client, runs out of money, never finishes projects']
  },
  {
    phones: ['628112031212'],
    reviews: ['Took DP for SLF and disappeared']
  },
  {
    phones: ['62 823-4946-0934'],
    reviews: ['Poor quality architect - doesn\'t deliver good quality designs, many issues to resolve later, asks for more money to supply SKA license']
  },
  {
    phones: ['081237878585'],
    reviews: ['Built a very large retaining wall pretending to use concrete but actually filling columns with stone only and putting some cement on top - fully collapsed after first rain']
  },
  {
    phones: ['082147147010'],
    reviews: ['Abandoned project at ~70% completion, taking 100jt prepayment. Very poor supervision, lots of faults discovered after (e.g. 4 leaks in water supply)']
  },
  {
    phones: ['81246150792'],
    reviews: ['After second payment stopped working, keeping 1B and lying through the process. Very poor quality building, need some parts to be demolished. He spent my money on other projects. Claims to be an architect but far from it.']
  },
  {
    phones: ['88291441584'],
    reviews: ['Totally unreliable, work is super cheap and looks cheap, super arrogant, delayed by weeks, asks for more and more payments, threatened me in the end, left his trash in front of the house, workers often not present or not working at all on site, bad communication, left site when it was 90% finished and still demanded full payment.']
  },
  {
    phones: ['818 531 436'],
    reviews: ['Construction company with very high prices claiming quality, but builds by mixing standard materials with very low-quality ones. Poor finishes, refuses to take responsibility for fixing things. Mafia-like attitude when held accountable. Will do anything to blame you for construction defects. Zero professionalism.']
  },
  {
    phones: ['0812 94050874'],
    reviews: ['After making many mistakes in different projects, they disappear and don\'t help to fix them. All the investment in the wrong construction becomes your responsibility - they will not help you.']
  },
  {
    phones: ['0812 3812640'],
    reviews: ['PT Dipa Pusaka & Dejuma Studio operate together as family. Bayu\'s father is Mantra\'s brother. Bayu acts like the "sales person" with zero knowledge.']
  },
  {
    phones: ['0817 555837'],
    reviews: ['Reckless and dangerous, scammed plenty of developers. They offer below-market contracts as bait, then cut corners on foundations and structure until they make profit, then disappear. In my project they stopped ordering materials and paying workers, so I had to step in from 50% progress. The whole family operates this scam.']
  },
  // Additional entries from the data
  {
    phones: ['081239530888'],
    reviews: ['Fully paid but didn\'t finish. Many delays, chose materials without permission, manipulations and threats. Takes money to gamble.']
  },
  {
    phones: ['081237878585', '62 812-3787-8585'],
    reviews: ['Built retaining wall with stone instead of concrete - fully collapsed after first rain']
  },
  {
    phones: ['082147147010', '+62 821-4714-7010'],
    reviews: ['Abandoned project at ~70% completion, taking 100jt prepayment with him. Very poor supervision, many faults discovered after.']
  },
];

async function addReviews() {
  console.log('Updating notes for blacklisted builders...\n');

  // Get all blacklisted builders
  const { data: builders, error } = await supabase
    .from('builders')
    .select('id, name, phone, notes')
    .eq('status', 'blacklisted');

  if (error) {
    console.error('Error fetching builders:', error);
    return;
  }

  console.log(`Found ${builders?.length} blacklisted builders\n`);

  let notesUpdated = 0;

  for (const reviewEntry of reviewData) {
    if (reviewEntry.reviews.length === 0) continue;

    // Find matching builder by phone
    for (const phone of reviewEntry.phones) {
      const normalizedSearch = normalizePhone(phone);
      if (normalizedSearch.length < 8) continue; // Skip short numbers

      const matchingBuilder = builders?.find(b => {
        const normalizedBuilderPhone = normalizePhone(b.phone || '');
        // Check if last 10 digits match (to handle country code variations)
        const searchLast10 = normalizedSearch.slice(-10);
        const builderLast10 = normalizedBuilderPhone.slice(-10);
        return searchLast10 === builderLast10;
      });

      if (matchingBuilder) {
        const newNote = reviewEntry.reviews.join('\n\n');

        // Only update if different from existing notes
        if (matchingBuilder.notes === newNote) {
          console.log(`${matchingBuilder.name}: Notes already up to date`);
          break;
        }

        const { error: updateError } = await supabase
          .from('builders')
          .update({ notes: newNote })
          .eq('id', matchingBuilder.id);

        if (updateError) {
          console.error(`Error updating ${matchingBuilder.name}: ${updateError.message}`);
        } else {
          console.log(`Updated: ${matchingBuilder.name}`);
          console.log(`  Phone: ${matchingBuilder.phone}`);
          console.log(`  Notes: "${newNote.substring(0, 80)}..."`);
          notesUpdated++;
        }

        break; // Found match, move to next review entry
      }
    }
  }

  console.log('\n========== SUMMARY ==========');
  console.log(`Notes updated: ${notesUpdated}`);
}

addReviews().catch(console.error);
