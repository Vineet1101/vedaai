# VedaAI — AI Assessment Creator

> **Full Stack Engineering Assignment** — Build an AI-powered assessment creator that allows teachers to create assignments, generate question papers using AI, and view the generated output.

![VedaAI](https://img.shields.io/badge/VedaAI-AI%20Assessment%20Creator-7C3AED?style=for-the-badge)

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand, Framer Motion |
| **Backend** | Express, TypeScript, MongoDB (Mongoose), Redis (ioredis), BullMQ |
| **AI** | Anthropic Claude (claude-sonnet-4-20250514) |
| **Monorepo** | Turborepo + pnpm workspaces |
| **Real-time** | Socket.io (WebSocket) |

## 📁 Architecture

```
vedaai/
├── apps/
│   ├── backend/        # Express API + BullMQ worker
│   └── frontend/       # Next.js 15 App Router
├── packages/
│   └── shared/         # Shared TypeScript types + Zod validators
├── docker-compose.yml  # MongoDB + Redis
├── turbo.json          # Turborepo config
└── pnpm-workspace.yaml
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- Docker (for MongoDB + Redis)

### Setup

```bash
# Clone
git clone https://github.com/Vineet1101/vedaai.git
cd vedaai

# Install dependencies
pnpm install

# Start infrastructure
docker-compose up -d

# Copy env file
cp .env.example .env
# Edit .env with your ANTHROPIC_API_KEY

# Build shared package
pnpm --filter @vedaai/shared build

# Start development
pnpm dev
```

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:4000
- **Health Check:** http://localhost:4000/api/health

## 🎯 Core Features

### 1. Assignment Creation
- Form with subject, topic, due date, question types
- **Question Matrix** — per-type count + marks configuration
- File upload (PDF/TXT) for reference material
- Difficulty distribution (Easy/Medium/Hard %)
- Full validation with Zod schemas (shared between frontend + backend)

### 2. AI Question Paper Generation
- Anthropic Claude generates structured question papers
- **BullMQ** job queue for async processing
- **WebSocket** real-time progress updates (queued → processing → generating → parsing → complete)
- Retry with exponential backoff (3 attempts)

### 3. Paper View
- Exam-style layout with sections and questions
- Difficulty badges on each question
- **Toggleable answer key** with explanations
- **Print-to-PDF** via `window.print()` with `@media print` styles
- Regenerate from the paper view

## 🏗 Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Turborepo monorepo** | Shared types/validators prevent frontend/backend drift |
| **BullMQ + Redis** | Async AI generation doesn't block API, supports retries |
| **WebSocket rooms** | Per-job subscriptions — single `job:update` event |
| **Server Components** | Dashboard cards render server-side, only interactive parts are Client Components |
| **`loading.tsx` + `error.tsx`** | Next.js file conventions for instant skeletons and graceful error recovery |
| **Zod on both ends** | Same schema validates form input AND LLM output |

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/assignments` | List assignments (paginated) |
| `POST` | `/api/assignments` | Create assignment + start generation |
| `GET` | `/api/assignments/:id` | Get single assignment |
| `GET` | `/api/assignments/:id/paper` | Get generated paper (Redis cached) |
| `POST` | `/api/assignments/:id/regenerate` | Regenerate paper |
| `DELETE` | `/api/assignments/:id` | Delete assignment + cleanup |

## 🎨 Approach

1. **Architecture First** — Designed the monorepo structure, shared types, and data flow before writing code.
2. **Functional First, Animate Later** — Built all core features with clean UI, then added animations as a polish pass.
3. **Figma-Compliant** — Sidebar layout, question matrix, and paper view match the provided Figma designs.
4. **Production Patterns** — Rate limiting, error boundaries, Redis caching, structured logging.

---

Built with ❤️ for VedaAI
