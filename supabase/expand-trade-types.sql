-- Expand trade_type to include more trades
-- Run this in Supabase SQL Editor

-- Step 1: Remove the default value constraint
ALTER TABLE public.builders
ALTER COLUMN trade_type DROP DEFAULT;

-- Step 2: Convert trade_type column from enum to text
ALTER TABLE public.builders
ALTER COLUMN trade_type TYPE text;

-- Step 3: Add back the default as text
ALTER TABLE public.builders
ALTER COLUMN trade_type SET DEFAULT 'General Contractor';

-- Step 4: Drop the old enum type
DROP TYPE IF EXISTS trade_type;

-- Step 5: Verify it worked
SELECT DISTINCT trade_type FROM public.builders;
