-- Migration: Token Strategy and Platform Linking State
-- Adds support for managed vs manual tokens and linking state tracking

-- Step 1: Add new columns to user_auth
ALTER TABLE user_auth 
  ADD COLUMN auth_source TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN scope_granted TEXT[] DEFAULT '{}',
  ADD COLUMN is_linked BOOLEAN NOT NULL DEFAULT true;

-- Step 2: Add comments explaining the columns
COMMENT ON COLUMN user_auth.auth_source IS 
  'Token source: manual (tokens stored here, we manage refresh), managed (tokens from Supabase session, NULL in access_token)';

COMMENT ON COLUMN user_auth.scope_granted IS 
  'Array of OAuth scopes granted by user for this platform link';

COMMENT ON COLUMN user_auth.is_linked IS 
  'true: full platform features enabled, false: auth only (no platform features)';

-- Step 3: Create index for common queries
CREATE INDEX idx_user_auth_source_linked 
  ON user_auth(user_id, platform, auth_source, is_linked);

-- Step 4: Update existing records
-- All existing records are manual linked tokens
UPDATE user_auth 
SET 
  auth_source = 'manual',
  is_linked = true;

-- Step 5: Make access_token nullable for managed sources
-- We need to handle existing data first
ALTER TABLE user_auth 
  ALTER COLUMN access_token DROP NOT NULL;

-- Add check constraint: managed tokens should be NULL
-- Note: We can't easily enforce this at DB level without a trigger,
-- so we'll enforce it in application code

-- Step 6: Verify migration
SELECT 
  'Migration complete. user_auth now has:' as message,
  COUNT(*) as total_records,
  COUNT(CASE WHEN auth_source = 'manual' THEN 1 END) as manual_records,
  COUNT(CASE WHEN auth_source = 'managed' THEN 1 END) as managed_records
FROM user_auth;
