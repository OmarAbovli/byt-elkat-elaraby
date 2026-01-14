-- Fix the permissive RLS policy for payments INSERT
DROP POLICY IF EXISTS "System can insert payments" ON public.payments;

-- Only allow authenticated users to insert their own payments
CREATE POLICY "Users can insert own payments" ON public.payments 
FOR INSERT WITH CHECK (auth.uid() = user_id);