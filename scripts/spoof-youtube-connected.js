#!/usr/bin/env node
/**
 * YouTube Connected State Spoofing Script
 *
 * Creates a connected YouTube platform entry for multi-platform testing.
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
	console.log('🎭 Setting up YouTube connected state for visual testing...\n');

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
	const platform = 'youtube';

	// Check if YouTube data already exists
	console.log('🔍 Checking existing YouTube data...');
	const { data: existingAuth } = await supabase
		.from('user_auth')
		.select('id')
		.eq('user_id', testUserId)
		.eq('platform', platform)
		.single();

	if (existingAuth) {
		console.log('✅ YouTube platform data already exists. Skipping.');
	} else {
		// Insert mock YouTube auth data
		console.log('📝 Creating mock YouTube connection...');
		const { error: authError } = await supabase.from('user_auth').insert({
			user_id: testUserId,
			platform: platform,
			platform_user_id: 'UC1234567890abcdef',
			access_token: 'spoof_youtube_token_invalid',
			refresh_token: 'spoof_youtube_refresh_invalid',
			expires_at: Math.floor(Date.now() / 1000) + 3600,
			scope:
				'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile',
			auth_source: 'managed',
			is_linked: true
		});

		if (authError) {
			console.error('❌ Failed to create YouTube auth data:', authError.message);
			process.exit(1);
		}
		console.log('   ✓ Created user_auth entry');
	}

	// Check if user_info already exists
	const { data: existingInfo } = await supabase
		.from('user_info')
		.select('id')
		.eq('user_id', testUserId)
		.eq('platform', platform)
		.single();

	if (existingInfo) {
		console.log('✅ YouTube user info already exists. Skipping.');
	} else {
		// Insert mock user_info data
		console.log('📝 Creating mock YouTube user info...');
		const { error: infoError } = await supabase.from('user_info').insert({
			user_id: testUserId,
			platform: platform,
			platform_user_id: 'UC1234567890abcdef',
			login: 'testchannel',
			display_name: 'Test Channel',
			profile_image_url: 'https://placehold.co/100x100/FF0000/FFFFFF?text=YT',
			broadcaster_type: ''
		});

		if (infoError) {
			console.error('❌ Failed to create YouTube user info:', infoError.message);
			process.exit(1);
		}
		console.log('   ✓ Created user_info entry');
	}

	console.log('\n✅ YouTube spoofing complete!');
	console.log('   Mock YouTube account: @Test Channel');
	console.log('   Note: These are fake credentials for visual testing only.');
}

main().catch((err) => {
	console.error('❌ Unexpected error:', err.message);
	process.exit(1);
});
