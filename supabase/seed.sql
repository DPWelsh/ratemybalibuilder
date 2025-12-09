-- RateMyBaliBuilder Seed Data
-- Run this in your Supabase SQL Editor after schema.sql

-- ============================================
-- BUILDERS - Mix of statuses, locations, and trades
-- ============================================

INSERT INTO public.builders (id, name, phone, aliases, status, company_name, instagram, location, trade_type, project_types, notes) VALUES
-- RECOMMENDED builders
('11111111-1111-1111-1111-111111111111', 'Made Wijaya', '+62 812-3456-7890', ARRAY['Pak Made', 'Made W'], 'recommended', 'Wijaya Construction Bali', '@wijaya_builds', 'Canggu', 'General Contractor', ARRAY['Villas', 'Renovations', 'Pools']::project_type[], 'Excellent track record, specializes in traditional Balinese architecture'),
('22222222-2222-2222-2222-222222222222', 'Ketut Suardana', '+62 813-5555-1234', ARRAY['Pak Ketut', 'Ketut S'], 'recommended', 'Suardana Brothers', '@suardana_construction', 'Canggu', 'General Contractor', ARRAY['Villas', 'Commercial']::project_type[], 'Family business, 20+ years experience in Canggu area'),
('33333333-3333-3333-3333-333333333333', 'Wayan Artawan', '+62 878-6543-2100', ARRAY['Wayan A', 'Pak Wayan'], 'recommended', 'Artawan Villa Builders', '@artawan_villas', 'Uluwatu', 'General Contractor', ARRAY['Villas']::project_type[], 'Premium villa specialist, works with architects'),
('44444444-4444-4444-4444-444444444444', 'Nyoman Dharma', '+62 811-3888-5555', ARRAY['Dharma Builder'], 'recommended', 'Dharma Property Solutions', '@dharma_bali', 'Sanur', 'General Contractor', ARRAY['Villas', 'Renovations']::project_type[], 'Known for on-time delivery and transparent pricing'),
('55555555-5555-5555-5555-555555555555', 'Komang Suwitra', '+62 819-7777-3333', ARRAY['Pak Komang'], 'recommended', 'Suwitra Design Build', '@suwitra_db', 'Seminyak', 'Renovation Specialist', ARRAY['Renovations', 'Interior Fit-out']::project_type[], 'Modern minimalist specialist'),

-- UNKNOWN builders
('66666666-6666-6666-6666-666666666666', 'Putu Gede Mahendra', '+62 812-9999-4444', ARRAY['Putu Gede', 'Mahendra'], 'unknown', 'Mahendra Konstruksi', '@mahendra_build', 'Denpasar', 'General Contractor', ARRAY['Villas', 'Renovations']::project_type[], 'New to the market, limited reviews'),
('77777777-7777-7777-7777-777777777777', 'I Gusti Bagus Rai', '+62 857-3333-8888', ARRAY['Gusti Rai', 'Bagus'], 'unknown', NULL, NULL, 'Ubud', 'Landscaper', ARRAY['Landscaping', 'Pools']::project_type[], 'Works independently, mostly word of mouth'),
('88888888-8888-8888-8888-888888888888', 'Kadek Surya', '+62 821-4444-7777', ARRAY['Kadek S'], 'unknown', 'Surya Bali Projects', '@suryabaliprojects', 'Ubud', 'General Contractor', ARRAY['Villas', 'Renovations']::project_type[], 'Mid-range villa projects in Ubud'),
('99999999-9999-9999-9999-999999999999', 'Made Arta Wiguna', '+62 815-2222-6666', ARRAY['Arta', 'Pak Arta'], 'unknown', NULL, '@artawiguna', 'Seminyak', 'Renovation Specialist', ARRAY['Renovations']::project_type[], 'Renovation specialist'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Wayan Sudiarsa', '+62 878-1111-5555', ARRAY['Sudiarsa'], 'unknown', 'Sudiarsa Contractors', NULL, 'Denpasar', 'General Contractor', ARRAY['Commercial', 'Villas']::project_type[], 'Commercial and residential'),

-- BLACKLISTED builders
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'John Smith Bali', '+62 812-0000-1111', ARRAY['Johnny', 'JS Bali'], 'blacklisted', 'JS Bali Construction', '@jsbali', 'Sanur', 'General Contractor', ARRAY['Villas', 'Renovations', 'Commercial']::project_type[], 'Multiple complaints about abandoned projects'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Budi Santoso', '+62 813-0000-2222', ARRAY['Pak Budi', 'Budi S'], 'blacklisted', 'Santoso Build', NULL, 'Canggu', 'General Contractor', ARRAY['Villas', 'Renovations']::project_type[], 'Poor quality materials, cost overruns'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Eko Prasetyo', '+62 857-0000-3333', ARRAY['Eko P'], 'blacklisted', NULL, '@eko_builds', 'Tabanan', 'Pool Builder', ARRAY['Pools', 'Renovations']::project_type[], 'Failed to complete multiple projects'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Dream Villa Builders', '+62 821-0000-4444', ARRAY['DVB', 'Dream Villas'], 'blacklisted', 'Dream Villa Builders Ltd', '@dreamvillabali', 'Uluwatu', 'General Contractor', ARRAY['Villas']::project_type[], 'Company dissolved, owner fled'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Ahmad Fauzi', '+62 819-0000-5555', ARRAY['Ahmad F', 'Fauzi'], 'blacklisted', 'Fauzi Construction', NULL, 'Denpasar', 'General Contractor', ARRAY['Villas', 'Commercial']::project_type[], 'Unlicensed work, safety violations')

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  aliases = EXCLUDED.aliases,
  status = EXCLUDED.status,
  company_name = EXCLUDED.company_name,
  instagram = EXCLUDED.instagram,
  location = EXCLUDED.location,
  trade_type = EXCLUDED.trade_type,
  project_types = EXCLUDED.project_types,
  notes = EXCLUDED.notes,
  updated_at = NOW();

-- ============================================
-- Summary: 15 builders (5 recommended, 5 unknown, 5 blacklisted)
-- Reviews will be added by real users through the app
-- ============================================
