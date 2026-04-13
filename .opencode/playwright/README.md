# Playwright Assets

Visual verification workflow and screenshot asset management for Playwright MCP.

---

## Visual Verification Workflow

When making UI changes, you MUST verify the visual result using the Playwright MCP.

### Setup (run once per environment)

```bash
pnpm test:visual:setup    # Creates test user + mock Twitch data
```

This creates:

- Test user: `test@email.test` (password saved in `.env`)
- Mock Twitch connection: @TestUser (visual only, non-functional)

### Test Credentials

Stored in `.env` (gitignored, never committed):

- `TEST_USER_EMAIL` — Email for login
- `TEST_USER_PASSWORD` — Auto-generated secure password
- `TEST_USER_ID` — Supabase user UUID

### Verification Steps

1. **Check dev server status** — Navigate to `http://localhost:5173`. If it fails, run `pnpm dev` and wait.

2. **For protected routes (/app)**:
   - Navigate to `/auth/signin`
   - Fill in credentials from `TEST_USER_EMAIL` and `TEST_USER_PASSWORD`
   - Submit and wait for redirect to `/app`

3. **Confirm viewport** — Ask the user or check context:
   - Mobile: ~375-414px width
   - Tablet: ~768px width
   - Desktop: ~1440px+ width (default)

4. **Match viewport** — Use `playwright_browser_resize` to set dimensions

5. **Navigate to route** — Use `playwright_browser_navigate` to load the page

6. **Take screenshots**:
   - **UI validation** (temporary): `.opencode/playwright/temp/component-state.png`
   - **Documentation** (permanent): `.opencode/playwright/component-final.png`

7. **Iterate** — Adjust and re-verify if results don't match expectations

### Example Workflow

```
User: "Make this card component responsive for mobile"

Agent: I'll update the card component for mobile. First, let me verify
at mobile viewport.
[Check dev server status - attempt navigation to localhost:5173]
[If not running: pnpm dev]
[Resize browser to mobile viewport - 375px width]
[Navigate to /auth/signin and login with test credentials]
[Navigate to /app]
[Take screenshot to verify changes]
```

---

## Screenshot Asset Management

### Directory Structure

```
.opencode/playwright/
├── README.md          # This file
├── temp/              # UI validation screenshots (gitignored)
└── [other assets]     # Permanent documentation screenshots
```

### UI Validation Screenshots (temp/)

For iterative testing and debugging:

- **Location**: `.opencode/playwright/temp/`
- **Purpose**: Iterative testing, validation, debugging
- **Lifespan**: Temporary, clean up periodically
- **Naming**: Descriptive but concise
  - ✅ Good: `sidebar-collapsed.png`, `dashboard-mobile.png`
  - ❌ Avoid: `screenshot1.png`, `test.png`

**Example:**

```javascript
await page.screenshot({
	path: '.opencode/playwright/temp/sidebar-expanded.png'
});
```

### Permanent Assets (root folder)

For README documentation, PRs, or references:

- **Location**: `.opencode/playwright/`
- **Purpose**: Documentation, visual references
- **Lifespan**: Permanent, committed to repository
- **Naming**: Clear context and purpose
  - ✅ Good: `dashboard-overview.png`, `auth-flow-diagram.png`

**Example:**

```javascript
await page.screenshot({
	path: '.opencode/playwright/dashboard-final.png'
});
```

### Cleanup

The `temp/` folder is gitignored. Clean periodically:

```bash
# Clean all temp screenshots
rm .opencode/playwright/temp/*.png
```

### Best Practices

1. **Use descriptive filenames** — Future you will thank you
2. **Keep temp/ clean** — Delete after verification
3. **Commit only permanent assets** — Don't commit temp/ contents
4. **Use consistent naming** — Component + state + optional context
