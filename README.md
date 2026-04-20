# 🌊 Aedron StreamFlow

<p align="center">
  <em>One dashboard to rule all your streams</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/SvelteKit-2.0-FF3E00?logo=svelte" alt="SvelteKit">
  <img src="https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte" alt="Svelte 5">
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Supabase-Realtime-3ECF8E?logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
</p>

---

## ✨ Features

<table>
  <tr>
    <td align="center" width="60">🎮</td>
    <td><strong>Unified Controls</strong><br/>Sync titles, descriptions, and tags across all platforms instantly</td>
  </tr>
  <tr>
    <td align="center">💬</td>
    <td><strong>Unified Chat</strong><br/>View all platform chats in one place with smart filtering</td>
  </tr>
  <tr>
    <td align="center">🎨</td>
    <td><strong>Smart Overlays</strong><br/>Platform-specific views for recording software</td>
  </tr>
  <tr>
    <td align="center">⚡</td>
    <td><strong>Live Updates</strong><br/>Real-time sync across all your devices</td>
  </tr>
</table>

## 📸 Screenshots

> **Note:** Screenshots show the dark theme. The application supports light, dark, and system theme modes with automatic detection.

<p align="center">
  <img src=".repo/screenshots/landing-page.png" alt="Landing Page" width="600"/>
  <br/>
  <em>Professional landing page showcasing features and supported platforms</em>
</p>

<p align="center">
  <img src=".repo/screenshots/signin-page.png" alt="Sign In" width="600"/>
  <br/>
  <em>Secure authentication with email and OAuth</em>
</p>

<p align="center">
  <img src=".repo/screenshots/signup-page.png" alt="Sign Up" width="600"/>
  <br/>
  <em>Simple account creation with password confirmation</em>
</p>

<p align="center">
  <img src=".repo/screenshots/dashboard.png" alt="Dashboard" width="600"/>
  <br/>
  <em>Unified dashboard with real-time streaming stats</em>
</p>

<p align="center">
  <img src=".repo/screenshots/platforms-page.png" alt="Platform Management - Connected" width="600"/>
  <br/>
  <em>Platform management with connected Twitch account</em>
</p>

<p align="center">
  <img src=".repo/screenshots/platforms-page-disconnected.png" alt="Platform Management - Disconnected" width="600"/>
  <br/>
  <em>Platform management showing available platforms to connect</em>
</p>

<p align="center">
  <img src=".repo/screenshots/platforms-multi-connected.png" alt="Platform Management - Multiple Connected" width="600"/>
  <br/>
  <em>Multiple platforms connected with profile information</em>
</p>

<p align="center">
  <img src=".repo/screenshots/platforms-twitch-basic.png" alt="Platform Management - Twitch Basic State" width="600"/>
  <br/>
  <em>Platform showing managed_basic state with upgrade prompt</em>
</p>

<p align="center">
  <img src=".repo/screenshots/oauth-prompt-twitch-signup.png" alt="OAuth Prompt - Signup Flow" width="600"/>
  <br/>
  <em>Initial OAuth prompt during signup with optional linking</em>
</p>

<p align="center">
  <img src=".repo/screenshots/oauth-prompt-twitch-connect.png" alt="OAuth Prompt - Connect Flow" width="600"/>
  <br/>
  <em>Platform connection with OAuth vs Manual linking comparison</em>
</p>

<p align="center">
  <img src=".repo/screenshots/oauth-prompt-twitch-upgrade.png" alt="OAuth Prompt - Upgrade Flow" width="600"/>
  <br/>
  <em>Upgrading from basic authentication to full platform access</em>
</p>

## 🎯 Supported Platforms

| Platform | Status   | Notes                                              |
| -------- | -------- | -------------------------------------------------- |
| Twitch   | ✅ Full  | Complete OAuth with managed & manual linking       |
| YouTube  | ⚡ OAuth | Google OAuth complete, API integration in progress |
| Kick     | 🚧 WIP   | OAuth/API integration in development               |

**Coming Soon:** TikTok Live, Instagram Live, X (Twitter) Spaces, YouTube Video & Shorts

## 💻 Tech Stack

- **⚡ SvelteKit 2** — Modern web framework with Svelte 5 runes
- **🔷 TypeScript** — Strict mode for type safety
- **🎨 Tailwind CSS v4** — Utility-first styling with custom theme variants
- **🧩 bits-ui** — Headless UI components for accessibility
- **🗄️ Supabase** — Auth, database, and realtime subscriptions
- **🌓 Theme System** — Light/dark/system themes with automatic system preference detection

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/aedrondouren/Aedron-StreamFlow.git
cd Aedron-StreamFlow

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) and you're ready to go!

## 📋 Prerequisites

