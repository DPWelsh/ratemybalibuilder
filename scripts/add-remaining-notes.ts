import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Additional notes to add by name match
const additionalNotes: { namePart: string; notes: string }[] = [
  {
    namePart: 'Wanda Murti',
    notes: 'Construction company with very high prices claiming quality, but builds by mixing standard materials with very low-quality ones. Poor finishes, refuses to take responsibility for fixing things. Mafia-like attitude when held accountable. Will do anything to blame you for construction defects. Zero professionalism.'
  },
  {
    namePart: 'Bara',
    notes: 'Reckless and dangerous, scammed plenty of developers. They offer below-market contracts as bait, then cut corners on foundations and structure until they make profit, then disappear. Part of the PT Dipa Pusaka family scam operation.'
  },
];

async function updateNotes() {
  console.log('Updating remaining notes...\n');

  for (const entry of additionalNotes) {
    const { data: builder, error } = await supabase
      .from('builders')
      .select('id, name, notes')
      .ilike('name', `%${entry.namePart}%`)
      .eq('status', 'blacklisted')
      .single();

    if (error || !builder) {
      console.log(`Not found: ${entry.namePart}`);
      continue;
    }

    if (builder.notes === entry.notes) {
      console.log(`${builder.name}: Notes already up to date`);
      continue;
    }

    const { error: updateError } = await supabase
      .from('builders')
      .update({ notes: entry.notes })
      .eq('id', builder.id);

    if (updateError) {
      console.error(`Error updating ${builder.name}: ${updateError.message}`);
    } else {
      console.log(`Updated: ${builder.name}`);
      console.log(`  Notes: "${entry.notes.substring(0, 80)}..."`);
    }
  }
}

updateNotes().catch(console.error);
