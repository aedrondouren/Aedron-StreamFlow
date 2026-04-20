#!/usr/bin/env node
/**
 * Platform Data Spoofing Script
 *
 * Inserts minimal mock platform data for visual testing.
 * Creates fake Twitch connection for the test user.
 * Data is non-functional (invalid tokens) - for visual testing only.
 */

import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync } from 'fs';
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
	console.log('🎭 Spoofing platform data for visual testing...\n');

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

	// Check if Twitch data already exists
	console.log('🔍 Checking existing platform data...');
	const { data: existingAuth } = await supabase
		.from('user_auth')
		.select('id')
		.eq('user_id', testUserId)
		.eq('platform', 'twitch')
		.single();

	if (existingAuth) {
		console.log('✅ Twitch platform data already exists. Skipping.');
	} else {
		// Insert mock Twitch auth data
		console.log('📝 Creating mock Twitch connection...');
		const { error: authError } = await supabase.from('user_auth').insert({
			user_id: testUserId,
			platform: 'twitch',
			platform_user_id: '123456789',
			access_token: 'spoof_token_invalid_for_visual_testing_only',
			refresh_token: 'spoof_refresh_invalid_for_visual_testing_only',
			expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now (Unix timestamp)
			scope: 'channel:read:subscriptions user:read:email'
		});

		if (authError) {
			console.error('❌ Failed to create Twitch auth data:', authError.message);
			process.exit(1);
		}
		console.log('   ✓ Created user_auth entry');
	}

	// Check if user_info already exists
	const { data: existingInfo } = await supabase
		.from('user_info')
		.select('id')
		.eq('user_id', testUserId)
		.eq('platform', 'twitch')
		.single();

	if (existingInfo) {
		console.log('✅ Twitch user info already exists. Skipping.');
	} else {
		// Insert mock user_info data
		console.log('📝 Creating mock Twitch user info...');
		const { error: infoError } = await supabase.from('user_info').insert({
			user_id: testUserId,
			platform: 'twitch',
			platform_user_id: '123456789',
			login: 'testuser',
			display_name: 'TestUser',
			profile_image_url: 'https://placehold.co/100x100/9146FF/FFFFFF?text=TU',
			broadcaster_type: 'affiliate'
		});

		if (infoError) {
			console.error('❌ Failed to create Twitch user info:', infoError.message);
			process.exit(1);
		}
		console.log('   ✓ Created user_info entry');
	}

	console.log('\n✅ Platform spoofing complete!');
	console.log('   Mock Twitch account: @TestUser');
	console.log('   Note: These are fake credentials for visual testing only.');
	console.log('   Platform features will not function with spoofed data.');
}

main().catch((err) => {
	console.error('❌ Unexpected error:', err.message);
	process.exit(1);
});
