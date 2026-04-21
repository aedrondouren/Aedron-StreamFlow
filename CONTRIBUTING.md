# Contributing to Aedron StreamFlow

Thank you for your interest in contributing! This guide covers setup, development workflow, and best practices for both human contributors and AI assistants.

## Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** (`corepack enable`)
- **Supabase** project (local or hosted)

### Setup

```bash
# 1. Fork this repository on GitHub (click "Fork" button in top-right)

# 2. Clone your fork:
git clone https://github.com/YOUR_USERNAME/Aedron-StreamFlow.git
cd Aedron-StreamFlow

# 3. Add upstream remote (one-time setup to track main repo):
git remote add upstream https://github.com/aedrondouren/Aedron-StreamFlow.git

# 4. Install dependencies:
pnpm install

# 5. Setup environment:
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 🔐 Environment Variables

See [SYSTEM.md](SYSTEM.md#environment-variables) for the complete list of environment variables.

### VS Code Extensions

When you open this project in VS Code, you'll be prompted to install recommended extensions:

- **Svelte for VS Code** (`svelte.svelte-vscode`) — Svelte syntax highlighting and IntelliSense
- **Prettier - Code formatter** (`esbenp.prettier-vscode`) — Code formatting
- **ESLint** (`dbaeumer.vscode-eslint`) — Linting for JavaScript/TypeScript/Svelte
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) — Autocomplete for Tailwind classes

### MCP Servers (Optional)

This project includes MCP (Model Context Protocol) configurations for enhanced AI assistance. These are optional for human contributors but useful when working with AI agents:

**For OpenCode users:** MCP servers auto-configure via `opencode.json`:

- **Svelte MCP** (`@sveltejs/opencode`) — Svelte 5 and SvelteKit documentation, code analysis
- **Chrome DevTools MCP** (`chrome-devtools-mcp`) — Browser debugging, performance profiling, visual verification

**For VS Code/Cursor users:** Configure via IDE's MCP panel using the packages listed above.

### Agent Skills (OpenCode)

OpenCode loads reusable skills from `.opencode/skills/*/SKILL.md`:

- **update-docs** — Quick documentation updates based on recent commit changes
- **deep-update-docs** — Comprehensive documentation sync through full codebase analysis
- **update-tests** — Update testing infrastructure and LLM testing documentation

**Skill Permissions:**

- **Planning mode:** All edit skills denied (read-only analysis)
- **Build mode:** All skills allowed

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

For detailed architecture documentation, see [SYSTEM.md](SYSTEM.md#architecture).

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

## Keeping Your Fork in Sync

Before starting new work, sync your fork with the latest changes from the main repository:

```bash
# Fetch latest changes from upstream (main repo)
git fetch upstream

# Checkout main branch
git checkout main

# Merge upstream changes into your local main
git merge upstream/main

# Push updated main to your fork
git push origin main
```

This ensures your feature branches are based on the latest code.

---

## Pull Request Process

1. **Sync your fork** (see "Keeping Your Fork in Sync" above)

2. **Create a feature branch**:

   ```bash
   git checkout -b feature/descriptive-name
   ```

3. **Make changes** with clear, focused commits

4. **Test your changes**:

   ```bash
   pnpm check && pnpm lint && pnpm build
   ```

5. **Push to your fork**:

   ```bash
   git push -u origin feature/descriptive-name
   ```

6. **Open a Pull Request**:
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - **Base repository:** `aedrondouren/Aedron-StreamFlow`
   - **Base branch:** `main`
   - **Head repository:** `YOUR_USERNAME/Aedron-StreamFlow`
   - **Compare branch:** `feature/descriptive-name`
   - Fill in the PR description

7. **PR Requirements:**
   - All checks pass
   - Clear description of changes
   - Reference related issues (if applicable)

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

| Version           | Supported |
| ----------------- | --------- |
| Latest `main` branch | ✅        |
| Older commits     | ❌        |

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
