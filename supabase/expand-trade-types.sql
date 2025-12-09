-- Expand trade_type enum to include more trades
-- Run this in your Supabase SQL Editor

-- Add new values to the trade_type enum
ALTER TYPE trade_type ADD VALUE IF NOT EXISTS 'Plumber';
ALTER TYPE trade_type ADD VALUE IF NOT EXISTS 'Electrician';
ALTER TYPE trade_type ADD VALUE IF NOT EXISTS 'Roofer';
ALTER TYPE trade_type ADD VALUE IF NOT EXISTS 'Painter';
ALTER TYPE trade_type ADD VALUE IF NOT EXISTS 'Tiler';
ALTER TYPE trade_type ADD VALUE IF NOT EXISTS 'Carpenter';
ALTER TYPE trade_type ADD VALUE IF NOT EXISTS 'Mason';
ALTER TYPE trade_type ADD VALUE IF NOT EXISTS 'HVAC';
ALTER TYPE trade_type ADD VALUE IF NOT EXISTS 'Welder';
ALTER TYPE trade_type ADD VALUE IF NOT EXISTS 'Glass & Glazing';

-- Verify the enum now includes all values
SELECT enum_range(NULL::trade_type);
