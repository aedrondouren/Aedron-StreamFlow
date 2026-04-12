You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

---

# AGENTS.md

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
```

## Stack

- **SvelteKit 2** with **Svelte 5 runes** (`compilerOptions.runes: true` in `svelte.config.js`)
- **TypeScript** (strict mode, `moduleResolution: bundler`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin. `src/app.css` uses `@import 'tailwindcss'` (no `tailwind.config.js`). Prettier's Tailwind plugin sorts classes using `./src/app.css` as reference.
- **ESLint** + **typescript-eslint** + `eslint-plugin-svelte` + `eslint-config-prettier`
- **Prettier** with `prettier-plugin-svelte` and `prettier-plugin-tailwindcss`; tabs, single quotes, 100 char width
- **Supabase** for auth, database, and realtime (hosted project: tqrifgeqtxlwohdjafqn)

## Package Manager

- **pnpm** (not npm/yarn). `engine-strict=true` in `.npmrc` enforces this.
- Lockfile is `pnpm-lock.yaml`

## Build & Output

- **adapter-node** (`@sveltejs/adapter-node`): produces a Node.js server. Build output goes to `.output/`
- Generated type files: `.svelte-kit/` (extend `tsconfig.json` from there)

## Environment Variables

- `.env` is gitignored; `.env.example` is the template
- `PUBLIC_SUPABASE_URL` - Supabase project URL (e.g., https://tqrifgeqtxlwohdjafqn.supabase.co)
- `PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase client publishable key
- `PUBLIC_TWITCH_CLIENT_ID` - Twitch OAuth (public, safe to expose)
- `PRIVATE_TWITCH_CLIENT_SECRET` - Twitch OAuth secret (server-side only)
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth (optional)

## Architecture

### Routing Strategy

- `/` (landing): `prerender=true` - static HTML
- `/app/*`: SSR with client-side realtime - initial server load, then client takes over
- `/auth/signin`, `/auth/confirm/*`, `/auth/logout`: Auth routes

### Data Flow (Dashboard)

1. Server load fetches initial data via Supabase (RLS-protected)
2. Client hydrates and subscribes to Supabase Realtime channels
3. Platform actions go through server routes → Platform API → Supabase → Realtime to client

### Key Files

- `src/hooks.server.ts` - Supabase server client + auth guards
- `src/lib/supabase/database.types.ts` - Generated database types
- `src/lib/supabase/validateClaims.ts` - JWT claims validation
- `src/lib/platform/twitchAuth.ts` - Twitch OAuth utilities
- `src/routes/(protected)/app/+layout.ts` - Browser client + realtime setup
- `src/routes/(protected)/app/+layout.server.ts` - Session passed to client

### Supabase Hosted

- **Project**: Linked to hosted Supabase project (ref: tqrifgeqtxlwohdjafqn)
- **Database**: Managed via CLI with `pnpm db:push` and `pnpm db:reset`
- **Auth**: Uses PKCE flow with callback at `/auth/confirm/supabase`
- **OAuth**: Twitch and Google providers configured in Supabase dashboard

### Auth Flow

1. User initiates OAuth sign-in via `signInWithOAuth`
2. OAuth provider redirects to Supabase Auth with authorization code
3. Supabase redirects to app callback (`/auth/confirm/supabase`)
4. App exchanges code for session via `exchangeCodeForSession(code)`
5. Session cookies are set, user is authenticated

### Realtime Data Pattern

The app uses a hybrid SSR + Realtime approach:

1. **Server Load**: Initial data fetched server-side for fast first paint
2. **Client Subscription**: `$effect()` subscribes to Supabase Realtime on mount
3. **Batched Updates**: Rapid changes batched (50ms window) before UI update
4. **Retry Logic**: Exponential backoff [1s, 2s, 5s, 10s] with manual retry

**Key Utilities:**

- `src/lib/realtime/batcher.svelte.ts` - Batches rapid realtime events
- `src/lib/realtime/subscription.svelte.ts` - Subscription manager with retry/auth recovery
- `src/lib/stores/reactiveTable.svelte.ts` - Factory for reactive table stores

**Usage Pattern:**

```typescript
const store = createReactiveTable(supabase, {
	table: 'user_info',
	filter: { column: 'user_id', value: userId }
});
// Call store.start() inside $effect after browser check
```

## Gotchas

- Tailwind v4 config lives in CSS (`@import "tailwindcss"`), not a JS config file
- ESLint disables `no-undef` (conflicts with TypeScript; types-eslint handles it instead)
- `.cache/` and `supabase/volumes/` directories are gitignored
- For SvelteKit href links, the `svelte/no-navigation-without-resolve` rule is disabled (use standard `<a>` tags)
- Supabase env vars prefixed `PUBLIC_` come from `$env/static/public`, `PRIVATE_` from `$env/static/private`
- OAuth redirectTo must be in Supabase dashboard's redirect URL allow list
- Use dynamic `${url.origin}/auth/confirm/supabase` for production-ready redirect URL
- Route groups use `(folder)` syntax - parentheses don't affect URL (e.g., `(protected)/app` resolves to `/app`)
- `pnpm format` runs prettier only (no eslint --fix); use `pnpm lint` to check both
- `svelte-kit sync` runs automatically in `prepare` script (pnpm install), but `pnpm check` also triggers it
- Server endpoints (e.g., `/auth/link`) need `data-sveltekit-reload` on links to force full navigation
- `createReactiveTable()` returns a store that must be started manually (call `.start()` in `$effect`, not at module level)
- Never call Supabase methods that trigger fetch during SSR - always guard with `browser` check or defer to `$effect`
