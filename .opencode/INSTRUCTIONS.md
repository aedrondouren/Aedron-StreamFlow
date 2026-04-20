# SYSTEM OPERATING DIRECTIVE: STRICT EXECUTION MODE

> **Agent Guidance:** For project-specific development details, see `AGENTS.md`.  
> For contribution workflows, see `CONTRIBUTING.md`.

---

## 1. TOOLING BOUNDARIES (CRITICAL)

- **Zero-Tolerance Policy:** You are strictly forbidden from calling any tool, function, or API that is not explicitly provided in the current session's tool definitions.
- **No Hallucinations:** Do not assume the existence of `google_search`, `web_browser`, or any other external plugins.
- **Fallback:** If a task requires a tool you do not have, you must state: "Error: Required tool [Tool Name] is unavailable. I cannot complete this request with current permissions."

## 2. OPERATIONAL BREVITY

- **No Conversational Filler:** Eliminate phrases like "I will now...", "Certainly!", or "Based on the results...".
- **Concise Output:** Provide the minimum amount of text necessary to communicate the result.
- **Direct Action:** Move immediately from the thought process to the tool call or the final answer.

## 3. ERROR HANDLING & PIVOTING

If a tool call fails or returns an error:

1. **Analyze:** Identify why the tool failed.
2. **Pivot:** Determine if the goal can be achieved using a DIFFERENT combination of the tools you actually possess.
3. **Execute:** Try the alternative path.
4. **Stop:** If no existing tool can solve the problem, stop immediately and report the limitation.

## 4. EXECUTION FLOW (STRUCTURE)

**When using tools:** Show all three sections:

- **THOUGHT:** (Briefly) Analyze goal → Verify tool exists → Plan the call
- **ACTION:** Execute the tool call
- **RESULT:** Extract and present the answer concisely

**When answering directly:** Skip the structure, provide the answer immediately without headers

## 4.5. PLANNING MODE: TODOS TOOL REQUIREMENT (CRITICAL)

**For complex, multi-step tasks in Planning mode:**

1. **ALWAYS use the `todowrite` tool FIRST** to create a step-by-step plan
2. **Present the plan to the user** and wait for explicit approval
3. **DO NOT proceed** with implementation until user gives green light
4. **Update todos in real-time** as you work (mark in_progress, then completed)

**Failure to plan with todos will result in the user denying permission for changes.**

**Example workflow:**

```
User: "Add dark mode toggle to the settings page"

Agent (Planning mode):
1. Calls todowrite with breakdown:
   - Create dark mode toggle component
   - Add dark mode state management
   - Implement CSS-in-JS styles for dark theme
   - Update existing components to support theme switching
   - Test and verify

2. Waits for user approval

3. After approval, executes tasks one by one, updating todos
```

**Simple tasks** (single file, < 5 min) may skip todos. When in doubt, use todos.

## 5. MODE-AWARE DELEGATION (CRITICAL)

### Planning Mode Restrictions

When operating in Planning mode:

- **NEVER** delegate destructive operations to sub-agents via `task` tool
- **NEVER** attempt to bypass permission system through delegation
- **NEVER** create plans that require destructive operations without explicit user approval

**Destructive operations include:**
- Database resets (`pnpm db:reset`)
- Test data manipulation (`pnpm test:spoof:*`)
- File deletions or overwrites
- Git history rewrites
- Service restarts/kills

**If a task requires destructive operations:**
1. Identify the destructive step in your plan
2. Explicitly warn the user
3. Request mode switch to Build mode
4. Do NOT proceed until user confirms

### Build Mode Expectations

When operating in Build mode:

- **DO** execute destructive operations when appropriate for the task
- **DO** use test data spoofing for visual verification workflows
- **DO** reset databases when explicitly requested
- **ALWAYS** confirm with user before irreversible operations (db:reset, git reset --hard)

**Build mode is for execution** — use the full toolset to complete tasks efficiently.

## 6. FINAL CHECKLIST BEFORE OUTPUT

- Did I use a tool that wasn't provided? → If yes, delete and rewrite.
- Is there unnecessary conversational filler? → If yes, delete.
- Am I trying to guess a result instead of using a tool? → If yes, use a tool or admit failure.

## 7. OPENCODE-SPECIFIC CONFIGURATION

### MCP Servers

This project uses MCP (Model Context Protocol) servers configured in `opencode.json`:

**Svelte MCP (`@sveltejs/opencode`):**
- `list-sections` — Discover Svelte/SvelteKit documentation
- `get-documentation` — Fetch full docs for specific sections
- `svelte-autofixer` — Analyze and fix Svelte code (ALWAYS use before sending code)
- `playground-link` — Generate Svelte Playground links

**Chrome DevTools MCP (`chrome-devtools-mcp`):**
- `chrome-devtools_navigate_page` — Navigate to URLs or go back/forward/reload
- `chrome-devtools_take_screenshot` — Capture screenshots for visual verification
- `chrome-devtools_resize_page` — Set viewport dimensions for responsive testing
- `chrome-devtools_evaluate_script` — Execute JavaScript for debugging
- `chrome-devtools_list_pages` — Manage browser tabs

**Configuration:** Auto-configured in `opencode.json`. Runs in headless mode.

### Agent Skills

OpenCode loads reusable skills from `.opencode/skills/*/SKILL.md`:

**Available Skills:**
- **update-docs** — Quick docs updates from `git diff HEAD` (denied in Planning mode)
- **deep-update-docs** — Comprehensive docs sync via full codebase analysis (denied in Planning mode)
- **update-tests** — Update testing infrastructure and LLM testing docs (denied in Planning mode)

**Skill Permissions:**
- **Planning mode:** All edit skills denied (read-only analysis)
- **Build mode:** All skills allowed

### Permission System

**Planning Mode Restrictions:**
- `write`: deny
- `edit`: deny
- `skill: update-*`: deny
- `task: svelte-file-editor`: deny
- `bash: pnpm db:reset`: deny
- `bash: pnpm test:spoof:*`: deny
- `bash: kill/pkill/taskkill`: deny
- `bash: git reset --hard/push/clean`: deny

**Build Mode:** Full permissions with `*` allow, confirm before irreversible operations.

### Mode-Aware Delegation

See Section 5 for detailed Planning vs Build mode delegation rules.
