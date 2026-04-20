---
name: deep-update-docs
description: Comprehensive documentation sync through full codebase analysis
metadata:
  audience: agents
  workflow: documentation
---

## Purpose

This skill performs **comprehensive documentation synchronization** by deeply analyzing the entire codebase structure, logic, and patterns. Use for major refactors, initial documentation creation, or periodic full syncs.

## When to Use

Apply this skill for:

- **Initial documentation setup** for a project
- **Major refactors** that changed architecture
- **Periodic audits** (e.g., before major releases)
- **After multiple commits** without documentation updates
- **Discovering documentation drift** (docs don't match code)

## Workflow

### Phase 1: Project Structure Analysis

**1. Analyze package.json:**

```bash
# Read complete package.json
- Extract all scripts (dev, build, test, db, etc.)
- List all dependencies and devDependencies
- Note engine requirements
- Check project metadata (version, description, keywords)
```

**2. Map directory structure:**

```bash
# Explore src/ recursively
src/
├── lib/           # Library code
│   ├── components/  # UI components
│   ├── platform/    # Platform integrations
│   ├── realtime/    # Realtime utilities
│   ├── server/      # Server utilities
│   ├── stores/      # State management
│   ├── supabase/    # Database types/helpers
│   └── validation/  # Validation schemas
├── routes/        # SvelteKit routes
│   ├── (protected)/ # Auth-required routes
│   └── +page.svelte # Landing pages
├── hooks.server.ts # Server middleware
└── app.css        # Global styles
```

**3. Identify key configuration files:**

- `svelte.config.js` — SvelteKit configuration
- `vite.config.ts` — Vite plugins and settings
- `tsconfig.json` — TypeScript configuration
- `tailwind.config.*` — Tailwind setup (or CSS config)
- `.env.example` — Environment variables

### Phase 2: Deep Code Analysis

**1. Read all key files in parallel:**

**Configuration Files:**

- `package.json` — Scripts, dependencies, metadata
- `svelte.config.js` — Adapter, compiler options
- `vite.config.ts` — Plugins, build config
- `tsconfig.json` — TypeScript strictness, module resolution

**Core Architecture:**

- `src/hooks.server.ts` — Auth middleware, route guards
- `src/lib/server/auth.ts` — Authentication utilities
- `src/lib/server/oauthState.ts` — OAuth state management
- `src/lib/server/platformLinking/manualLink.ts` — Manual platform linking

**Platform Integration:**

- `src/lib/platform/twitchAuth.ts` — Twitch OAuth
- `src/lib/platform/youtubeAuth.ts` — YouTube OAuth
- `src/lib/platform/kickAuth.ts` — Kick OAuth
- `src/lib/platform/platformMapper.ts` — Data normalization
- `src/lib/platform/userTransformers.ts` — User transformations
- `src/lib/platform/tokenRefresher.ts` — Token refresh logic
- `src/lib/platform/tokenResolver.ts` — Token resolution
- `src/lib/platform/tokenState.ts` — Token state management
- `src/lib/platform/types.ts` — Shared types
- `src/lib/platform/scopes.ts` — OAuth scopes

**Realtime System:**

- `src/lib/realtime/batcher.svelte.ts` — Event batching
- `src/lib/realtime/merge.ts` — Payload merging
- `src/lib/realtime/subscription.svelte.ts` — Subscription manager

**State Management:**

- `src/lib/stores/reactiveTable.svelte.ts` — Reactive table factory

**Database:**

- `src/lib/supabase/database.types.ts` — Generated types
- `src/lib/supabase/validateClaims.ts` — JWT validation

**Validation:**

- `src/lib/validation/auth.ts` — Auth validation schemas

**Routes:**

- Map all `+page.svelte`, `+page.ts`, `+page.server.ts` files
- Map all `+layout.svelte`, `+layout.ts`, `+layout.server.ts` files
- Map all `+server.ts` API endpoints

**2. Analyze file contents for:**

- Exported functions and their purposes
- OAuth flows and platform states
- Realtime patterns and retry logic
- Authentication guards and redirects
- Environment variable usage
- Type definitions and interfaces

### Phase 3: Documentation Gap Analysis

**Compare codebase state with documentation:**

**README.md Checklist:**

- [ ] All `package.json` scripts documented?
- [ ] All dependencies mentioned in stack section?
- [ ] Project structure diagram matches `src/` layout?
- [ ] All platform integrations listed with correct status?
- [ ] Environment variables table complete?
- [ ] Architecture section explains data flow?
- [ ] All screenshots in `.repo/screenshots/` referenced?
- [ ] Prerequisites up to date?
- [ ] Setup instructions accurate?

**AGENTS.md Checklist:**

- [ ] All dev commands listed?
- [ ] Stack section complete (versions, configs)?
- [ ] All key files in Key Files table?
- [ ] Environment variables table complete?
- [ ] MCP servers documented?
- [ ] Architecture section accurate (routing, data flow)?
- [ ] Auth flows documented?
- [ ] Platform linking states explained?
- [ ] Realtime pattern documented?
- [ ] Gotchas section complete?
- [ ] Workflows section up to date?
- [ ] Utility files documented (server, platform, realtime)?

### Phase 4: Systematic Updates

**1. Update README.md:**

**Features Section:**

- List all major features discovered in code
- Include platform support status
- Note unique capabilities (realtime, unified chat, etc.)

**Tech Stack:**

- List all major dependencies from `package.json`
- Include versions if important
- Note special configurations (Svelte 5 runes, Tailwind v4, etc.)

**Development Commands:**

- Copy ALL scripts from `package.json`
- Group logically (dev, build, db, test)
- Add descriptions for each command

**Environment Variables:**

- Extract from code (`$env/static/public`, `$env/static/private`)
- Create complete table with source and purpose
- Note which are safe to expose vs server-only

**Project Structure:**

- Create accurate tree diagram from `src/` exploration
- Include all major directories
- Add brief descriptions for each

**Architecture:**

- Document routing strategy (prerender, SSR, hybrid)
- Explain data flow (SSR → Realtime → Actions)
- Note authentication patterns
- Document platform linking states

**2. Update AGENTS.md:**

**Quick Reference:**

- List ALL dev commands with descriptions
- Include database commands
- Include test commands
- Note any special workflows

**Stack:**

- Document exact versions from `package.json`
- Note special configurations (runes, strict mode, etc.)
- Include build adapter info

**Environment Variables:**

- Complete table with all vars found in code
- Organize by source (public/private)
- Include purpose for each

**MCP Servers:**

- Document all configured MCP servers
- List available tools for each
- Note configuration method

**Architecture:**

- Routing strategy table
- Data flow diagrams
- Auth flow steps
- Platform linking states table
- Realtime pattern explanation

**Key Files:**

- Comprehensive table of all important files
- Include utilities, helpers, types
- Group by category (platform, server, realtime, etc.)

**Gotchas:**

- Document all edge cases found in code
- Include SSR vs browser gotchas
- Note Tailwind v4 differences
- List common pitfalls

**Workflows:**

- Document common development patterns
- Include testing workflows
- Note visual verification steps
- Document sub-agent usage patterns

### Phase 5: Verification

**1. Cross-reference documentation:**

- Ensure README and AGENTS.md are consistent
- Verify all file paths exist
- Check all command examples work
- Validate screenshot references

**2. Test commands:**

```bash
# Verify documented commands exist
pnpm dev
pnpm build
pnpm check
pnpm lint
pnpm format
pnpm db:generate
pnpm test:user:setup
# etc.
```

**3. Validate structure:**

```bash
# Verify documented files exist
ls src/lib/platform/
ls src/lib/server/
ls src/lib/realtime/
# etc.
```

## Tools to Use

### File Reading

- `read` — Read individual files
- `bash` — List directories, run git commands
- `glob` — Find files by pattern

### Code Analysis

- `grep` — Search for patterns (exports, imports, types)
- `task` — Delegate analysis to sub-agents for parallel processing

### Browser Verification

- `chrome-devtools_navigate_page` — Verify routes work
- `chrome-devtools_take_screenshot` — Capture new screenshots
- `chrome-devtools_resize_page` — Test responsive design

## Output Format

Provide a summary of changes made:

```markdown
## Documentation Updates Complete

### README.md Changes:

- Added X new test commands
- Updated platform status for Y
- Added environment variables table
- Added architecture section Z

### AGENTS.md Changes:

- Added N utility files to Key Files
- Updated Gotchas with M items
- Added workflow section for P

### Verified:

- All commands tested and working
- All file paths validated
- Screenshots referenced correctly
```

## Examples

### Example 1: Full Codebase Audit

**Trigger:** "Do a deep dive into this codebase and update all documentation"

**Process:**

1. Read `package.json` → Extract 20 scripts
2. Map `src/` → Find 50+ files
3. Read all key files → Understand architecture
4. Compare with docs → Find 30 gaps
5. Update README.md → Add 6 sections
6. Update AGENTS.md → Add 12 entries
7. Verify → Test 5 commands

**Result:** Documentation fully synchronized with codebase

### Example 2: Post-Refactor Sync

**Trigger:** "Just refactored the entire platform integration layer, update docs"

**Process:**

1. Analyze new file structure
2. Read new utility files
3. Identify removed files
4. Update Key Files tables
5. Update architecture sections
6. Remove obsolete references

**Result:** Docs reflect new architecture

## Guidelines

- **THOROUGH**: Read ALL relevant files
- **SYSTEMATIC**: Follow the phase workflow
- **ACCURATE**: Verify every claim
- **COMPLETE**: Don't skip sections
- **CURRENT**: Reflect exact codebase state

## Time Estimate

- Small projects (< 50 files): ~10-15 minutes
- Medium projects (50-200 files): ~20-30 minutes
- Large projects (200+ files): ~30-45 minutes

## When NOT to Use

- Quick incremental updates (use `update-docs` instead)
- Single file changes
- Minor bug fixes
- Documentation-only changes
