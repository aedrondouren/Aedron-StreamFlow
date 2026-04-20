---
name: update-docs
description: Quick documentation updates based on recent commit changes
metadata:
  audience: agents
  workflow: documentation
---

## Purpose

This skill provides **fast, shallow documentation updates** by analyzing only the changes since the last commit. Use for incremental updates during active development.

## When to Use

Apply this skill for **quick updates** before committing:

- **Before git commit** — Ensure docs match staged changes
- Adding new features or fixes
- Adding/modifying npm scripts
- Changing file structure
- Updating screenshots or visual assets

**Trigger:** Run automatically before commits or manually when staging changes.

## Workflow

### Step 1: Analyze Changes Since Last Commit

```bash
# Get all changes (staged + unstaged) since last commit
git diff --name-only HEAD

# Get detailed diff for context
git diff HEAD
```

**Note:** This compares current working state (including unstaged changes) against the last commit, ensuring documentation captures ALL pending changes before you commit.

### Step 2: Update Documentation Based on Changes

**If `package.json` changed:**

- Check `scripts` object → Update README.md and AGENTS.md command tables
- Check `dependencies`/`devDependencies` → Update stack sections
- Check `version` → Update version references if needed

**If new files/directories added:**

- New `src/lib/` utilities → Add to AGENTS.md Key Files table
- New routes → Update routing strategy sections
- New config files → Update prerequisites or setup sections

**If files deleted:**

- Remove references from documentation

**If `.gitignore` patterns added:**

- Document new ignored patterns if relevant

### Step 3: Verify Consistency

- Ensure command examples match `package.json` scripts
- Verify file paths exist
- Check screenshot references match `.repo/screenshots/` contents

## Files to Update

### AGENTS.md (Quick Updates)

Update only the sections affected by recent changes:

- **Dev Commands** — If `package.json` scripts changed
- **Key Files** — If new utility files added
- **Gotchas** — If new edge cases discovered

### README.md (Quick Updates)

Update only affected sections:

- **Development Commands** — If scripts changed
- **Project Structure** — If directory structure changed
- **Features** — If new features added

### package.json (if required)

Update when:

- Adding new npm scripts
- Adding/removing dependencies
- Changing project metadata

### .gitignore (if required)

Update when new ignore patterns are needed.

## Screenshots (Quick Update)

If new screenshots added since last commit:

1. Verify files exist in `.repo/screenshots/`
2. Add to README.md screenshot gallery
3. Update captions as needed

## Examples

### Example 1: Just Committed New Test Scripts

**Git diff shows:** `package.json` added `test:spoof:kick` script

**Update:**

1. README.md — Add to Development Commands section
2. AGENTS.md — Add to Testing section

### Example 2: Just Added New Utility File

**Git diff shows:** New file `src/lib/platform/newAuth.ts`

**Update:**

1. AGENTS.md — Add to Key Files table
2. No README change needed (internal utility)

### Example 3: Just Added Screenshot

**Git diff shows:** New file `.repo/screenshots/new-feature.png`

**Update:**

1. README.md — Add screenshot to gallery with caption

## Guidelines

- **FAST**: Only analyze `git diff HEAD` (current state vs last commit)
- **SHALLOW**: Update only obviously affected sections
- **INCREMENTAL**: Trust that previous docs were correct
- **MINIMAL**: Don't refactor or reorganize, just add/update changed items
- **PRE-COMMIT**: Run before committing to keep docs in sync with code

## Limitations

This skill does **NOT**:

- Deep analysis of codebase structure
- Comprehensive documentation audits
- Major reorganizations or refactoring

For deep analysis, use `deep-update-docs` skill instead.

## Pre-Commit Integration

**Recommended workflow:**

```bash
# Make code changes
# ...

# Update documentation based on changes
# (use update-docs skill)

# Verify changes
git status

# Commit code + docs together
git add .
git commit -m "feat: add new feature"
```

This ensures documentation and code are always committed together, preventing drift.
