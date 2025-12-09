-- Update signup to give 50 free credits (Early Promotion)
-- Run this in your Supabase SQL Editor

-- Update the handle_new_user function to give 50 credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credit_balance)
  VALUES (new.id, new.email, 50);  -- $50 worth of free credits (Early Promotion)

  -- Record the welcome bonus transaction
  INSERT INTO public.transactions (user_id, type, amount, payment_reference)
  VALUES (new.id, 'credit_purchase', 50, 'early_promotion_bonus');

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing users with 0 credits to have 30 (optional, for testing)
-- UPDATE public.profiles SET credit_balance = 30 WHERE credit_balance = 0;
