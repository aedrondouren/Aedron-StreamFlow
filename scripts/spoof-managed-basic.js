#!/usr/bin/env node
/**
 * Managed Basic State Spoofing Script
 *
 * Creates a user in managed_basic state for testing the OAuth prompt upgrade flow.
 * This state occurs when user signs up via OAuth but doesn't complete full linking.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ENV_PATH = resolve(__dirname, '..', '.env');

// Read .env file
function readEnv() {
	if (!existsSync(ENV_PATH)) {
		throw new Error('.env file not found.');
	}
	return readFileSync(ENV_PATH, 'utf-8');
}

// Parse env vars from content
function parseEnv(envContent) {
	const vars = {};
	for (const line of envContent.split('\n')) {
		if (line.includes('=') && !line.startsWith('#')) {
			const [key, ...valueParts] = line.split('=');
			vars[key.trim()] = valueParts.join('=').trim();
		}
	}
	return vars;
}

async function main() {
	console.log('🎭 Setting up managed_basic state for visual testing...\n');

	// Read .env
	const envContent = readEnv();
	const envVars = parseEnv(envContent);

	// Validate required env vars
	if (!envVars.TEST_USER_ID) {
		console.error('❌ Test user not found. Please run "pnpm test:user:setup" first.');
		process.exit(1);
	}

	if (!envVars.PUBLIC_SUPABASE_URL || !envVars.PRIVATE_SUPABASE_SERVICE_ROLE_KEY) {
		console.error('❌ Missing required environment variables.');
		process.exit(1);
	}

	// Initialize Supabase client with service role key
	const supabase = createClient(
		envVars.PUBLIC_SUPABASE_URL,
		envVars.PRIVATE_SUPABASE_SERVICE_ROLE_KEY,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		}
	);

	const testUserId = envVars.TEST_USER_ID;
	const platform = 'twitch';

	// First, remove any existing Twitch data to ensure clean state
	console.log('🧹 Cleaning existing Twitch data...');
	await supabase.from('user_info').delete().eq('user_id', testUserId).eq('platform', platform);
	await supabase.from('user_auth').delete().eq('user_id', testUserId).eq('platform', platform);

	// Insert managed_basic state (auth_source='managed', is_linked=false)
	console.log('📝 Creating managed_basic state...');
	const { error: authError } = await supabase.from('user_auth').insert({
		user_id: testUserId,
		platform: platform,
		platform_user_id: '123456789',
		access_token: 'spoof_basic_token_invalid',
		refresh_token: 'spoof_basic_refresh_invalid',
		expires_at: Math.floor(Date.now() / 1000) + 3600,
		scope: 'user:read:email', // Minimal scope (basic auth only)
		auth_source: 'managed',
		is_linked: false // This creates the managed_basic state
	});

	if (authError) {
		console.error('❌ Failed to create managed_basic state:', authError.message);
		process.exit(1);
	}
	console.log('   ✓ Created user_auth entry (managed_basic)');

	// No user_info for managed_basic - user hasn't completed linking
	console.log('   ✓ No user_info (as expected for managed_basic)');

	console.log('\n✅ Managed basic state created!');
	console.log('   Platform: Twitch');
	console.log('   State: managed_basic (OAuth signup, not fully linked)');
	console.log('   This will trigger the "Complete Setup" flow in the UI.');
}

main().catch((err) => {
	console.error('❌ Unexpected error:', err.message);
	process.exit(1);
});
