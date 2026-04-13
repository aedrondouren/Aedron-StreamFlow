# Playwright Assets

Directory structure and guidelines for Playwright MCP screenshots and assets.

## Directory Structure

```
.opencode/playwright/
├── README.md          # This file
├── temp/              # UI validation screenshots (gitignored)
└── [other assets]     # Permanent documentation screenshots
```

## Usage Guidelines

### UI Validation Screenshots (temp/)

When verifying UI changes with Playwright MCP:

- **Location**: `.opencode/playwright/temp/`
- **Purpose**: Iterative testing, validation, debugging
- **Lifespan**: Temporary, can be cleaned up periodically
- **Naming**: Descriptive but concise
  - Good: `sidebar-collapsed.png`, `dashboard-mobile.png`
  - Avoid: `screenshot1.png`, `test.png`

**Example**:

```javascript
await page.screenshot({
	path: '.opencode/playwright/temp/sidebar-expanded.png'
});
```

### Permanent Assets (root folder)

For README documentation, PR descriptions, or other permanent uses:

- **Location**: `.opencode/playwright/`
- **Purpose**: Documentation, visual references
- **Lifespan**: Permanent, committed to repository
- **Naming**: Clear context and purpose
  - Good: `dashboard-overview.png`, `auth-flow-diagram.png`

**Example**:

```javascript
await page.screenshot({
	path: '.opencode/playwright/dashboard-final.png'
});
```

## Cleanup

The `temp/` folder is gitignored and should be cleaned periodically:

```bash
# Clean all temp screenshots
rm .opencode/playwright/temp/*.png
```

## Best Practices

1. **Always use descriptive filenames** - Future you will thank you
2. **Keep temp/ clean** - Delete screenshots after verification
3. **Commit only permanent assets** - Don't commit temp/ contents
4. **Use consistent naming** - Component + state + optional context
