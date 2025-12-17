import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Format phone number with dashes: +62 812-3456-7890
function formatPhone(phone: string | null): string | null {
  if (!phone) return phone;

  // Remove all non-digits except leading +
  let digits = phone.replace(/[^\d+]/g, '');

  // Ensure starts with +62
  if (digits.startsWith('62')) digits = '+' + digits;
  if (!digits.startsWith('+62')) return phone;

  // Get the number part after +62
  const numberPart = digits.substring(3);

  // Format based on length: +62 xxx-xxxx-xxxx
  if (numberPart.length >= 10) {
    return '+62 ' + numberPart.substring(0, 3) + '-' + numberPart.substring(3, 7) + '-' + numberPart.substring(7);
  } else if (numberPart.length >= 7) {
    return '+62 ' + numberPart.substring(0, 3) + '-' + numberPart.substring(3, 7) + '-' + numberPart.substring(7);
  }

  return phone;
}

async function updatePhoneFormats() {
  // First, delete any remaining invalid phone entries
  const { data: invalid } = await supabase
    .from('builders')
    .select('id, name')
    .like('phone', '%000-0000%');

  if (invalid && invalid.length > 0) {
    console.log('Deleting invalid entries:', invalid.map(b => b.name).join(', '));
    await supabase
      .from('builders')
      .delete()
      .like('phone', '%000-0000%');
  }

  // Get all builders
  const { data: builders, error } = await supabase
    .from('builders')
    .select('id, name, phone, phones');

  if (error) {
    console.log('Error:', error.message);
    return;
  }

  console.log('Checking', builders?.length, 'builders for phone format updates...\n');

  let updated = 0;
  for (const builder of builders || []) {
    const newPhone = formatPhone(builder.phone);

    // Also update phones array if exists
    let newPhones = builder.phones;
    if (Array.isArray(builder.phones)) {
      newPhones = builder.phones.map((p: { number: string; label: string }) => ({
        ...p,
        number: formatPhone(p.number) || p.number
      }));
    }

    const phoneChanged = newPhone !== builder.phone;
    const phonesChanged = JSON.stringify(newPhones) !== JSON.stringify(builder.phones);

    if (phoneChanged || phonesChanged) {
      const { error: updateError } = await supabase
        .from('builders')
        .update({ phone: newPhone, phones: newPhones })
        .eq('id', builder.id);

      if (updateError) {
        console.log('Error updating', builder.name, ':', updateError.message);
      } else {
        console.log('Updated:', builder.name);
        console.log('  Before:', builder.phone);
        console.log('  After: ', newPhone);
        updated++;
      }
    }
  }

  console.log('\n========== SUMMARY ==========');
  console.log('Total builders:', builders?.length);
  console.log('Updated:', updated);
}

updatePhoneFormats();
