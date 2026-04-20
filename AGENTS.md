# AGENTS.md

Quick reference for AI agents working on this project.

> **Note:** For human contribution guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).
> For detailed technical documentation (stack, environment variables, architecture), see [SYSTEM.md](SYSTEM.md).

---

## MCP Servers

This project uses MCP (Model Context Protocol) servers for enhanced capabilities:

**Svelte MCP** — Svelte 5 and SvelteKit documentation, code analysis

- `list-sections` — Discover documentation sections (use FIRST)
- `get-documentation` — Fetch full docs for specific sections
- `svelte-autofixer` — Analyze and fix Svelte code issues (ALWAYS use before sending code)

**Chrome DevTools MCP** — Browser debugging, performance profiling, visual verification

- `chrome-devtools_navigate_page` — Navigate to URLs or go back/forward/reload
- `chrome-devtools_take_screenshot` — Capture screenshots for visual verification
- `chrome-devtools_resize_page` — Set viewport dimensions for responsive testing
- `chrome-devtools_evaluate_script` — Execute JavaScript (use for `window.getComputedStyle()` debugging)

**Note:** MCP configuration varies by IDE. Check your environment's MCP setup.

### Bits UI

Headless UI components for Svelte 5. Uses the [llms.txt standard](https://bits-ui.com/docs/llms) for LLM-friendly documentation.

**LLM Documentation Navigation:**

- **Root index**: https://bits-ui.com/llms.txt — Lists all available documentation pages
- **Schema explanation**: https://bits-ui.com/docs/llms/llms.txt — Explains the llms.txt format
- **Per-component**: Append `/llms.txt` to any component URL (e.g., `/docs/components/button/llms.txt`)
- **Full consolidated docs**: https://bits-ui.com/docs/llms.txt — Complete documentation in one file

**Workflow for Discovering Components:**

1. Fetch root index to see all available components: `https://bits-ui.com/llms.txt`
2. Fetch specific component docs: `https://bits-ui.com/docs/components/{component}/llms.txt`
3. Use `svelte-autofixer` to validate component usage before sending code
4. Add new component to barrel export: `src/lib/components/index.ts`
5. Import from centralized barrel: `import { Button, Tooltip } from '$lib/components'`

**Important:** All bits-ui components must be added to the barrel export file (`src/lib/components/index.ts`) before they can be imported. The barrel export is the single source of truth for UI component imports.

**Key Components:**

- `Button.Root` — Replace vanilla `<button>`, use `href` prop to render as `<a>`
- `Tooltip` — Hover information on UI elements
- `Avatar` — Platform profile images
- `Dialog` — Modals and overlays
- `Separator` — Visual dividers

**Usage Pattern:**

```svelte
<script>
	import { Button, Tooltip } from '$lib/components';
</script>

<!-- Button as link -->
<Button.Root href="/app/platforms" variant="default">Go to Platforms</Button.Root>

<!-- Tooltip -->
<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<Button.Root>Hover me</Button.Root>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Tooltip text</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
```

---

## Architecture

For detailed architecture documentation, see [SYSTEM.md](SYSTEM.md#architecture).

---

For development gotchas and edge cases, see [SYSTEM.md](SYSTEM.md#gotchas).

---

## Dev Server Protocol

**ALWAYS check if dev server is running before starting one:**

1. Navigate to `http://localhost:5173`
2. If navigation succeeds, server is running — proceed
3. If navigation fails, run `pnpm dev` and wait for startup
4. **Never start multiple server instances**

### Visual Verification

When making UI changes, verify using Chrome DevTools MCP. Non-vision models should use scripting-based validation.

**Quick Setup:**

```bash
pnpm test:visual:setup  # Creates test user + mock data
```

**Test Credentials** stored in `.env`:

- `TEST_USER_EMAIL` — Email for login
- `TEST_USER_PASSWORD` — Auto-generated secure password
- `TEST_USER_ID` — Supabase user UUID

**Cleanup:**

After visual testing, clean up test data:

```bash
pnpm test:user:cleanup  # Deletes test user, all platform data, and cleans .env
```

This removes:
- Test user account from Supabase Auth
- All `user_auth` entries for the test user
- All `user_info` entries for the test user
- `TEST_USER_*` credentials from `.env` file

---

### For Vision-Capable Models

Use Chrome DevTools MCP to navigate and take screenshots for visual verification.

**Verification Steps:**

1. **Check dev server status** — Navigate to `http://localhost:5173`. If it fails, run `pnpm dev` and wait.

2. **For protected routes (/app)**:
   - Navigate to `/auth/signin`
   - Fill in credentials and submit
   - Wait for redirect to `/app`

3. **Resize viewport** — Use `chrome-devtools_resize_page` for target device

4. **Navigate and screenshot** — Load route, capture for validation

5. **Screenshot locations**:
   - Temporary (validation): `.repo/temp/` — gitignored
   - Permanent (docs): `.repo/screenshots/` — committed

---

### For Non-Vision Models (Scripting-Based Validation)

Use `chrome-devtools_evaluate_script` to programmatically validate UI elements:

**1. Visibility & Layout Validation:**

```javascript
// Check if element is visible and properly laid out
const element = document.querySelector('[data-testid="my-component"]');
const styles = window.getComputedStyle(element);

// Visibility checks
console.assert(styles.display !== 'none', 'Element should be visible');
console.assert(styles.visibility === 'visible', 'Element should not be hidden');
console.assert(styles.opacity > 0, 'Element should not be transparent');

// Layout checks
console.assert(
	styles.position === 'relative' || styles.position === 'static',
	'Should use standard positioning'
);
console.assert(styles.width !== '0px', 'Element should have width');
console.assert(styles.height !== '0px', 'Element should have height');

// Return validation report
return {
	visible: styles.display !== 'none' && styles.opacity > 0,
	width: styles.width,
	height: styles.height,
	position: styles.position,
	display: styles.display,
	flexDirection: styles.flexDirection,
	hasClasses: element.className
};
```

**2. Responsive Layout Validation:**

```javascript
// Test at different viewports
const viewports = {
	mobile: { width: 375, height: 812 },
	tablet: { width: 768, height: 1024 },
	desktop: { width: 1440, height: 900 }
};

for (const [name, size] of Object.entries(viewports)) {
	// Resize page
	// Then validate layout changes
	const container = document.querySelector('[data-sidebar]');
	const styles = window.getComputedStyle(container);

	console.assert(
		name === 'mobile' ? styles.display === 'none' : styles.display !== 'none',
		`Sidebar should be ${name === 'mobile' ? 'hidden' : 'visible'} on ${name}`
	);
}
```

**3. Styling Validation:**

```javascript
const button = document.querySelector('button[data-testid="primary-action"]');
const styles = window.getComputedStyle(button);

// Check Tailwind classes applied correctly
console.assert(
	styles.backgroundColor === 'rgb(99, 102, 241)' || // primary-600
		styles.backgroundColor.includes('99, 102, 241'),
	'Button should have primary color background'
);
console.assert(styles.borderRadius === '0.375rem', 'Should have rounded-md corners');
console.assert(styles.fontWeight === '600', 'Should be semibold');
```

**4. Interaction Validation (Hover/Focus States):**

```javascript
// Check hover state exists
const button = document.querySelector('button');
const hoverStyles = window.getComputedStyle(button, ':hover');
const normalStyles = window.getComputedStyle(button);

console.assert(
	hoverStyles.backgroundColor !== normalStyles.backgroundColor ||
		hoverStyles.transform !== normalStyles.transform,
	'Button should have hover state changes'
);

// Check focus-visible for accessibility
const focusStyles = window.getComputedStyle(button, ':focus-visible');
console.assert(
	focusStyles.outlineWidth !== '0px' || focusStyles.boxShadow !== 'none',
	'Button should have focus indicator for accessibility'
);
```

**5. Animation/Transition Validation:**

```javascript
// Check if transitions are configured
const element = document.querySelector('.animated-element');
const styles = window.getComputedStyle(element);

console.assert(
	styles.transitionDuration !== '0s' && styles.transitionDuration !== '',
	'Element should have transition duration'
);

// Validate transition properties
const transitionProperties = [
	'transition-property',
	'transition-duration',
	'transition-timing-function'
].map((prop) => styles.getPropertyValue(prop));

console.log('Transition config:', transitionProperties);

// For transform-based animations
const transform = styles.transform;
console.assert(
	transform !== 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)',
	'Transform should be applied (or at least have default matrix)'
);
```

**6. Complete Validation Workflow:**

```javascript
// Comprehensive validation function
function validateComponent(selector, expectations) {
	const element = document.querySelector(selector);
	if (!element) {
		return { error: `Element not found: ${selector}` };
	}

	const styles = window.getComputedStyle(element);
	const rect = element.getBoundingClientRect();

	const results = {
		selector,
		found: true,
		visible: rect.width > 0 && rect.height > 0 && styles.opacity > 0,
		dimensions: { width: rect.width, height: rect.height },
		styles: {
			display: styles.display,
			position: styles.position,
			flexDirection: styles.flexDirection,
			backgroundColor: styles.backgroundColor,
			color: styles.color,
			borderRadius: styles.borderRadius,
			transition: styles.transition
		},
		classes: element.className,
		hasHover: styles.getPropertyValue('transition-duration') !== '0s',
		accessibility: {
			role: element.getAttribute('role'),
			ariaLabel: element.getAttribute('aria-label'),
			tabIndex: element.getAttribute('tabindex')
		}
	};

	// Validate expectations
	const errors = [];
	if (expectations.minWidth && rect.width < expectations.minWidth) {
		errors.push(`Width ${rect.width}px < expected ${expectations.minWidth}px`);
	}
	if (expectations.shouldHaveTransition && !results.hasHover) {
		errors.push('Expected transition but none found');
	}

	return { ...results, errors };
}

// Usage
const report = validateComponent('[data-sidebar]', {
	minWidth: 200,
	shouldHaveTransition: true
});
console.log('Validation report:', report);
```

**7. Automated Viewport Testing:**

Test all routes at mobile, tablet, and desktop sizes using the same workflow as visual verification:

```javascript
// Example: Test sidebar responsiveness across viewports
const viewports = [
	{ name: 'mobile', width: 375, height: 812 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'desktop', width: 1440, height: 900 }
];

for (const viewport of viewports) {
	// Resize to viewport
	// Navigate to route
	// Validate responsive behavior
	const sidebar = document.querySelector('[data-sidebar]');
	const styles = window.getComputedStyle(sidebar);

	console.assert(
		viewport.name === 'mobile' ? styles.display === 'none' : styles.display !== 'none',
		`Sidebar should be ${viewport.name === 'mobile' ? 'hidden' : 'visible'} on ${viewport.name}`
	);
}
```

---

For theme system internals, see [SYSTEM.md](SYSTEM.md#theme-system).

### Debugging Styling Issues

Use `chrome-devtools_evaluate_script` with `window.getComputedStyle(element)` to inspect actual computed styles when debugging CSS problems.

**Example: Debug why a button isn't visible**

```javascript
const button = document.querySelector('button');
const styles = window.getComputedStyle(button);
const rect = button.getBoundingClientRect();

	return {
		display: styles.display,
		visibility: styles.visibility,
		opacity: styles.opacity,
		width: rect.width,
		height: rect.height,
		position: styles.position,
		zIndex: styles.zIndex,
		transform: styles.transform,
		classes: button.className
	};
}
```

For development gotchas and edge cases, see [SYSTEM.md](SYSTEM.md#gotchas).
