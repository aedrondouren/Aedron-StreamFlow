---
name: update-docs
description: Instructions for updating AGENTS.md, README.md, package.json, and .gitignore when code changes require documentation updates
metadata:
  audience: agents
  workflow: documentation
---

## Purpose

This skill instructs agents to keep project documentation synchronized with codebase changes.

## When to Use

Apply this skill when:

- Adding new features or architectural patterns
- Changing project structure or workflows
- Adding/modifying npm scripts or dependencies
- Creating new file patterns that should be ignored
- Updating visual assets (screenshots, diagrams)

## Files to Update

### AGENTS.md

Update when adding:

- New workflows or patterns
- Architectural changes
- Gotchas or edge cases discovered
- MCP server configurations
- Environment variable changes
- Routing or data flow modifications

### README.md

Update when adding:

- New features to the feature matrix
- New supported platforms
- Screenshots showing new UI
- Changes to project structure
- New prerequisites or setup steps
- Changes to development commands

### package.json (if required)

Update when:

- Adding new npm scripts (build, test, dev, etc.)
- Adding/removing dependencies
- Changing project metadata (version, description, keywords)
- Adding new engine requirements

### .gitignore (if required)

Update when:

- New cache or output directories are created
- New tooling generates temporary files
- New environment file patterns are introduced
- New build artifacts need exclusion

## Screenshots

### When to Update Screenshots

Update screenshots in README.md when:

- UI components or layouts change significantly
- New features are added that have visual components
- Design updates (colors, typography, spacing)
- Adding new pages or routes
- Authentication flows change

### Capturing Screenshots with Chrome DevTools

Use Chrome DevTools MCP tools to capture screenshots:

1. **Navigate to the page:**

   ```
   chrome-devtools_navigate_page — Navigate to URLs or go back/forward/reload
   ```

2. **Set viewport for responsive testing:**

   ```
   chrome-devtools_resize_page — Set viewport dimensions
   ```

   - Mobile: 375-414px width
   - Tablet: 768px width
   - Desktop: 1440px+ width

3. **Take the screenshot:**
   ```
   chrome-devtools_take_screenshot — Capture screenshots
   ```

### Screenshot Storage Locations

- **Permanent screenshots** (for README.md): `.repo/screenshots/`
  - Committed to repository
  - Used in documentation
  - Examples: `dashboard.png`, `signin-page.png`

- **Temporary screenshots** (for validation): `.opencode/temp/`
  - Gitignored, for iterative testing
  - Deleted after verification
  - Examples: `sidebar-mobile-test.png`

### Naming Conventions

- Use lowercase with hyphens
- Include viewport if relevant: `component-mobile.png`, `component-desktop.png`
- Be descriptive: `auth-flow-step2.png` not `screenshot2.png`

### Updating README.md

When adding new screenshots:

1. Save to `.repo/screenshots/`
2. Update image path in README.md:
   ```markdown
   <img src=".repo/screenshots/new-feature.png" alt="New Feature" width="600"/>
   ```

## Examples

### Example 1: Adding a New Database Script

**Change:** Adding `db:migrate` script

**Files to update:**

1. `AGENTS.md` — Add new script to Dev Commands section
2. `package.json` — Add script to `scripts` object
3. `README.md` — Document the new command in Quick Start

### Example 2: Adding New Visual Assets

**Change:** Taking screenshots for documentation

**Files to update:**

1. `README.md` — Update image paths to point to `.repo/screenshots/`
2. No changes to `package.json` or `.gitignore` (paths already configured)

### Example 3: Changing Build Output Directory

**Change:** SvelteKit adapter output changed from `.output/` to `dist/`

**Files to update:**

1. `AGENTS.md` — Update Build & Output section
2. `.gitignore` — Change `.output` to `dist`
3. `package.json` — No changes needed (build command unchanged)

## Guidelines

- Only update files if they actually require changes
- Don't modify files "just in case" — verify necessity first
- Follow existing formatting and style conventions
- Update all relevant sections within a file (e.g., both Quick Reference and Workflows in AGENTS.md)
- Keep documentation concise but complete
