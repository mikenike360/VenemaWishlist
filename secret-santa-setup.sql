-- Secret Santa Pairs Table Setup
-- Run this in Supabase SQL Editor to fix permission errors

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS secret_santa_pairs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  giver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(giver_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_secret_santa_giver ON secret_santa_pairs(giver_id);
CREATE INDEX IF NOT EXISTS idx_secret_santa_receiver ON secret_santa_pairs(receiver_id);

-- Enable RLS
ALTER TABLE secret_santa_pairs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage secret santa pairs" ON secret_santa_pairs;
DROP POLICY IF EXISTS "Users can view their own secret santa pair" ON secret_santa_pairs;
DROP POLICY IF EXISTS "Users can select their own pairs" ON secret_santa_pairs;

-- Policy: Admins can do everything (insert, select, update, delete)
-- This checks if the user is an admin by looking at user_approvals table
CREATE POLICY "Admins can manage secret santa pairs"
ON secret_santa_pairs
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.status = 'approved'
    AND user_approvals.email = 'mikenike360@outlook.com'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_approvals
    WHERE user_approvals.user_id = auth.uid()
    AND user_approvals.status = 'approved'
    AND user_approvals.email = 'mikenike360@outlook.com'
  )
);

-- Policy: Users can view their own secret santa pair (where they are the giver)
-- This allows users to see who they need to buy a gift for
CREATE POLICY "Users can view their own secret santa pair"
ON secret_santa_pairs
FOR SELECT
USING (
  giver_id IN (
    SELECT id FROM profiles WHERE claimed_by = auth.uid()
  )
);

-- Note: The foreign key references to profiles(id) should work fine
-- The profiles table should already have proper RLS policies that allow reading
-- If you still get "permission denied on table users" errors, it might be because
-- the profiles.claimed_by field references auth.users. In that case, ensure your
-- profiles table RLS policies allow reading profiles for authenticated users.

