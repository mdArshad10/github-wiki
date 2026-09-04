# Product Requirements Document — Frontend
## GitHub Wiki RAG Chat

| | |
|---|---|
| **Version** | 1.0 (Draft) |
| **Status** | Pending review |
| **Owner** | You |
| **Scope** | Frontend application only |
| **Companion doc** | `PRD-Backend.md` (in progress) |

---

## 1. Overview

A web app that lets a user log in with their GitHub account and chat with an AI about any of their repositories, RAG-style. After login, the user lands on a dashboard listing their repos. They opt into indexing a repo, and once indexed, they can open one or more named chat sessions per repo to ask questions grounded in that repo's content, with the AI citing the specific files/lines it used.

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Build tool | Vite |
| Framework | React |
| Server state | TanStack Query |
| Routing | TanStack Router |
| Client/UI state | Zustand |
| Auth | better-auth (GitHub OAuth) |
| Components | shadcn/ui |

## 3. Goals

- Let a user authenticate with GitHub and see all their repos in one place.
- Let a user explicitly choose which repos to index for RAG (no silent background indexing).
- Provide a ChatGPT-like multi-session chat experience scoped per repo, with streaming answers and clickable file/line citations.
- Make indexing status and repo freshness always visible and understandable.
- Fully responsive across desktop and mobile.

## 4. Non-Goals (MVP)

- Multi-user collaboration / sharing a chat session with teammates.
- Searching across chat history (session list stays chronological/pinned only — see §9.3).
- Organization-wide admin controls or billing.
- Editing repo content from within the app.

## 5. Core User Flow

```
Landing → "Login with GitHub" → OAuth consent → Dashboard
Dashboard → browse/search/filter repos → click "Index this repo"
Repo card shows: Not Indexed → Indexing (progress bar) → Ready / Failed
Click a "Ready" repo → Repo Chat view → "+ New session" → ask questions
Answers stream in, with clickable [filename:line] citations
Sessions can be renamed, pinned, or deleted from a sidebar
```

## 6. Feature Requirements

### 6.1 Authentication
- "Login with GitHub" via better-auth OAuth flow.
- On success, redirect to `/dashboard`.
- Persisted session (better-auth session cookie/token); unauthenticated users hitting any protected route redirect to `/login`.
- Logout clears session and returns to `/login`.

### 6.2 Dashboard (`/dashboard`)
- Lists **all repos** the authenticated GitHub account has access to (public + private), fetched via the backend's GitHub wrapper API.
- **Search bar** — filter repos by name as-you-type (debounced).
- **Filters** — by language, visibility (public/private), starred.
- **Pagination** — infinite scroll (TanStack Query `useInfiniteQuery`).
- Each **repo card** shows:
  - Repo name, description, language, visibility badge, star count.
  - **Indexing status badge**: `Not Indexed` / `Indexing…` / `Ready` / `Failed`.
  - **Progress bar** while `Indexing…` (driven by polling — see §9).
  - Primary action button:
    - Not Indexed → **"Index this repo"** (manual trigger, per your decision).
    - Ready → **"Open Chat"**.
    - Failed → **"Retry Indexing"**.
  - **Outdated indicator**: if the repo has new commits since last index, show a subtle "Outdated — new commits available" tag with a **"Re-index"** action.
    > *Recommendation (flagged as undecided by you): a lightweight "outdated" badge + manual re-index button, rather than auto re-indexing on every webhook commit. Auto re-indexing on every push can be expensive/noisy for active repos; a badge keeps the user in control while still surfacing staleness. This is a backend-driven flag your API should expose per repo — happy to revisit if you'd rather go fully automatic.*

### 6.3 Repo Chat View (`/repo/:repoId`)
- Left sidebar: list of **named chat sessions** for this repo (ChatGPT-style).
  - **"+ New session"** button.
  - Per-session controls: **rename**, **delete**, **pin/favorite** (pinned sessions float to top).
  - Sessions are auto-named from the first question by default; user can rename anytime.
