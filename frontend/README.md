# InsureAI Frontend

AI-powered insurance assistant chat interface built with React, TypeScript, and Vite.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** with `@tailwindcss/typography` for markdown prose styling
- **Radix UI** for accessible primitives (ScrollArea, Dialog, Command, Popover)
- **Zustand** for state management (auth, chat, UI stores)
- **React Query** for server state
- **Framer Motion** for animations
- **react-markdown** for rendering AI response markdown
- **Lucide React** for icons
- **Axios** for API calls

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── api/              # API integration (auth, chat, HTTP client)
├── components/
│   ├── auth/         # Authentication components
│   ├── chat/         # Chat UI (sidebar, messages, input, quick actions)
│   ├── common/       # Shared utilities (theme toggle, skip link)
│   ├── landing/      # Landing page components
│   ├── layout/       # Layout components
│   └── ui/           # shadcn/ui base components
├── pages/            # Route pages (Chat, Login, Landing)
├── stores/           # Zustand stores (auth, chat, UI)
├── types/            # TypeScript type definitions
├── lib/              # Utility functions
└── index.css         # Global styles + Tailwind theme
```

## Features

- Personalized welcome greeting with user name and policy info
- Multi-agent chat with agent badges (Policy, Claims, Billing, FAQ, Auto Specialist)
- Markdown rendering in assistant messages (bold, lists, code blocks, etc.)
- Suggested topic quick actions in sidebar
- Dark mode support
- Guardrail notices for blocked content
- Agent trace panel showing tool calls
- Mobile-responsive layout with collapsible sidebar
