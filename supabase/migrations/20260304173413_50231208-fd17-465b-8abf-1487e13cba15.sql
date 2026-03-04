
-- Allow null user_id for system/seed presets
ALTER TABLE public.presets ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS to handle null user_id for public presets
-- The existing "Public presets are viewable by everyone" policy already handles this
