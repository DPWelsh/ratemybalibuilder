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

// Review data mapped to phone numbers
const reviewData: { phones: string[]; reviews: string[] }[] = [
  {
    phones: ['812-2022-0992', '889-8751-9087'],
    reviews: ['Scamming contractor - payment done and disappeared']
  },
  {
    phones: ['821-4455-5181', '821-4434-7445'],
    reviews: ['Low price bait - first payment they do something, second payment they disappear']
  },
  {
    phones: ['851-6181-0182'],
    reviews: ['Ghost employee scheme, unauthorized bank transfers, payroll fraud']
  },
  {
    phones: ['823-3939-9399'],
    reviews: ['Goes client to client, runs out of money, never finishes projects']
  },
  {
    phones: ['811-2031-212'],
    reviews: ['Took DP for SLF and disappeared']
  },
  {
    phones: ['823-4946-0934'],
    reviews: ['Poor quality architect - doesn\'t deliver good quality designs, many issues to resolve later, asks for more money to supply SKA license']
  },
  {
    phones: ['812-3787-8585'],
    reviews: ['Built a very large retaining wall pretending to use concrete but actually filling columns with stone only and putting some cement on top - fully collapsed after first rain']
  },
  {
    phones: ['821-4714-7010'],
    reviews: ['Abandoned project at ~70% completion, taking 100jt prepayment. Very poor supervision, lots of faults discovered after (e.g. 4 leaks in water supply)']
  },
  {
    phones: ['812-4615-0792'],
    reviews: ['After second payment stopped working, keeping 1B and lying through the process. Very poor quality building, need some parts to be demolished. He spent my money on other projects. Claims to be an architect but far from it.']
  },
  {
    phones: ['882-9144-1584'],
    reviews: ['Totally unreliable, work is super cheap and looks cheap, super arrogant, delayed by weeks, asks for more and more payments, threatened me in the end, left his trash in front of the house, workers often not present or not working at all on site, bad communication, left site when it was 90% finished and still demanded full payment.']
  },
  {
    phones: ['818-531-436', '818-5314-36'],
    reviews: ['Construction company with very high prices claiming quality, but builds by mixing standard materials with very low-quality ones. Poor finishes, refuses to take responsibility for fixing things. Mafia-like attitude when held accountable. Will do anything to blame you for construction defects. Zero professionalism.']
  },
  {
    phones: ['812-9405-0874'],
    reviews: ['After making many mistakes in different projects, they disappear and don\'t help to fix them. All the investment in the wrong construction becomes your responsibility - they will not help you.']
  },
  {
    phones: ['812-3812-640'],
    reviews: ['PT Dipa Pusaka & Dejuma Studio operate together as family. Bayu\'s father is Mantra\'s brother. Bayu acts like the "sales person" with zero knowledge.']
  },
  {
    phones: ['817-555-837', '817-5558-37'],
    reviews: ['Reckless and dangerous, scammed plenty of developers. They offer below-market contracts as bait, then cut corners on foundations and structure until they make profit, then disappear. In my project they stopped ordering materials and paying workers, so I had to step in from 50% progress. The whole family operates this scam.']
  },
  {
    phones: ['812-3953-0888'],
    reviews: ['Fully paid but didn\'t finish. Many delays, chose materials without permission, manipulations and threats. Takes money to gamble.']
  },
];

async function addReviews() {
  console.log('Step 1: Making user_id nullable...\n');

  // First, alter the table to make user_id nullable
  const { error: alterError } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE reviews ALTER COLUMN user_id DROP NOT NULL;'
  });

  if (alterError) {
    console.log('Note: Could not alter table (might already be nullable or need direct DB access)');
    console.log('Trying to add reviews anyway...\n');
  } else {
    console.log('Successfully made user_id nullable\n');
  }

  console.log('Step 2: Adding reviews to blacklisted builders...\n');

  // Get all blacklisted builders
  const { data: builders, error } = await supabase
    .from('builders')
    .select('id, name, phone')
    .eq('status', 'blacklisted');

  if (error) {
    console.error('Error fetching builders:', error);
    return;
  }

  console.log(`Found ${builders?.length} blacklisted builders\n`);

  let reviewsAdded = 0;
  let reviewsSkipped = 0;

  for (const reviewEntry of reviewData) {
    if (reviewEntry.reviews.length === 0) continue;

    // Find matching builder by phone
    for (const phone of reviewEntry.phones) {
      const normalizedSearch = normalizePhone(phone);
      if (normalizedSearch.length < 8) continue;

      const matchingBuilder = builders?.find(b => {
        const normalizedBuilderPhone = normalizePhone(b.phone || '');
        // Check if the search digits are contained in the builder phone
        return normalizedBuilderPhone.includes(normalizedSearch) ||
               normalizedSearch.includes(normalizedBuilderPhone.slice(-10));
      });

      if (matchingBuilder) {
        for (const reviewText of reviewEntry.reviews) {
          // Check if review already exists
          const { data: existingReviews } = await supabase
            .from('reviews')
            .select('id')
            .eq('builder_id', matchingBuilder.id)
            .eq('review_text', reviewText);

          if (existingReviews && existingReviews.length > 0) {
            console.log(`⏭️  ${matchingBuilder.name}: Review already exists`);
            reviewsSkipped++;
            continue;
          }

          // Add review
          const { error: reviewError } = await supabase
            .from('reviews')
            .insert({
              builder_id: matchingBuilder.id,
              user_id: null,
              rating: 1,
              review_text: reviewText,
              status: 'approved',
              photos: [],
            });

          if (reviewError) {
            console.error(`❌ ${matchingBuilder.name}: ${reviewError.message}`);
          } else {
            console.log(`✅ ${matchingBuilder.name}: Added review`);
            reviewsAdded++;
          }
        }

        break; // Found match, move to next review entry
      }
    }
  }

  console.log('\n========== SUMMARY ==========');
  console.log(`Reviews added: ${reviewsAdded}`);
  console.log(`Reviews skipped (already exist): ${reviewsSkipped}`);
}

addReviews().catch(console.error);
