# Contributing to Aedron StreamFlow

Thank you for your interest in contributing! This document will guide you through the process.

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

## Development Workflow

```bash
pnpm dev          # Start development server
pnpm check        # TypeScript type checking
pnpm lint         # Lint and format check
pnpm format       # Auto-format code
pnpm build        # Production build test
```

## Code Style

We use automated tooling to maintain consistency:

- **Tabs** for indentation (not spaces)
- **Single quotes** for strings
- **100 character** line width
- **Svelte 5 runes** required (`$state`, `$derived`, `$effect`, etc.)
- **Strict TypeScript** mode enabled

Run `pnpm format` before committing to auto-fix style issues.

## Pull Request Process

1. **Create a branch** from `supabase` (our main development branch)

   ```bash
   git checkout supabase
   git pull origin supabase
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** with clear, focused commits

3. **Test your changes**

   ```bash
   pnpm check && pnpm lint && pnpm build
   ```

4. **Push to your fork** and open a PR against the `supabase` branch

5. **PR Requirements:**
   - All checks must pass
   - Include description of what changed and why
   - Reference any related issues

## Commit Message Format

We follow conventional commits:

```
feat: Add new feature
fix: Fix a bug
refactor: Code improvement without feature change
docs: Documentation changes
chore: Build process, dependencies, etc.
test: Adding or updating tests
```

Example: `feat: add YouTube OAuth integration`

## Code of Conduct

### Our Standards

We are committed to providing a welcoming and inspiring community for all.

**Expected behavior:**

- Be respectful and inclusive in all interactions
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what is best for the community and users

**Unacceptable behavior:**

- Harassment, discrimination, or intimidation of any kind
- Trolling, insulting/derogatory comments, or personal attacks
- Publishing others' private information without permission
- Other conduct that could reasonably be considered inappropriate

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by opening an issue or contacting the maintainers directly. All complaints will be reviewed and investigated promptly and fairly.

Maintainers have the right and responsibility to remove, edit, or reject contributions that are not aligned with this Code of Conduct.

## Security Policy

### Reporting Vulnerabilities

**DO NOT** open public issues for security vulnerabilities.

Instead, please email: **aedronvt@gmail.com**

Include:

- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact
- Any suggested fixes (optional)

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Initial assessment:** Within 7 days
- **Fix and disclosure:** Timeline depends on severity, but we prioritize security issues

### Supported Versions

| Version                  | Supported |
| ------------------------ | --------- |
| Latest `supabase` branch | ✅        |
| Older commits            | ❌        |

### Security Best Practices for Contributors

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive configuration
- Validate all user inputs on both client and server
- Follow the principle of least privilege
- Keep dependencies updated

## Questions?

- Open a GitHub issue for feature requests or bugs
- Start a discussion for questions or ideas
- Check existing issues before creating new ones

Thank you for contributing to Aedron StreamFlow!
