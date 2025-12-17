-- Make user_id nullable in reviews table to allow imported reviews
ALTER TABLE reviews ALTER COLUMN user_id DROP NOT NULL;
