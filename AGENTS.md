# AGENTS.md

Quick reference for AI agents working on this project.

> **Note:** For human contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Quick Reference

### Dev Commands

```bash
pnpm dev          # Start dev server (http://localhost:5173)
pnpm build        # Production build
pnpm check        # Type-check (requires svelte-kit sync first)
pnpm check:watch  # Watch mode type-check
pnpm lint         # Run prettier --check && eslint
pnpm format       # Run prettier --write . && eslint --fix

# Supabase (linked to hosted project: tqrifgeqtxlwohdjafqn)
pnpm db:generate  # Generate TypeScript types from hosted DB
pnpm db:push      # Push migrations to hosted database
pnpm db:reset     # Reset hosted database (⚠️ destructive)

# Testing (LLM-specific)
pnpm test:user:cleanup  # Delete test user and all platform data (⚠️ destructive)
```

### Stack

- **SvelteKit 2** with **Svelte 5 runes** (`compilerOptions.runes: true`)
- **TypeScript** (strict mode, `moduleResolution: bundler`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **bits-ui** — Headless UI components (always preferred over vanilla HTML)
- **ESLint** + **typescript-eslint** + `eslint-plugin-svelte` + `eslint-config-prettier`
- **Prettier** with `prettier-plugin-svelte` and `prettier-plugin-tailwindcss`
- **Supabase** for auth, database, and realtime
- **Theme System** — Light/dark mode with `data-theme` attribute and system preference detection

### Package Manager

- **pnpm** (enforced by `engine-strict=true` in `.npmrc`)
- Lockfile: `pnpm-lock.yaml`

### Build & Output

- **adapter-node** (`@sveltejs/adapter-node`): Node.js server → `.output/`
- Generated types: `.svelte-kit/`

### Environment Variables

| Variable                          | Source                | Purpose                                |
| --------------------------------- | --------------------- | -------------------------------------- |
| `PUBLIC_SUPABASE_URL`             | `$env/static/public`  | Supabase project URL                   |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `$env/static/public`  | Supabase anon key                      |
| `PRIVATE_SUPABASE_SERVICE_ROLE_KEY` | `$env/static/private` | Supabase service role key (admin ops)  |
| `PUBLIC_TWITCH_CLIENT_ID`         | `$env/static/public`  | Twitch OAuth (safe to expose)          |
| `PRIVATE_TWITCH_CLIENT_SECRET`    | `$env/static/private` | Twitch OAuth (server-only)             |
| `PUBLIC_GOOGLE_CLIENT_ID`         | `$env/static/public`  | YouTube OAuth (safe to expose)         |
| `PRIVATE_GOOGLE_CLIENT_SECRET`    | `$env/static/private` | YouTube OAuth (server-only)            |
| `PUBLIC_KICK_CLIENT_ID`           | `$env/static/public`  | Kick OAuth (safe to expose)            |
| `PRIVATE_KICK_CLIENT_SECRET`      | `$env/static/private` | Kick OAuth (server-only)               |
| `TEST_USER_EMAIL`                 | `.env` (auto-gen)     | Test user email for visual testing     |
| `TEST_USER_PASSWORD`              | `.env` (auto-gen)     | Test user password for visual testing  |
| `TEST_USER_ID`                    | `.env` (auto-gen)     | Test user UUID for visual testing      |

---

## MCP Servers

This project uses MCP (Model Context Protocol) servers for enhanced capabilities:

**Svelte MCP** — Svelte 5 and SvelteKit documentation, code analysis

- `list-sections` — Discover documentation sections (use FIRST)
- `get-documentation` — Fetch full docs for specific sections
- `svelte-autofixer` — Analyze and fix Svelte code issues (ALWAYS use before sending code)

**Chrome DevTools MCP** — Browser debugging, performance profiling, visual verification

- `chrome-devtools_navigate_page` — Navigate to URLs or go back/forward/reload
- `chrome-devtools_take_screenshot` — Capture screenshots for visual verification
- `chrome-devtools_resize_page` — Set viewport dimensions for responsive testing
- `chrome-devtools_evaluate_script` — Execute JavaScript (use for `window.getComputedStyle()` debugging)

**Note:** MCP configuration varies by IDE. Check your environment's MCP setup.

### Bits UI

Headless UI components for Svelte 5. Uses the [llms.txt standard](https://bits-ui.com/docs/llms) for LLM-friendly documentation.

**LLM Documentation Navigation:**

- **Root index**: https://bits-ui.com/llms.txt — Lists all available documentation pages
- **Schema explanation**: https://bits-ui.com/docs/llms/llms.txt — Explains the llms.txt format
- **Per-component**: Append `/llms.txt` to any component URL (e.g., `/docs/components/button/llms.txt`)
- **Full consolidated docs**: https://bits-ui.com/docs/llms.txt — Complete documentation in one file

**Workflow for Discovering Components:**

1. Fetch root index to see all available components: `https://bits-ui.com/llms.txt`
2. Fetch specific component docs: `https://bits-ui.com/docs/components/{component}/llms.txt`
3. Use `svelte-autofixer` to validate component usage before sending code
4. Add new component to barrel export: `src/lib/components/index.ts`
5. Import from centralized barrel: `import { Button, Tooltip } from '$lib/components'`

**Important:** All bits-ui components must be added to the barrel export file (`src/lib/components/index.ts`) before they can be imported. The barrel export is the single source of truth for UI component imports.

**Key Components:**

- `Button.Root` — Replace vanilla `<button>`, use `href` prop to render as `<a>`
- `Tooltip` — Hover information on UI elements
- `Avatar` — Platform profile images
- `Dialog` — Modals and overlays
- `Separator` — Visual dividers

**Usage Pattern:**

```svelte
<script>
	import { Button, Tooltip } from '$lib/components';
</script>

<!-- Button as link -->
<Button.Root href="/app/platforms" variant="default">Go to Platforms</Button.Root>

<!-- Tooltip -->
<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button.Root>Hover me</Button.Root>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Tooltip text</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
```

---

## Architecture

### Routing Strategy

| Route     | Strategy         | Notes                               |
| --------- | ---------------- | ----------------------------------- |
| `/`       | `prerender=true` | Static landing page                 |
| `/app/*`  | SSR + Realtime   | Server load, then client takes over |
| `/auth/*` | SSR              | Signin, confirm, logout flows       |

### Data Flow (Dashboard)

1. **Server Load**: Fetches initial data via Supabase (RLS-protected)
2. **Client Hydration**: Subscribes to Supabase Realtime channels
3. **Actions**: Server routes → Platform API → Supabase → Realtime → Clients

### Key Files

| File                                           | Purpose                              |
| ---------------------------------------------- | ------------------------------------ |
| `src/hooks.server.ts`                          | Supabase server client + auth guards |
| `src/lib/supabase/database.types.ts`           | Generated database types             |
| `src/lib/supabase/validateClaims.ts`           | JWT claims validation                |
| `src/lib/platform/twitchAuth.ts`               | Twitch OAuth utilities               |
| `src/lib/platform/youtubeAuth.ts`              | YouTube OAuth utilities              |
| `src/lib/platform/kickAuth.ts`                 | Kick OAuth utilities                 |
| `src/lib/platform/platformMapper.ts`           | Platform data normalization          |
| `src/lib/platform/userTransformers.ts`         | User data transformation utilities   |
| `src/lib/platform/tokenRefresher.ts`           | Token refresh logic                  |
| `src/lib/platform/tokenResolver.ts`            | Token resolution utilities           |
| `src/lib/platform/tokenState.ts`               | Token state management               |
| `src/lib/platform/scopes.ts`                   | OAuth scope definitions & utils      |
| `src/lib/platform/types.ts`                    | Shared platform types                |
| `src/lib/server/auth.ts`                       | Server auth guards (requireAuth)     |
| `src/lib/server/oauthState.ts`                 | OAuth state parameter management     |
| `src/lib/server/platformLinking/manualLink.ts` | Manual platform linking utilities    |
| `src/lib/validation/auth.ts`                   | Auth validation schemas              |
| `src/lib/stores/theme.svelte.ts`               | Theme utilities (SSR-safe)           |
| `src/lib/components/ThemeToggle.svelte`        | Theme toggle component               |
| `src/lib/realtime/batcher.svelte.ts`           | Event batching (50ms window)         |
| `src/lib/realtime/merge.ts`                    | Realtime payload merging             |
| `src/lib/realtime/subscription.svelte.ts`      | Subscription manager with retry      |
| `src/lib/stores/reactiveTable.svelte.ts`       | Reactive table factory               |
| `src/routes/(protected)/app/+layout.ts`        | Browser client + realtime setup      |
| `src/routes/(protected)/app/+layout.server.ts` | Session passed to client             |

### Supabase Hosted

- **Project**: `tqrifgeqtxlwohdjafqn`
- **Database**: CLI-managed (`pnpm db:push`, `pnpm db:reset`)
- **Auth**: PKCE flow with callback at `/auth/confirm/supabase`
- **OAuth**: Twitch and Google configured in dashboard

### Auth Flow

1. User initiates OAuth via `signInWithOAuth`
2. Provider redirects to Supabase with authorization code
3. Supabase redirects to `/auth/confirm/supabase`
4. App exchanges code via `exchangeCodeForSession(code)`
5. Session cookies set, user authenticated

### Platform Linking States

Four states for platform authentication:

| State            | Description                       | UI Behavior                        |
| ---------------- | --------------------------------- | ---------------------------------- |
| `unlinked`       | No platform connection            | Show "Connect [Platform]" button   |
| `managed_basic`  | OAuth signup, minimal permissions | Show ⚠️ warning + "Complete Setup" |
| `managed_linked` | Full OAuth with all permissions   | Show profile + "Disconnect"        |
| `manual_linked`  | Manually entered tokens/API keys  | Show profile + "Disconnect"        |

### Manual Platform Linking

Manual linking allows users to connect platforms by directly entering credentials:

**Key File:** `src/lib/server/platformLinking/manualLink.ts`

**Utilities:**

- `savePlatformAuth()` — Saves platform authentication data to database
- `savePlatformUserInfo()` — Saves platform user profile data
- `isPlatformLinked()` — Checks if platform is already linked

**Use Cases:**

- Platforms without OAuth support
- Custom API key integrations
- Fallback when OAuth fails

### OAuth Prompt Flows

Three flow types in `/auth/oauth-prompt`:

- **`signup`** — Initial signup, offers "Continue without linking"
- **`connect`** — Explicit connection, shows OAuth vs Manual comparison
- **`upgrade`** — Upgrading from `managed_basic` to `managed_linked`

### Realtime Data Pattern

Hybrid SSR + Realtime:

1. **Server Load**: Fast first paint with server-fetched data
2. **Client Subscription**: `$effect()` subscribes to Realtime on mount
3. **Batched Updates**: 50ms window for rapid changes
4. **Retry Logic**: Exponential backoff [1s, 2s, 5s, 10s] with manual retry

**Key Utilities:**

- `src/lib/realtime/batcher.svelte.ts` — Batches rapid events
- `src/lib/realtime/merge.ts` — Merges realtime payloads
- `src/lib/realtime/subscription.svelte.ts` — Subscription manager with retry
- `src/lib/stores/reactiveTable.svelte.ts` — Reactive table factory

**Usage:**

```typescript
const store = createReactiveTable(supabase, {
	table: 'user_info',
	filter: { column: 'user_id', value: userId }
});
// Call store.start() inside $effect after browser check
```

---

## Gotchas

- Tailwind v4 config lives in CSS (`@import "tailwindcss"`), not in JS
- `.cache/` and `supabase/volumes/` are gitignored
- `PUBLIC_*` env vars from `$env/static/public`, `PRIVATE_*` from `$env/static/private`
- OAuth `redirectTo` must be in Supabase dashboard allow list
- Use dynamic `${url.origin}/auth/confirm/supabase` for production
- Route groups: `(folder)` syntax — parentheses don't affect URL
- Route params: `src/params/` directory defines param constraints (e.g., `signInOut.ts`)
- `pnpm format` = prettier only; `pnpm lint` checks both
- `svelte-kit sync` runs in `prepare` script
- Server endpoints need `data-sveltekit-reload` on links
- `createReactiveTable()` store must be started manually (in `$effect`, not module level)
- Never call Supabase fetch methods during SSR — guard with `browser` or defer to `$effect`
- When debugging styling issues, use `chrome-devtools_evaluate_script` with `window.getComputedStyle(element)` to inspect actual computed styles
- **Never cast types needlessly** — ensure data shapes match instead of using `as Type`
- **Use `resolve()` from `$app/paths`** for all internal navigation hrefs (type-safe routing)
- **Module script imports**: Place static/runtime imports (types, utilities, stores) in `<script lang="ts" module>`, keep runtime-only imports (assets, CSS) in regular `<script>`
- **$derived destructuring**: Destructure all derived values from `data` props in a single `$derived()` call with defaults (e.g., `{ a, b = 'default' } = $derived(data)`)
- **Import ordering**: VSCode handles import sorting on save; Prettier handles formatting only
- **Empty route files**: Remove unused `+page.svelte`/`+page.ts` stubs; recreate when content is needed

---

## Dev Server Protocol

**ALWAYS check if dev server is running before starting one:**

1. Navigate to `http://localhost:5173`
2. If navigation succeeds, server is running — proceed
3. If navigation fails, run `pnpm dev` and wait for startup
4. **Never start multiple server instances**

### Visual Verification

When making UI changes, verify using Chrome DevTools MCP. Non-vision models should use scripting-based validation.

**Quick Setup:**

```bash
pnpm test:visual:setup  # Creates test user + mock data
```

**Test Credentials** stored in `.env`:

- `TEST_USER_EMAIL` — Email for login
- `TEST_USER_PASSWORD` — Auto-generated secure password
- `TEST_USER_ID` — Supabase user UUID

**Cleanup:**

After visual testing, clean up test data:

```bash
pnpm test:user:cleanup  # Deletes test user, all platform data, and cleans .env
```

This removes:
- Test user account from Supabase Auth
- All `user_auth` entries for the test user
- All `user_info` entries for the test user
- `TEST_USER_*` credentials from `.env` file

---

### For Vision-Capable Models

Use Chrome DevTools MCP to navigate and take screenshots for visual verification.

**Verification Steps:**

1. **Check dev server status** — Navigate to `http://localhost:5173`. If it fails, run `pnpm dev` and wait.

2. **For protected routes (/app)**:
   - Navigate to `/auth/signin`
   - Fill in credentials and submit
   - Wait for redirect to `/app`

3. **Resize viewport** — Use `chrome-devtools_resize_page` for target device

4. **Navigate and screenshot** — Load route, capture for validation

5. **Screenshot locations**:
   - Temporary (validation): `.repo/temp/` — gitignored
   - Permanent (docs): `.repo/screenshots/` — committed

---

### For Non-Vision Models (Scripting-Based Validation)

Use `chrome-devtools_evaluate_script` to programmatically validate UI elements:

**1. Visibility & Layout Validation:**

```javascript
// Check if element is visible and properly laid out
const element = document.querySelector('[data-testid="my-component"]');
const styles = window.getComputedStyle(element);

// Visibility checks
console.assert(styles.display !== 'none', 'Element should be visible');
console.assert(styles.visibility === 'visible', 'Element should not be hidden');
console.assert(styles.opacity > 0, 'Element should not be transparent');

// Layout checks
console.assert(
	styles.position === 'relative' || styles.position === 'static',
	'Should use standard positioning'
);
console.assert(styles.width !== '0px', 'Element should have width');
console.assert(styles.height !== '0px', 'Element should have height');

// Return validation report
return {
	visible: styles.display !== 'none' && styles.opacity > 0,
	width: styles.width,
	height: styles.height,
	position: styles.position,
	display: styles.display,
	flexDirection: styles.flexDirection,
	hasClasses: element.className
};
```

**2. Responsive Layout Validation:**

```javascript
// Test at different viewports
const viewports = {
	mobile: { width: 375, height: 812 },
	tablet: { width: 768, height: 1024 },
	desktop: { width: 1440, height: 900 }
};

for (const [name, size] of Object.entries(viewports)) {
	// Resize page
	// Then validate layout changes
	const container = document.querySelector('[data-sidebar]');
	const styles = window.getComputedStyle(container);

	console.assert(
		name === 'mobile' ? styles.display === 'none' : styles.display !== 'none',
		`Sidebar should be ${name === 'mobile' ? 'hidden' : 'visible'} on ${name}`
	);
}
```

**3. Styling Validation:**

```javascript
const button = document.querySelector('button[data-testid="primary-action"]');
const styles = window.getComputedStyle(button);

// Check Tailwind classes applied correctly
console.assert(
	styles.backgroundColor === 'rgb(99, 102, 241)' || // primary-600
		styles.backgroundColor.includes('99, 102, 241'),
	'Button should have primary color background'
);
console.assert(styles.borderRadius === '0.375rem', 'Should have rounded-md corners');
console.assert(styles.fontWeight === '600', 'Should be semibold');
```

**4. Interaction Validation (Hover/Focus States):**

```javascript
// Check hover state exists
const button = document.querySelector('button');
const hoverStyles = window.getComputedStyle(button, ':hover');
const normalStyles = window.getComputedStyle(button);

console.assert(
	hoverStyles.backgroundColor !== normalStyles.backgroundColor ||
		hoverStyles.transform !== normalStyles.transform,
	'Button should have hover state changes'
);

// Check focus-visible for accessibility
const focusStyles = window.getComputedStyle(button, ':focus-visible');
console.assert(
	focusStyles.outlineWidth !== '0px' || focusStyles.boxShadow !== 'none',
	'Button should have focus indicator for accessibility'
);
```

**5. Animation/Transition Validation:**

```javascript
// Check if transitions are configured
const element = document.querySelector('.animated-element');
const styles = window.getComputedStyle(element);

console.assert(
	styles.transitionDuration !== '0s' && styles.transitionDuration !== '',
	'Element should have transition duration'
);

// Validate transition properties
const transitionProperties = [
	'transition-property',
	'transition-duration',
	'transition-timing-function'
].map((prop) => styles.getPropertyValue(prop));

console.log('Transition config:', transitionProperties);

// For transform-based animations
const transform = styles.transform;
console.assert(
	transform !== 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)',
	'Transform should be applied (or at least have default matrix)'
);
```

**6. Complete Validation Workflow:**

```javascript
// Comprehensive validation function
function validateComponent(selector, expectations) {
	const element = document.querySelector(selector);
	if (!element) {
		return { error: `Element not found: ${selector}` };
	}

	const styles = window.getComputedStyle(element);
	const rect = element.getBoundingClientRect();

	const results = {
		selector,
		found: true,
		visible: rect.width > 0 && rect.height > 0 && styles.opacity > 0,
		dimensions: { width: rect.width, height: rect.height },
		styles: {
			display: styles.display,
			position: styles.position,
			flexDirection: styles.flexDirection,
			backgroundColor: styles.backgroundColor,
			color: styles.color,
			borderRadius: styles.borderRadius,
			transition: styles.transition
		},
		classes: element.className,
		hasHover: styles.getPropertyValue('transition-duration') !== '0s',
		accessibility: {
			role: element.getAttribute('role'),
			ariaLabel: element.getAttribute('aria-label'),
			tabIndex: element.getAttribute('tabindex')
		}
	};

	// Validate expectations
	const errors = [];
	if (expectations.minWidth && rect.width < expectations.minWidth) {
		errors.push(`Width ${rect.width}px < expected ${expectations.minWidth}px`);
	}
	if (expectations.shouldHaveTransition && !results.hasHover) {
		errors.push('Expected transition but none found');
	}

	return { ...results, errors };
}

// Usage
const report = validateComponent('[data-sidebar]', {
	minWidth: 200,
	shouldHaveTransition: true
});
console.log('Validation report:', report);
```

**7. Automated Viewport Testing:**

Test all routes at mobile, tablet, and desktop sizes using the same workflow as visual verification:

```javascript
// Example: Test sidebar responsiveness across viewports
const viewports = [
	{ name: 'mobile', width: 375, height: 812 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'desktop', width: 1440, height: 900 }
];

for (const viewport of viewports) {
	// Resize to viewport
	// Navigate to route
	// Validate responsive behavior
	const sidebar = document.querySelector('[data-sidebar]');
	const styles = window.getComputedStyle(sidebar);

	console.assert(
		viewport.name === 'mobile' ? styles.display === 'none' : styles.display !== 'none',
		`Sidebar should be ${viewport.name === 'mobile' ? 'hidden' : 'visible'} on ${viewport.name}`
	);
}
```

---

### Theme Loading

**Inline Script:** Theme loading happens in `src/app.html` head (before `%sveltekit.head%`) to prevent FOUC:

- Sets `data-theme` attribute (`'light'`, `'dark'`, or `'system'`)
- When `'system'`, also sets `data-system-theme` based on OS preference
- Uses `system-dark` class for CSS dark mode variant when needed

**CSS Variants:** Tailwind dark mode uses `@custom-variant` with `data-theme` attribute:

```css
@custom-variant dark (&:where(:root[data-theme=dark], :root[data-theme=dark] *, :root[data-theme=system][data-system-theme=dark], :root[data-theme=system][data-system-theme=dark] *));
```

**Custom Theme Variants:** Use `theme-light`, `theme-dark`, `theme-system` for conditional rendering:

```svelte
<span class="hidden theme-light:inline">Light icon</span>
<span class="hidden theme-dark:inline">Dark icon</span>
<span class="hidden theme-system:inline">System icon</span>
```

### Debugging Styling Issues

Use `chrome-devtools_evaluate_script` with `window.getComputedStyle(element)` to inspect actual computed styles when debugging CSS problems.

**Example: Debug why a button isn't visible**

```javascript
const button = document.querySelector('button');
const styles = window.getComputedStyle(button);
const rect = button.getBoundingClientRect();

	return {
		display: styles.display,
		visibility: styles.visibility,
		opacity: styles.opacity,
		width: rect.width,
		height: rect.height,
		position: styles.position,
		zIndex: styles.zIndex,
		transform: styles.transform,
		classes: button.className
	};
}
```

### Gotchas

- Tailwind v4 config lives in CSS (`@import "tailwindcss"`), not in JS
- `.cache/` and `supabase/volumes/` are gitignored
- `PUBLIC_*` env vars from `$env/static/public`, `PRIVATE_*` from `$env/static/private`
- OAuth `redirectTo` must be in Supabase dashboard allow list
- Use dynamic `${url.origin}/auth/confirm/supabase` for production
- Route groups: `(folder)` syntax — parentheses don't affect URL
- Route params: `src/params/` directory defines param constraints (e.g., `signInOut.ts`)
- `pnpm format` = prettier only; `pnpm lint` checks both
- `svelte-kit sync` runs in `prepare` script
- Server endpoints need `data-sveltekit-reload` on links
- `createReactiveTable()` store must be started manually (in `$effect`, not module level)
- Never call Supabase fetch methods during SSR — guard with `browser` or defer to `$effect`
- When debugging styling issues, use `chrome-devtools_evaluate_script` with `window.getComputedStyle(element)` to inspect actual computed styles
- **Never cast types needlessly** — ensure data shapes match instead of using `as Type`
- **Use `resolve()` from `$app/paths`** for all internal navigation href (type-safe routing)
- **Module script imports**: Place static/runtime imports (types, utilities, stores) in `<script lang="ts" module>`, keep runtime-only imports (assets, CSS) in regular `<script>`
- **$derived destructuring**: Destructure all derived values from `data` props in a single `$derived()` call with defaults (e.g., `{ a, b = 'default' } = $derived(data)`)
- **Import ordering**: VSCode handles import sorting on save; Prettier handles formatting only
- **Empty route files**: Remove unused `+page.svelte`/`+page.ts` stubs; recreate when content is needed
