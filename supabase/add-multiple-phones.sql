-- Add support for multiple phone numbers per builder
-- Run this in your Supabase SQL Editor

-- Add phones column as JSONB array (keeps original phone for backwards compatibility)
ALTER TABLE public.builders
ADD COLUMN IF NOT EXISTS phones JSONB DEFAULT '[]'::jsonb;

-- Migrate existing phone data to phones array
UPDATE public.builders
SET phones = jsonb_build_array(
  jsonb_build_object(
    'number', phone,
    'type', 'primary',
    'label', 'Main'
  )
)
WHERE phone IS NOT NULL AND phone != '' AND (phones IS NULL OR phones = '[]'::jsonb);

-- Create index for searching phones
CREATE INDEX IF NOT EXISTS idx_builders_phones ON public.builders USING GIN (phones);

-- Function to search by any phone number in the array
CREATE OR REPLACE FUNCTION search_builders_by_phone(search_phone TEXT)
RETURNS SETOF public.builders AS $$
BEGIN
  -- Normalize the search phone (remove spaces, dashes)
  search_phone := regexp_replace(search_phone, '[\s\-\(\)]', '', 'g');

  -- Search in both primary phone column and phones array
  RETURN QUERY
  SELECT * FROM public.builders
  WHERE
    regexp_replace(phone, '[\s\-\(\)]', '', 'g') LIKE '%' || search_phone || '%'
    OR EXISTS (
      SELECT 1 FROM jsonb_array_elements(phones) AS p
      WHERE regexp_replace(p->>'number', '[\s\-\(\)]', '', 'g') LIKE '%' || search_phone || '%'
    );
END;
$$ LANGUAGE plpgsql;

-- Example: Add alternative numbers to a builder
-- UPDATE public.builders
-- SET phones = phones || jsonb_build_array(
--   jsonb_build_object('number', '+62 812 xxx xxxx', 'type', 'whatsapp', 'label', 'WhatsApp')
-- )
-- WHERE name = 'Some Builder';

-- Verify migration
SELECT name, phone, phones FROM public.builders LIMIT 5;
