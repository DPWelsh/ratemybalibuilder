-- Add phones JSONB column to builders table for multiple phone numbers
ALTER TABLE public.builders
ADD COLUMN IF NOT EXISTS phones JSONB DEFAULT '[]'::jsonb;

-- Example structure for phones:
-- [
--   {"number": "+62 812 3456 7890", "type": "primary", "label": "Main"},
--   {"number": "+62 813 9876 5432", "type": "whatsapp", "label": "WhatsApp"},
--   {"number": "+62 361 123456", "type": "office", "label": "Office"}
-- ]

COMMENT ON COLUMN public.builders.phones IS 'Array of phone numbers with type and label';
