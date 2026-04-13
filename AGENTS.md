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

# Testing
pnpm test:user:setup      # Create test user in Supabase
pnpm test:spoof:twitch    # Generate mock Twitch platform data
pnpm test:visual:setup    # Combined: test user + mock data
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

This project uses two MCP (Model Context Protocol) servers:

### Svelte MCP (`@sveltejs/opencode`)

Svelte 5 and SvelteKit documentation, code analysis, and playground links.

**Tools:**

- `list-sections` — Discover documentation sections (use FIRST)
- `get-documentation` — Fetch full docs for specific sections
- `svelte-autofixer` — Analyze and fix Svelte code issues (ALWAYS use before sending code)
- `playground-link` — Generate Svelte Playground links (ask user first)

### Chrome DevTools MCP (`chrome-devtools-mcp`)

Browser debugging, performance profiling, and visual verification.

**Tools:**

- `chrome-devtools_navigate_page` — Navigate to URLs or go back/forward/reload
- `chrome-devtools_take_screenshot` — Capture screenshots for visual verification
- `chrome-devtools_resize_page` — Set viewport dimensions for responsive testing
- `chrome-devtools_evaluate_script` — Execute JavaScript (use for `window.getComputedStyle()` debugging)
- `chrome-devtools_list_pages` — Manage browser tabs

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
- When debugging styling issues, use `chrome-devtools_evaluate_script` with `window.getComputedStyle(element)` to inspect actual computed styles

---

## Workflows

### Sub-agent Collaboration

Use **sub-agents AGGRESSIVELY** for parallel tasks:

- **When to use:**
  - Independent file editing tasks (different files)
  - Tasks that don't depend on each other's output
  - Investigation tasks while making changes elsewhere
  - Any opportunity for parallelization

- **How:** `task` tool with specific, isolated prompts
- **Don't wait** — delegate immediately when tasks are independent
- **Benefits:** Faster completion, parallel execution, specialized focus

### Dev Server Protocol

**ALWAYS check if dev server is running before starting one:**

1. Use `chrome-devtools_navigate_page` with `type: 'url'` to `http://localhost:5173`
2. If navigation succeeds, server is running — proceed
3. If navigation fails, run `pnpm dev` and wait for startup
4. **Never start multiple server instances**

### Visual Verification

When making UI changes, verify visually using Chrome DevTools MCP.

**Quick Setup:**

```bash
pnpm test:visual:setup  # Creates test user + mock data
```

**Test Credentials** stored in `.env`:

- `TEST_USER_EMAIL` — Email for login
- `TEST_USER_PASSWORD` — Auto-generated secure password
- `TEST_USER_ID` — Supabase user UUID

**Verification Steps:**

1. **Check dev server status** — Navigate to `http://localhost:5173`. If it fails, run `pnpm dev` and wait.

2. **For protected routes (/app)**:
   - Navigate to `/auth/signin`
   - Fill in credentials from `TEST_USER_EMAIL` and `TEST_USER_PASSWORD`
   - Submit and wait for redirect to `/app`

3. **Confirm viewport** — Ask the user or check context:
   - Mobile: ~375-414px width
   - Tablet: ~768px width
   - Desktop: ~1440px+ width (default)

4. **Match viewport** — Use `chrome-devtools_resize_page` to set dimensions

5. **Navigate to route** — Use `chrome-devtools_navigate_page` to load the page

6. **Take screenshots**:
   - **UI validation** (temporary): `.opencode/temp/component-state.png`
   - **Documentation** (permanent): `.repo/screenshots/component-final.png`

7. **Iterate** — Adjust and re-verify if results don't match expectations

**Screenshot Asset Management:**

- **Temporary screenshots** (UI validation): `.opencode/temp/` — gitignored, clean periodically
- **Permanent screenshots** (documentation): `.repo/screenshots/` — committed to repository

**Debugging Styling Issues:**

Use `chrome-devtools_evaluate_script` with `window.getComputedStyle(element)` to inspect actual computed styles when debugging CSS problems.

### Agent Skills

OpenCode loads reusable instructions from `.opencode/skills/*/SKILL.md`. Skills are discovered automatically and loaded on-demand via the native `skill` tool.

**Available Skills:**

- **update-docs** — Instructions for updating AGENTS.md, README.md, package.json, and .gitignore when code changes require documentation updates
  - **Use when:** Adding features, changing workflows, modifying npm scripts, or updating screenshots
  - **Location:** `.opencode/skills/update-docs/SKILL.md`

**Skill Permissions:**

Skills are restricted by agent mode for safety:

- **Planning mode:** Skills that require file edits are **denied** (read-only analysis)
- **Build mode:** All skills are **allowed** (full edit permissions)

This prevents accidental modifications during analysis while enabling full documentation updates during implementation.