- Main panel: active session's message thread.
  - User messages right-aligned, AI messages left-aligned, markdown-rendered with syntax-highlighted code blocks.
  - AI responses **stream token-by-token** (SSE or WebSocket from backend).
  - **Citations**: AI answers include inline references like `[repo/path/file.ts:42]` — clickable, opening a side panel or modal with that file/snippet.
  - Message input box with send button, disabled while a response is streaming, with a stop/cancel-generation control.
  - Empty state (no sessions yet) prompts the user to start their first question.
- If repo is `Indexing…` or `Failed`, this route shows a status view instead of chat, with a link back to the dashboard.

### 6.4 Settings (`/settings`)
- GitHub account info (avatar, username) with a **"Disconnect GitHub"** action.
- **Theme preference** — light/dark toggle (see §8).
- **API/usage limits display** — e.g. requests used this period, indexed repo count vs. any cap (values come from backend; this doc assumes the backend exposes a usage summary endpoint — to confirm in backend PRD).

## 7. Routing Map (TanStack Router)

| Route | Access | Purpose |
|---|---|---|
| `/login` | Public | GitHub OAuth entry |
| `/dashboard` | Protected | Repo list |
| `/repo/:repoId` | Protected | Chat sessions for a repo |
| `/repo/:repoId/session/:sessionId` | Protected | Deep link to a specific session |
| `/settings` | Protected | Account, theme, usage |

Route guards check better-auth session state before rendering protected routes.

## 8. UI/UX Requirements

- **Component library**: shadcn/ui throughout for consistency (cards, badges, dialogs, dropdowns, command palette for search, etc.).
- **Theme**: light + dark mode with a user toggle (persisted — see §9 for where this lives).
- **Responsive**: fully responsive, desktop and mobile.
  - Mobile: sidebar (repo filters / session list) collapses into a drawer/sheet.
  - Chat input and streaming layout adapt to smaller viewports.
- **Loading states**: skeleton loaders for repo list and chat history, not blank screens.
- **Error states**: toast notifications for failed actions (e.g. indexing trigger failed, message send failed) with retry affordances.

## 9. State Management Strategy

| Concern | Tool | Notes |
|---|---|---|
| Repo list, pagination, filters | TanStack Query | `useInfiniteQuery`, cached & revalidated |
| Indexing status per repo | TanStack Query | Poll with `refetchInterval` while status is `Indexing…`; stop polling once `Ready`/`Failed` |
| Chat sessions list, messages | TanStack Query | Query per repo/session; mutations for create/rename/delete/pin with optimistic updates |
| Streaming message content | Local component state (or Zustand if shared across components) | Fed by SSE/WebSocket connection, not TanStack Query (which is for request/response, not streams) |
| Theme (light/dark) | Zustand + persisted (localStorage-equivalent via a persist middleware) | Global UI state, not server state |
| Sidebar collapse, active session id, UI-only flags | Zustand | Ephemeral client UI state |
| Auth session | better-auth client hooks | Source of truth for logged-in user |

## 10. Non-Functional Requirements

- **Performance**: route-based code splitting (Vite), virtualization for long chat threads if needed later.
- **Accessibility**: keyboard-navigable chat input, focus management on session switch, sufficient color contrast in both themes.
- **Resilience**: dropped SSE/WebSocket connections should auto-reconnect or clearly show "connection lost, retry" rather than silently hanging.

## 11. Assumptions (flag if wrong)

- "All repos" means every repo the OAuth'd GitHub account can see (owned + collaborator access), not just org-owned ones — to confirm when we define the GitHub scopes in the backend PRD.
- Usage/limits shown in Settings assumes the backend tracks and exposes this; if there's no rate-limiting concept yet, this section is deferred.
- Citations link to file+line, assuming the backend's RAG pipeline returns source metadata (file path, line range) alongside answers — to confirm in backend PRD when we design the retrieval/response schema.

## 12. Out of Scope for MVP

- Chat history full-text search.
- Sharing/exporting a chat session.
- Multi-repo cross-querying in a single chat.

---
*Next: `PRD-Backend.md` — Express, better-auth, Inngest, LangChain, MongoDB.*