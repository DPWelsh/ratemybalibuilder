-- Run this FIRST to add the new columns to your existing builders table

-- Create the new enum types (if they don't exist)
DO $$ BEGIN
  CREATE TYPE builder_location AS ENUM ('Canggu', 'Seminyak', 'Ubud', 'Uluwatu', 'Sanur', 'Denpasar', 'Tabanan', 'Other');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE trade_type AS ENUM ('General Contractor', 'Pool Builder', 'Architect', 'Interior Designer', 'Landscaper', 'Renovation Specialist');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE project_type AS ENUM ('Villas', 'Renovations', 'Pools', 'Commercial', 'Landscaping', 'Interior Fit-out');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add the new columns to builders table
ALTER TABLE public.builders
  ADD COLUMN IF NOT EXISTS location builder_location DEFAULT 'Other',
  ADD COLUMN IF NOT EXISTS trade_type trade_type DEFAULT 'General Contractor',
  ADD COLUMN IF NOT EXISTS project_types project_type[] DEFAULT '{}';

-- Now run seed.sql after this completes successfully
