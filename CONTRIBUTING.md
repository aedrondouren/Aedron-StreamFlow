# Contributing to Aedron StreamFlow

Thank you for your interest in contributing! This guide covers setup, development workflow, and best practices for both human contributors and AI assistants.

## Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** (`corepack enable`)
- **Supabase** project (local or hosted)

### Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/Aedron-StreamFlow.git
cd Aedron-StreamFlow

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable                          | Source                | Purpose                        |
| --------------------------------- | --------------------- | ------------------------------ |
| `PUBLIC_SUPABASE_URL`             | `$env/static/public`  | Supabase project URL           |
| `PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `$env/static/public`  | Supabase anon key              |
| `PUBLIC_TWITCH_CLIENT_ID`         | `$env/static/public`  | Twitch OAuth (safe to expose)  |
| `PRIVATE_TWITCH_CLIENT_SECRET`    | `$env/static/private` | Twitch OAuth (server-only)     |
| `PUBLIC_GOOGLE_CLIENT_ID`         | `$env/static/public`  | YouTube OAuth (safe to expose) |
| `PRIVATE_GOOGLE_CLIENT_SECRET`    | `$env/static/private` | YouTube OAuth (server-only)    |
| `PUBLIC_KICK_CLIENT_ID`           | `$env/static/public`  | Kick OAuth (safe to expose)    |
| `PRIVATE_KICK_CLIENT_SECRET`      | `$env/static/private` | Kick OAuth (server-only)       |
| `TEST_USER_EMAIL`                 | `.env` (auto-gen)     | Test user email for visual testing |
| `TEST_USER_PASSWORD`              | `.env` (auto-gen)     | Test user password for visual testing |
| `TEST_USER_ID`                    | `.env` (auto-gen)     | Test user UUID for quick reference |

### VS Code Extensions

When you open this project in VS Code, you'll be prompted to install recommended extensions:

- **Svelte for VS Code** — Svelte syntax highlighting and IntelliSense
- **Prettier** — Code formatting
- **ESLint** — Linting for JavaScript/TypeScript/Svelte
- **Tailwind CSS IntelliSense** — Autocomplete for Tailwind classes
- **Supabase** — Database management

### MCP Servers (Optional)

This project includes MCP (Model Context Protocol) configurations for enhanced AI assistance. These are optional for human contributors but useful when working with AI agents:

**For OpenCode users:** MCP servers auto-configure via `opencode.json`:

- GitHub MCP — GitHub operations
- Chrome DevTools MCP — Browser debugging
- Playwright MCP — Visual testing

**For VS Code/Cursor users:** Configure via IDE's MCP panel using packages listed above.

---

## 🔧 Development Commands

```bash
pnpm dev          # Start dev server with hot reload
pnpm check        # TypeScript type checking
pnpm lint         # Lint and format check
pnpm format       # Auto-format code
pnpm build        # Production build

# Database
pnpm db:generate  # Generate TypeScript types
pnpm db:push      # Push migrations to Supabase
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

## 📁 Project Structure

```
src/
├── lib/
│   ├── components/          # Reusable UI components (ThemeToggle, PlatformCard)
│   ├── platform/            # Platform OAuth and API integration
│   ├── realtime/            # Supabase Realtime utilities
│   ├── server/              # Server-side utilities (auth, platform linking)
│   ├── stores/              # Reactive state management
│   ├── supabase/            # Database types and helpers
│   └── validation/          # Validation schemas
├── params/                  # Route param constraints
├── routes/
│   ├── (protected)/         # Auth-required routes
│   │   ├── app/             # Dashboard and platform management
│   │   └── auth/            # Authentication flows
│   └── +page.svelte         # Landing page
├── app.css                  # Tailwind configuration
├── app.html                 # HTML template with theme script
└── hooks.server.ts          # Server-side auth guards
```

---

## 🏗️ Architecture

This project uses a **server-first approach with client-side enhancements**:

### Routing Strategy

| Route     | Purpose                                          |
| --------- | ------------------------------------------------ |
| `/`       | Static landing page (prerendered)                |
| `/app/*`  | Dashboard — SSR initial load, then Realtime sync |
| `/auth/*` | Authentication flows (signin, callbacks, logout) |

### Data Flow

1. **Server Load** — Initial data fetched server-side for fast first paint
2. **Client Hydration** — Browser subscribes to Supabase Realtime
3. **Updates** — User actions update immediately; other clients sync via Realtime

### Theme System

**Light/Dark/System themes** with automatic system preference detection, inline script to prevent FOUC, CSS-based switching via `data-theme` attributes, and LocalStorage persistence.

### Authentication & Platform Linking

**Four linking states:** `unlinked` → `managed_basic` → `managed_linked` or `manual_linked`. OAuth flows for signup/connect/upgrade with automatic token refresh. Manual linking available for platforms without OAuth support.

### Realtime Data Pattern

**Hybrid SSR + Realtime:** Server load for fast first paint, client subscriptions via `$effect()`, 50ms event batching, and exponential backoff retry logic [1s, 2s, 5s, 10s].

For detailed architecture docs and agent-specific patterns, see [AGENTS.md](AGENTS.md).

---

## Code Style

Automated tooling maintains consistency:

- **Tabs** for indentation (not spaces)
- **Single quotes** for strings
- **100 character** line width
- **Svelte 5 runes** required
- **Strict TypeScript** mode

Run `pnpm format` before committing to auto-fix issues.

---

## Pull Request Process

1. **Create a branch** from `supabase` (main development branch):

   ```bash
   git checkout supabase
   git pull origin supabase
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** with clear, focused commits

3. **Test your changes**:

   ```bash
   pnpm check && pnpm lint && pnpm build
   ```

4. **Push to your fork** and open a PR against `supabase`

5. **PR Requirements:**
   - All checks pass
   - Clear description of changes
   - Reference related issues

---

## Commit Message Format

Conventional commits:

```
feat: Add new feature
fix: Fix a bug
refactor: Code improvement without feature change
docs: Documentation changes
chore: Build process, dependencies, etc.
test: Adding or updating tests
```

Example: `feat: add YouTube OAuth integration`

---

## Code of Conduct

### Our Standards

We are committed to providing a welcoming and inspiring community for all.

**Expected behavior:**

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what's best for the community

**Unacceptable behavior:**

- Harassment, discrimination, or intimidation
- Trolling, insulting comments, or personal attacks
- Publishing others' private information without permission

### Enforcement

Report issues by opening an issue or contacting maintainers directly. All complaints are reviewed promptly. Maintainers can remove, edit, or reject contributions not aligned with this Code of Conduct.

---

## Security Policy

### Reporting Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

Instead, email: **aedronvt@gmail.com**

Include:

- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Suggested fixes (optional)

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 7 days
- **Fix and disclosure:** Timeline depends on severity

### Supported Versions

| Version                  | Supported |
| ------------------------ | --------- |
| Latest `supabase` branch | ✅        |
| Older commits            | ❌        |

### Security Best Practices

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive config
- Validate all user inputs on both client and server
- Follow the principle of least privilege
- Keep dependencies updated

---

## Questions?

- Open a GitHub issue for feature requests or bugs
- Start a discussion for questions or ideas
- Check existing issues before creating new ones

Thank you for contributing to Aedron StreamFlow!
