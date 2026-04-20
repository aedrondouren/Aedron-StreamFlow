# System Documentation

Technical reference for developers and AI agents working on Aedron StreamFlow.

---

## Dev Commands

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

# Testing
pnpm test:visual:setup         # Setup test environment with mock data (test user + Twitch)
pnpm test:user:cleanup         # Delete test user and all platform data (⚠️ destructive)

# Mock Platform States (for visual testing)
pnpm test:spoof:twitch         # Mock Twitch connection
pnpm test:spoof:youtube        # Mock YouTube connection
pnpm test:spoof:kick           # Mock Kick connection
pnpm test:spoof:managed-basic  # Mock managed_basic state (upgrade prompt)
```

**Test Credentials** (after running `test:visual:setup`):
- Email: `test@email.test`
- Password: Auto-generated (check `.env`)

---

## Stack

- **SvelteKit 2** with **Svelte 5 runes** (`compilerOptions.runes: true`)
- **TypeScript** (strict mode, `moduleResolution: bundler`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **bits-ui** — Headless UI components (always preferred over vanilla HTML)
- **ESLint** + **typescript-eslint** + `eslint-plugin-svelte` + `eslint-config-prettier`
- **Prettier** with `prettier-plugin-svelte` and `prettier-plugin-tailwindcss`
- **Supabase** for auth, database, and realtime
- **Theme System** — Light/dark mode with `data-theme` attribute and system preference detection

---

## Package Manager

- **pnpm** (enforced by `engine-strict=true` in `.npmrc`)
- Lockfile: `pnpm-lock.yaml`

---

## Build & Output

- **adapter-node** (`@sveltejs/adapter-node`): Node.js server → `.output/`
- Generated types: `.svelte-kit/`

---

## Environment Variables

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

## Theme System

**Light/Dark/System themes** with automatic system preference detection, inline script to prevent FOUC, CSS-based switching via `data-theme` attributes, and LocalStorage persistence.

### Theme Loading

Inline script in `src/app.html` head (before `%sveltekit.head%`):
- Sets `data-theme` attribute (`'light'`, `'dark'`, or `'system'`)
- When `'system'`, also sets `data-system-theme` based on OS preference
- Uses `system-dark` class for CSS dark mode variant when needed

### CSS Variants

Tailwind dark mode uses `@custom-variant` with `data-theme` attribute:

```css
@custom-variant dark (&:where(:root[data-theme=dark], :root[data-theme=dark] *, :root[data-theme=system][data-system-theme=dark], :root[data-theme=system][data-system-theme=dark] *));
```

### Custom Theme Variants

Use `theme-light`, `theme-dark`, `theme-system` for conditional rendering:

```svelte
<span class="hidden theme-light:inline">Light icon</span>
<span class="hidden theme-dark:inline">Dark icon</span>
<span class="hidden theme-system:inline">System icon</span>
```
