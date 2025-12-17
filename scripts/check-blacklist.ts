import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  const { data, error } = await supabase
    .from('builders')
    .select('name, phone, company_name')
    .eq('status', 'blacklisted')
    .order('name');

  if (error) {
    console.log('Error:', error.message);
    return;
  }

  console.log('Total blacklisted builders:', data?.length);
  console.log('\n--- Blacklisted Builders ---');
  data?.forEach((b, i) => {
    console.log(`${i+1}. ${b.name} - ${b.company_name || 'N/A'} (${b.phone})`);
  });
}

check();
