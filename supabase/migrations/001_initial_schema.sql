-- Initial schema for StreamFlow
-- Platform authentication and user info tables

-- User Auth: Platform OAuth tokens (for API access)
CREATE TABLE user_auth (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL,
    platform_user_id TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_in INTEGER,
    expires_at INTEGER,
    scope TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- User Info: Platform user metadata (from Helix API)
CREATE TABLE user_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL,
    platform_user_id TEXT,
    login TEXT,
    display_name TEXT,
    profile_image_url TEXT,
    broadcaster_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE user_auth ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can access own user_auth" ON user_auth
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own user_info" ON user_info
    FOR ALL USING (auth.uid() = user_id);