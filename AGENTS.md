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
```

### Stack

- **SvelteKit 2** with **Svelte 5 runes** (`compilerOptions.runes: true`)
- **TypeScript** (strict mode, `moduleResolution: bundler`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **ESLint** + **typescript-eslint** + `eslint-plugin-svelte` + `eslint-config-prettier`
- **Prettier** with `prettier-plugin-svelte` and `prettier-plugin-tailwindcss`
- **Supabase** for auth, database, and realtime

### Package Manager

- **pnpm** (enforced by `engine-strict=true` in `.npmrc`)
- Lockfile: `pnpm-lock.yaml`

### Build & Output

- **adapter-node** (`@sveltejs/adapter-node`): Node.js server → `.output/`
- Generated types: `.svelte-kit/`

### Environment Variables

| Variable                                   | Source                | Purpose                       |
| ------------------------------------------ | --------------------- | ----------------------------- |
| `PUBLIC_SUPABASE_URL`                      | `$env/static/public`  | Supabase project URL          |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY`          | `$env/static/public`  | Supabase anon key             |
| `PUBLIC_TWITCH_CLIENT_ID`                  | `$env/static/public`  | Twitch OAuth (safe to expose) |
| `PRIVATE_TWITCH_CLIENT_SECRET`             | `$env/static/private` | Twitch OAuth (server-only)    |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | `$env/static/private` | Google OAuth (optional)       |

---

## MCP Servers

This project uses three MCP (Model Context Protocol) servers:

### Svelte MCP (`@sveltejs/opencode`)

Svelte 5 and SvelteKit documentation, code analysis, and playground links.

**Tools:**

- `list-sections` — Discover documentation sections (use FIRST)
- `get-documentation` — Fetch full docs for specific sections
- `svelte-autofixer` — Analyze and fix Svelte code issues (ALWAYS use before sending code)
- `playground-link` — Generate Svelte Playground links (ask user first)

### Chrome DevTools MCP (`chrome-devtools-mcp`)

Browser debugging and performance profiling.

### Playwright MCP (`@playwright/mcp`)

Browser automation, end-to-end testing, and visual verification.

**Configuration:** OpenCode users have these auto-configured in `opencode.json`. VS Code users configure via IDE's MCP panel.

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

### Realtime Data Pattern

Hybrid SSR + Realtime:

1. **Server Load**: Fast first paint with server-fetched data
2. **Client Subscription**: `$effect()` subscribes to Realtime on mount
3. **Batched Updates**: 50ms window for rapid changes
4. **Retry Logic**: Exponential backoff [1s, 2s, 5s, 10s] with manual retry

**Key Utilities:**

- `src/lib/realtime/batcher.svelte.ts` — Batches rapid events
- `src/lib/realtime/subscription.svelte.ts` — Subscription manager
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

- Tailwind v4 config lives in CSS (`@import "tailwindcss"`), not JS
- `.cache/` and `supabase/volumes/` are gitignored
- `PUBLIC_*` env vars from `$env/static/public`, `PRIVATE_*` from `$env/static/private`
- OAuth `redirectTo` must be in Supabase dashboard allow list
- Use dynamic `${url.origin}/auth/confirm/supabase` for production
- Route groups: `(folder)` syntax — parentheses don't affect URL
- `pnpm format` = prettier only; `pnpm lint` checks both
- `svelte-kit sync` runs in `prepare` script
- Server endpoints need `data-sveltekit-reload` on links
- `createReactiveTable()` store must be started manually (in `$effect`, not module level)
- Never call Supabase fetch methods during SSR — guard with `browser` or defer to `$effect`

---

## Workflows

### Sub-agent Collaboration

Use **sub-agents** for parallel tasks:

- **When:** Tasks divide into independent chunks (e.g., "fix animation" + "investigate warning")
- **How:** `task` tool with specific, isolated prompts
- **Benefits:** Faster completion, parallel execution, specialized focus

### Visual Verification

When making UI changes, verify visually using Playwright MCP. See [Visual Verification Workflow](.opencode/playwright/README.md) for full details.

**Quick Setup:**

```bash
pnpm test:visual:setup  # Creates test user + mock data
```

**Credentials** stored in `.env`:

- `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`, `TEST_USER_ID`
