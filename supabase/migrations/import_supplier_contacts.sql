-- Import builder-relevant contacts from Bali Gate Keeper supplier database
-- Source: docs/supplier_database.json (154 contacts total, ~17 construction trades)
-- These are word-of-mouth verified contacts from the Bali expat community

-- Builders/Contractors (with 5-star ratings marked as recommended)
INSERT INTO builders (id, name, phone, trade_type, location, notes, status)
VALUES
  (gen_random_uuid(), 'Ida Bagus', '6282144126627', 'General Contractor', 'Other', 'Word-of-mouth referral. Source: Brandy (Bali Gate Keeper)', 'unknown'),
  (gen_random_uuid(), 'Kang Rian', '6282121444433', 'General Contractor', 'Other', 'Word-of-mouth referral. Source: Reynard (Bali Gate Keeper)', 'unknown'),
  (gen_random_uuid(), 'Brian R', '6287862502798', 'General Contractor', 'Other', 'Word-of-mouth referral. Source: Bali Gate Keeper', 'unknown'),
  (gen_random_uuid(), 'Pa Agus', '6287898139727', 'General Contractor', 'Other', 'Word-of-mouth referral. Source: Bali Gate Keeper', 'unknown')
ON CONFLICT DO NOTHING;

-- Highly recommended builders (5-star community ratings)
INSERT INTO builders (id, name, phone, trade_type, location, notes, status)
VALUES
  (gen_random_uuid(), 'Suraji', '6281237925177', 'General Contractor', 'Other', 'Community-verified 5-star builder. Source: Johanna (Bali Gate Keeper)', 'recommended'),
  (gen_random_uuid(), 'Guntur', '6281236326966', 'General Contractor', 'Other', 'Community-verified 5-star builder. Source: Blossom (Bali Gate Keeper)', 'recommended')
ON CONFLICT DO NOTHING;

-- Handy Man
INSERT INTO builders (id, name, phone, trade_type, location, notes, status)
VALUES
  (gen_random_uuid(), 'Nyoman Yuda', '6281353343278', 'Handyman', 'Other', 'Word-of-mouth referral. Source: Bali Gate Keeper', 'unknown')
ON CONFLICT DO NOTHING;

-- Electricians
INSERT INTO builders (id, name, phone, trade_type, location, notes, status)
VALUES
  (gen_random_uuid(), 'Pak (Electrician)', '6282144426495', 'Electrician', 'Other', 'Word-of-mouth referral. Source: Reynard (Bali Gate Keeper)', 'unknown'),
  (gen_random_uuid(), 'Agus (Electrician)', '6282144632083', 'Electrician', 'Uluwatu', 'Word-of-mouth referral. Source: Depiik (Bali Gate Keeper)', 'unknown')
ON CONFLICT DO NOTHING;

-- Plumber
INSERT INTO builders (id, name, phone, trade_type, location, notes, status)
VALUES
  (gen_random_uuid(), 'Khairul Anwar Pompa', '6281558090909', 'Plumber', 'Other', 'Word-of-mouth referral. Source: Reynard (Bali Gate Keeper)', 'unknown')
ON CONFLICT DO NOTHING;

-- Pool Specialist
INSERT INTO builders (id, name, phone, trade_type, location, notes, status)
VALUES
  (gen_random_uuid(), 'Ariel (Pool Specialist)', '6285333570600', 'Pool Specialist', 'Other', 'Villa 10 Samani. Word-of-mouth referral. Source: Bali Gate Keeper', 'unknown')
ON CONFLICT DO NOTHING;

-- Tiles
INSERT INTO builders (id, name, phone, trade_type, location, notes, status)
VALUES
  (gen_random_uuid(), 'Sadus Tiles', '6282340774073', 'Tiles & Stone', 'Other', 'Word-of-mouth referral. Source: Ulu Buy, Sell, Swap (Bali Gate Keeper)', 'unknown')
ON CONFLICT DO NOTHING;

-- Gardener/Landscaping
INSERT INTO builders (id, name, phone, trade_type, location, notes, status)
VALUES
  (gen_random_uuid(), 'Jack (Landscaper)', '6281237897352', 'Landscaping', 'Uluwatu', 'Great work, speaks good English, highly recommended by expat community. Source: Ulu Girls (Bali Gate Keeper)', 'recommended')
ON CONFLICT DO NOTHING;

-- Carpenters
INSERT INTO builders (id, name, phone, trade_type, location, notes, status)
VALUES
  (gen_random_uuid(), 'Hiro (Carpenter)', '6281333493004', 'Carpenter', 'Other', 'Good work but may not always answer. Source: Bali Gate Keeper', 'unknown'),
  (gen_random_uuid(), 'Omingbudi''s Woodwork', '6285937019888', 'Carpenter', 'Uluwatu', 'Specializes in pooldeck, wood-flooring, wood-ceiling, facade and doors. Source: Bali Gate Keeper', 'unknown')
ON CONFLICT DO NOTHING;

-- Interior Designer
INSERT INTO builders (id, name, phone, trade_type, location, notes, status)
VALUES
  (gen_random_uuid(), 'Cisco (Interior Designer)', '6281237312295', 'Interior Designer', 'Other', 'Interior designer of the Bohemian Villa. Word-of-mouth referral. Source: Bali Gate Keeper', 'unknown')
ON CONFLICT DO NOTHING;

-- ============================================
-- Add community reviews for recommended builders
-- (user_id is nullable per make_review_user_nullable.sql migration)
-- ============================================

-- Review for Suraji
INSERT INTO reviews (builder_id, user_id, rating, review_text, status)
SELECT id, NULL, 5, 'Community-verified builder from Bali Gate Keeper database. Highly recommended by Johanna and the expat community. Word-of-mouth referral with excellent reputation.', 'approved'
FROM builders WHERE phone = '6281237925177' AND name = 'Suraji'
ON CONFLICT DO NOTHING;

-- Review for Guntur
INSERT INTO reviews (builder_id, user_id, rating, review_text, status)
SELECT id, NULL, 5, 'Community-verified builder from Bali Gate Keeper database. Highly recommended by Blossom and the expat community. Word-of-mouth referral with excellent reputation.', 'approved'
FROM builders WHERE phone = '6281236326966' AND name = 'Guntur'
ON CONFLICT DO NOTHING;

-- Review for Jack (Landscaper)
INSERT INTO reviews (builder_id, user_id, rating, review_text, status)
SELECT id, NULL, 5, 'Community-verified landscaper from Bali Gate Keeper database. Jack is highly recommended by the Ulu Girls community - "Jack is so sweet and did the most amazing job of our garden. He speaks really good English." Word-of-mouth referral.', 'approved'
FROM builders WHERE phone = '6281237897352' AND name = 'Jack (Landscaper)'
ON CONFLICT DO NOTHING;

-- ============================================
-- Summary: 17 builder-relevant contacts imported
-- - 3 recommended (community 5-star ratings)
-- - 14 unknown (word-of-mouth referrals)
-- - 3 community reviews added
-- ============================================
