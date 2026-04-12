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

## Gotchas

- Tailwind v4 config lives in CSS (`@import "tailwindcss"`), not a JS config file
- ESLint disables `no-undef` (conflicts with TypeScript; types-eslint handles it instead)
- `.cache/` and `supabase/volumes/` directories are gitignored
- For SvelteKit href links, the `svelte/no-navigation-without-resolve` rule is disabled (use standard `<a>` tags)
- Supabase env vars prefixed `PUBLIC_` come from `$env/static/public`, `PRIVATE_` from `$env/static/private`
- OAuth redirectTo must be in Supabase dashboard's redirect URL allow list
- Use dynamic `${url.origin}/auth/confirm/supabase` for production-ready redirect URL
