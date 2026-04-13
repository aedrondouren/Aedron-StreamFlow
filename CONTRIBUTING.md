# Contributing to Aedron StreamFlow

Thank you for your interest in contributing! This guide covers setup, development workflow, and best practices for both human contributors and AI assistants.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (run `corepack enable` to enable)
- Supabase account (for testing auth features)

### Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/Aedron-StreamFlow.git
cd Aedron-StreamFlow

# Install dependencies
pnpm install

# Environment setup
cp .env.example .env
# Edit .env with your credentials
```

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

## Development Workflow

```bash
pnpm dev          # Start development server
pnpm check        # TypeScript type checking
pnpm lint         # Lint and format check
pnpm format       # Auto-format code
pnpm build        # Production build test
```

---

## Project Architecture

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

### Tech Stack Highlights

- **SvelteKit 2** with **Svelte 5 runes** (`$state`, `$derived`, `$effect`)
- **TypeScript** in strict mode
- **Tailwind CSS v4** (config in CSS, not JS)
- **Supabase** — Auth, database, and realtime subscriptions

For detailed architecture docs, agent-specific patterns, and MCP usage, see [AGENTS.md](AGENTS.md).

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
