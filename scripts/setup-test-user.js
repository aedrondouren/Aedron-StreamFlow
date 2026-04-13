#!/usr/bin/env node
/**
 * Test User Setup Script
 *
 * Creates a test user for automated testing. Idempotent - safe to run multiple times.
 * Credentials are stored in .env file (gitignored) for agent access.
 */

import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ENV_PATH = resolve(__dirname, '..', '.env');

// Generate secure random password
function generatePassword() {
	return randomBytes(8).toString('hex');
}

// Read .env file
function readEnv() {
	if (!existsSync(ENV_PATH)) {
		throw new Error('.env file not found. Please create it from .env.example first.');
	}
	return readFileSync(ENV_PATH, 'utf-8');
}

// Update .env file with test user credentials
function updateEnv(envContent, updates) {
	let lines = envContent.split('\n');

	for (const [key, value] of Object.entries(updates)) {
		const existingIndex = lines.findIndex((line) => line.startsWith(`${key}=`));
		const newLine = `${key}=${value}`;

		if (existingIndex >= 0) {
			lines[existingIndex] = newLine;
		} else {
			lines.push(newLine);
		}
	}

	writeFileSync(ENV_PATH, lines.join('\n'));
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
	console.log('🔧 Setting up test user...\n');

	// Read current .env
	const envContent = readEnv();
	const envVars = parseEnv(envContent);

	// Check if already set up
	if (envVars.TEST_USER_ID) {
		console.log('✅ Test user already exists:');
		console.log(`   Email: ${envVars.TEST_USER_EMAIL || 'test@email.test'}`);
		console.log(`   User ID: ${envVars.TEST_USER_ID}`);
		console.log('\nSkipping creation (idempotent).');
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

	const email = 'test@email.test';
	const password = generatePassword();

	console.log('📧 Creating test user...');
	console.log(`   Email: ${email}`);

	// Create user via Admin API
	const { data: user, error } = await supabase.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
		user_metadata: {
			name: 'Test User',
			test_account: true
		}
	});

	if (error) {
		console.error('❌ Failed to create test user:', error.message);
		process.exit(1);
	}

	// Store credentials in .env
	updateEnv(envContent, {
		TEST_USER_EMAIL: email,
		TEST_USER_PASSWORD: password,
		TEST_USER_ID: user.user.id
	});

	console.log('\n✅ Test user created successfully!');
	console.log(`   User ID: ${user.user.id}`);
	console.log(`\n💾 Credentials saved to .env`);
	console.log('   (These credentials are for testing only and never committed to git)');
}

main().catch((err) => {
	console.error('❌ Unexpected error:', err.message);
	process.exit(1);
});
