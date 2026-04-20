# 🌊 Aedron StreamFlow

<p align="center">
  <em>One dashboard to rule all your streams</em>
</p>

<p align="center">
  <a href="https://kit.svelte.dev" target="_blank">
    <img src="https://img.shields.io/badge/SvelteKit-v2-FF3E00?logo=svelte" alt="SvelteKit">
  </a><!--
  --><a href="https://svelte.dev" target="_blank">
    <img src="https://img.shields.io/badge/Svelte-v5-FF3E00?logo=svelte" alt="Svelte 5">
  </a><!--
  --><a href="https://www.typescriptlang.org" target="_blank">
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript" alt="TypeScript">
  </a><!--
  --><a href="https://tailwindcss.com" target="_blank">
    <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss" alt="Tailwind">
  </a>
</p>
<p align="center">
  <a href="https://supabase.com" target="_blank">
    <img src="https://img.shields.io/badge/Supabase-v2-3ECF8E?logo=supabase" alt="Supabase">
  </a><!--
  --><a href="https://bits-ui.com" target="_blank">
    <img src="https://img.shields.io/badge/Bits_UI-v2-171717?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTEiIGhlaWdodD0iMTEiIHZpZXdCb3g9IjAgMCAxMSAxMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1LjkzNTU1IiBjeT0iNS45ODczIiByPSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA1LjkzNTU1IDUuOTg3MykiIGZpbGw9IiNGRkZGRkYiLz48L3N2Zz4=" alt="Bits UI">
  </a><!--
  --><a href="https://github.com/aedrondouren/Aedron-StreamFlow/blob/supabase/LICENSE" target="_blank">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  </a>
</p>

## 📑 Table of Contents

| Section | Links |
|---------|-------|
| 🎯 Overview | [Features](#-features) • [Screenshots](#-screenshots) • [Platforms](#-supported-platforms) |
| 🛠️ Setup | [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Prerequisites](#-prerequisites) |
| 📚 More | [Contributing](#-contributing) • [License](#-license) |

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
