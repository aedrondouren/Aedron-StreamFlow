#!/usr/bin/env node
/**
 * Test User Cleanup Script
 *
 * Removes the test user and all associated platform data from Supabase.
 * Use this to reset the test environment or clean up after visual testing.
 * 
 * WARNING: This is destructive and will remove:
 * - Test user account
 * - All platform auth data (user_auth table)
 * - All platform user info (user_info table)
 * - Test user credentials from .env file
 */

import { createClient } from '@supabase/supabase-js';
import { existsSync, readFileSync, writeFileSync } from 'fs';
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

// Update .env file by removing test user credentials
function removeTestUserFromEnv(envContent) {
	const lines = envContent.split('\n').filter((line) => {
		return !line.startsWith('TEST_USER_EMAIL=') && 
			   !line.startsWith('TEST_USER_PASSWORD=') && 
			   !line.startsWith('TEST_USER_ID=');
	});
	return lines.join('\n');
}

async function main() {
	console.log('🗑️  Cleaning up test user...\n');

	// Read .env
	const envContent = readEnv();
	const envVars = parseEnv(envContent);

	// Check if test user exists
	if (!envVars.TEST_USER_ID) {
		console.log('ℹ️  No test user found in .env file. Nothing to clean up.');
		process.exit(0);
	}

	// Validate required env vars
	if (!envVars.PUBLIC_SUPABASE_URL || !envVars.PRIVATE_SUPABASE_SERVICE_ROLE_KEY) {
		console.error('❌ Missing required environment variables:');
		console.error('   - PUBLIC_SUPABASE_URL');
		console.error('   - PRIVATE_SUPABASE_SERVICE_ROLE_KEY');
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

	console.log(`📋 Test user ID: ${testUserId}`);
	console.log('🗑️  Deleting platform auth data...');

	// Delete platform auth data
	const { error: authError } = await supabase
		.from('user_auth')
		.delete()
		.eq('user_id', testUserId);

	if (authError) {
		console.error('⚠️  Warning: Failed to delete platform auth data:', authError.message);
	} else {
		console.log('   ✓ Deleted user_auth entries');
	}

	console.log('🗑️  Deleting platform user info...');

	// Delete platform user info
	const { error: infoError } = await supabase
		.from('user_info')
		.delete()
		.eq('user_id', testUserId);

	if (infoError) {
		console.error('⚠️  Warning: Failed to delete platform user info:', infoError.message);
	} else {
		console.log('   ✓ Deleted user_info entries');
	}

	console.log('🗑️  Deleting user account...');

	// Delete user via Admin API
	const { error: deleteError } = await supabase.auth.admin.deleteUser(testUserId);

	if (deleteError) {
		console.error('⚠️  Warning: Failed to delete user account:', deleteError.message);
	} else {
		console.log('   ✓ Deleted user account');
	}

	// Remove test user credentials from .env
	console.log('🗑️  Removing credentials from .env...');
	const updatedEnvContent = removeTestUserFromEnv(envContent);
	writeFileSync(ENV_PATH, updatedEnvContent);
	console.log('   ✓ Cleaned .env file');

	console.log('\n✅ Test user cleanup complete!');
	console.log('\n💡 To create a new test user, run: pnpm test:user:setup');
}

main().catch((err) => {
	console.error('❌ Unexpected error:', err.message);
	process.exit(1);
});