- **Node.js** 20+
- **pnpm** (`corepack enable`)
- **Supabase** project (local or hosted)

## 🔐 Environment Variables

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
```

## 📁 Project Structure

```
src/
├── lib/
│   ├── platform/      # Platform OAuth and API integration
│   ├── realtime/      # Supabase Realtime utilities
│   ├── stores/        # Reactive state management
│   └── supabase/      # Types and database helpers
├── routes/
│   ├── (protected)/   # Auth-required routes
│   │   ├── app/       # Dashboard and platform management
│   │   └── auth/      # Authentication flows
│   └── +page.svelte   # Landing page
├── hooks.server.ts    # Server-side auth guards
└── app.css           # Tailwind configuration
```

## 🏗️ Architecture

**Server-first with client-side enhancements:**

1. **SSR** — Initial data loaded server-side for fast first paint
2. **Realtime** — Client subscribes to database changes via Supabase
3. **Hybrid** — Actions return immediately; other clients sync in real-time

### Theme System

**Light/Dark/System themes with automatic detection:**

- **Inline script** in `src/app.html` prevents FOUC (Flash of Unstyled Content)
- **CSS-based switching** using `data-theme` and `data-system-theme` attributes
- **System preference detection** via `prefers-color-scheme` media query
- **LocalStorage persistence** for user theme preference

**Key Files:**

- `src/app.html` — Inline theme initialization script
- `src/app.css` — Tailwind dark mode variant with `@custom-variant`
- `src/lib/stores/theme.svelte.ts` — Theme utilities (SSR-safe)
- `src/lib/components/ThemeToggle.svelte` — Theme toggle UI component

**CSS Variants:**

```css
@custom-variant dark (&:where(:root[data-theme=dark], :root[data-theme=dark] *, :root[data-theme=system][data-system-theme=dark], :root[data-theme=system][data-system-theme=dark] *));
```

**Custom Theme Variants:** Use `theme-light`, `theme-dark`, `theme-system` for conditional rendering:

```svelte
<span class="hidden theme-light:inline">Light icon</span>
<span class="hidden theme-dark:inline">Dark icon</span>
<span class="hidden theme-system:inline">System icon</span>
```

### Authentication & Platform Linking

**OAuth Prompt Flows** (`/auth/oauth-prompt`):

- **`signup`** — Initial signup flow with optional platform linking
- **`connect`** — Explicit platform connection with OAuth vs Manual comparison
- **`upgrade`** — Upgrading from `managed_basic` to `managed_linked` state

**Platform Linking States:**

| State            | Description                       | UI Behavior                        |
| ---------------- | --------------------------------- | ---------------------------------- |
| `unlinked`       | No platform connection            | Show "Connect [Platform]" button   |
| `managed_basic`  | OAuth signup, minimal permissions | Show ⚠️ warning + "Complete Setup" |
| `managed_linked` | Full OAuth with all permissions   | Show profile + "Disconnect"        |
| `manual_linked`  | Manually entered tokens/API keys  | Show profile + "Disconnect"        |

**Manual Platform Linking:**

Manual linking allows users to connect platforms by directly entering credentials (useful for platforms without OAuth support):

- `src/lib/server/platformLinking/manualLink.ts` — Utilities for manual credential storage
- `savePlatformAuth()` — Saves platform authentication data to database
- `savePlatformUserInfo()` — Saves platform user profile data
- `isPlatformLinked()` — Checks if platform is already linked

**Token Management:**

The application handles OAuth token refresh automatically:

- `src/lib/platform/tokenResolver.ts` — Resolves tokens for API calls with caching
- `src/lib/platform/tokenRefresher.ts` — Refreshes expired tokens
- `src/lib/platform/tokenState.ts` — Manages platform linking state transitions

### Realtime Data Pattern

**Hybrid SSR + Realtime synchronization:**

1. **Server Load** — Fast first paint with server-fetched data
2. **Client Subscription** — `$effect()` subscribes to Realtime on mount
3. **Batched Updates** — 50ms window for rapid changes
4. **Retry Logic** — Exponential backoff [1s, 2s, 5s, 10s] with manual retry

**Key Utilities:**

- `src/lib/realtime/batcher.svelte.ts` — Batches rapid events (50ms window)
- `src/lib/realtime/merge.ts` — Merges realtime payloads with O(n) Map-based algorithm
- `src/lib/realtime/subscription.svelte.ts` — Subscription manager with exponential backoff
- `src/lib/stores/reactiveTable.svelte.ts` — Reactive table factory with auth state awareness

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Setup instructions
- Development workflow
- Code style guidelines
- Pull request process

## 📜 License

MIT © [Aedron](https://github.com/aedrondouren)

---

<p align="center">
  <em>Built with ❤️ for content creators</em>
</p>
