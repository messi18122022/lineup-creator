-- Add teams and lineups columns to user_data
ALTER TABLE public.user_data
  ADD COLUMN IF NOT EXISTS teams jsonb NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS lineups jsonb NOT NULL DEFAULT '[]';
