-- Add 'Bali Wide' to the builder_location enum
-- Note: trade_type is TEXT so doesn't need enum update
ALTER TYPE builder_location ADD VALUE IF NOT EXISTS 'Bali Wide';
