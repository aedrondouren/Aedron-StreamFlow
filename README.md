# Aedron StreamFlow

Unified Streaming and Social platform manager for content creator.

## Key Features

- **Unified controls**: Information like Title, Descriptions and Tags can be synced accross platforms.
- **Unified chat**: Creators can see all their chats in one place with a powerful unified chat. They can filter by platform and isolate specific users when interacting with their community.
- **Configurable overlays**: Creators can now created unified overlays with configurable views. Chat and alerts elements will include all platforms by default, but following platforms' TOS, one can chose which platform should a view display in recording softwares. Common use case would be a Twitch inclusive view as they do not allow other platforms' content from being displayed.
- **Live data updates**: Profile information syncs in real-time across all connected clients using Supabase Realtime

## Supported Platforms

- Twitch
- Kick
- YouTube Live

### Future support

- TikTok
- Instagram
- X
- YouTube Video & Shorts

## Tech Stack

- **SvelteKit 2** with Svelte 5 runes
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **Supabase** (auth, database, realtime)

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (run `corepack enable` to enable)
- Supabase project (or use the hosted one)

### Installation

```bash
# Clone the repository
git clone https://github.com/aedrondouren/Aedron-StreamFlow.git
cd Aedron-StreamFlow

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env
```

### Environment Variables

Edit `.env` with your credentials:

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
PUBLIC_TWITCH_CLIENT_ID=your-twitch-client-id
PRIVATE_TWITCH_CLIENT_SECRET=your-twitch-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
```

### Development

```bash
pnpm dev          # Start dev server at http://localhost:5173
pnpm check        # Type-check
pnpm lint         # Lint and format check
pnpm format       # Format code
```

### Database

```bash
pnpm db:generate  # Generate TypeScript types from Supabase
pnpm db:push      # Push migrations to Supabase
```

## Project Structure

```
src/
├── lib/
│   ├── platform/      # Platform OAuth and API utilities
│   ├── realtime/      # Supabase Realtime utilities
│   ├── stores/        # Reactive state stores
│   └── supabase/      # Supabase types and helpers
├── routes/
│   ├── (protected)/  # Auth-protected routes
│   │   ├── app/       # Dashboard and platforms
│   │   └── auth/       # Auth flows and callbacks
│   └── +page.svelte   # Landing page
├── hooks.server.ts    # Auth guards and Supabase client
└── app.css           # Tailwind imports
```

## Architecture

The app uses a server-first approach with client-side enhancements:

- **SSR**: Pages load initial data server-side for fast first paint
- **Realtime**: Client subscribes to database changes for live updates
- **Hybrid updates**: User actions return data immediately; other clients receive updates via Realtime

## License

MIT
