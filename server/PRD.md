# Product Requirements Document — Backend
## GitHub Wiki RAG Chat

| | |
|---|---|
| **Version** | 1.0 (Draft) |
| **Status** | Pending review |
| **Owner** | You |
| **Scope** | Backend/API only |
| **Companion doc** | `PRD-Frontend.md` |

---

## 1. Overview

The backend is a GitHub wrapper + RAG service. It authenticates users via GitHub, lists their repos, lets them opt into indexing a repo (code files only), stores embeddings in Qdrant, and answers chat questions by retrieving relevant code chunks and streaming an LLM response back with file/line citations.

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Server | Express.js |
| Auth | better-auth (GitHub OAuth provider) |
| Background jobs | Inngest |
| RAG orchestration | LangChain |
| Primary DB | MongoDB |
| Vector DB | Qdrant (shared collection, filtered by `repoId` metadata) |
| LLM + Embeddings | OpenAI |
| GitHub access | Octokit, using the user's OAuth token |

## 3. Goals

- Wrap the GitHub API so the frontend gets repo lists + indexing state from one place.
- Turn a repo's **code files only** into searchable vector chunks, split along function/class boundaries.
- Answer chat questions with retrieval-augmented generation, streaming the answer and returning file/line citations.
- Track daily usage per user and enforce a limit.
- Keep data lifecycle sane: soft-delete on disconnect/removal, background purge later.

## 4. Non-Goals (MVP)

- Cross-user shared indexes (each user's index of a repo is independent — see §12 open questions).
- Auto re-indexing on every push (we only flag repos as outdated; re-index stays manual, per the frontend PRD).
- Org-wide GitHub App installation flows — this uses per-user OAuth tokens via Octokit.

## 5. High-Level Architecture

```
Frontend (React)
   │
   ├── /api/auth/*         → better-auth (GitHub OAuth, sessions)
   ├── /api/repos          → Express routes → Octokit (GitHub API) + MongoDB
   ├── /api/repos/:id/index→ emits Inngest event → indexing pipeline
   ├── /api/sessions/*     → Express routes → MongoDB
   ├── /api/messages       → Express (SSE) → LangChain → Qdrant + OpenAI → MongoDB
   ├── /api/usage          → MongoDB usage counters
   └── /api/webhooks/github→ GitHub push events → MongoDB (isOutdated flag)

Inngest functions:
   - indexRepo            (fetch via Octokit → AST chunk → OpenAI embed → upsert Qdrant → update Mongo status)
   - cleanupSoftDeleted    (cron: purge soft-deleted repos/sessions + their Qdrant vectors after grace period)
```

## 6. MongoDB Schema

better-auth manages its own collections (`user`, `session`, `account`, `verification`) — the GitHub OAuth token lives in `account`. Everything below is app-specific and references `user._id` via a `userId` field.

### 6.1 `repos`
One document per (user, GitHub repo) — indexing is per-user, not shared globally (see §12).

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `userId` | ObjectId | ref → better-auth `user` |
| `githubRepoId` | Number | GitHub's numeric repo id |
| `fullName` | String | `owner/repo` |
| `defaultBranch` | String | |
| `private` | Boolean | |
| `language` | String | primary language, for filter chip |
| `stars` | Number | |
| `indexingStatus` | Enum | `not_indexed` \| `indexing` \| `ready` \| `failed` |
| `indexingProgress` | Object | `{ filesProcessed: Number, totalFiles: Number }` |
| `lastIndexedCommitSha` | String | for outdated comparison |
| `lastIndexedAt` | Date | |
| `isOutdated` | Boolean | set `true` by the GitHub webhook handler |
| `webhookId` | String \| null | GitHub webhook id if registered (see §12 — not always possible) |
| `isActive` | Boolean | soft-delete flag, default `true` |
| `deactivatedAt` | Date \| null | |
| `createdAt` / `updatedAt` | Date | |

**Indexes**: unique on `(userId, githubRepoId)`; index on `(userId, isActive)` for dashboard listing.

### 6.2 `chatSessions`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `repoId` | ObjectId | ref → `repos` |
| `userId` | ObjectId | denormalized for auth checks without a join |
| `title` | String | auto-set from first question, user-editable |
| `pinned` | Boolean | default `false` |
| `isActive` | Boolean | soft-delete flag |
| `lastMessageAt` | Date | for sorting |
| `createdAt` / `updatedAt` | Date | |

**Indexes**: `(repoId, isActive, pinned, lastMessageAt)` for the sidebar list.

### 6.3 `chatMessages`

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `sessionId` | ObjectId | ref → `chatSessions` |
| `role` | Enum | `user` \| `assistant` |
| `content` | String | full text (final, post-stream) |
| `citations` | Array | `[{ filePath, startLine, endLine }]` — assistant messages only |
| `createdAt` | Date | |

**Indexes**: `(sessionId, createdAt)` for paginated thread loading.

### 6.4 `usageCounters`
Daily bucket per user — using a date-string key means counters "reset" automatically with no cron job needed.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `userId` | ObjectId | |
| `period` | String | `"YYYY-MM-DD"` |
| `messageCount` | Number | incremented per question sent |
| `createdAt` / `updatedAt` | Date | |

**Indexes**: unique on `(userId, period)`.

### 6.5 `indexingJobs` (audit/debug trail)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `repoId` | ObjectId | ref → `repos` |
| `status` | Enum | `running` \| `succeeded` \| `failed` |
| `triggeredBy` | Enum | `manual` \| `manual_reindex` |
| `error` | String \| null | |
| `startedAt` / `completedAt` | Date | |

## 7. Qdrant (Vector Store) Design

- **One shared collection** (e.g. `code_chunks`), not one collection per repo — avoids collection sprawl as users/repos grow.
- Each point's payload (metadata):
  ```json
  {
    "userId": "...",
    "repoId": "...",
    "filePath": "src/utils/parser.ts",
    "startLine": 12,
    "endLine": 48,
    "language": "typescript",
    "contentHash": "sha256..."
  }
  ```
- All retrieval queries filter by `repoId` (and `userId`, for defense in depth) before the vector similarity search.
- `contentHash` lets re-indexing skip re-embedding unchanged chunks.

## 8. Indexing Pipeline (Inngest: `indexRepo`)

Triggered by `POST /api/repos/:repoId/index` (manual button) or `.../reindex`.

1. Fetch the repo tree via Octokit using the user's stored OAuth token.
2. Filter to **code files only** (by extension allow-list; exclude docs/config, binaries, `node_modules`, lockfiles, etc.).
3. For each file, run **AST-aware chunking** — split along function/class boundaries (e.g. via `tree-sitter` or LangChain's code-aware text splitters), falling back to fixed-size token windows for files without a supported parser.
4. Generate embeddings for each chunk via OpenAI.
5. Upsert into Qdrant with the payload from §7.
6. After each file: update `repos.indexingProgress` in Mongo (frontend polls this for the progress bar).
7. On completion: set `indexingStatus: 'ready'`, `lastIndexedCommitSha`, `lastIndexedAt`, `isOutdated: false`.
8. On failure: set `indexingStatus: 'failed'`, log to `indexingJobs.error`.

## 9. Chat / RAG Pipeline

`POST /api/sessions/:sessionId/messages` (SSE response):

1. Check usage limit (§11) — reject with `429` if exceeded.
2. Save the user's message to `chatMessages`.
3. Embed the question (OpenAI), query Qdrant filtered by `repoId` for top-k relevant chunks.
4. Build a LangChain prompt with the retrieved chunks as context.
5. Stream the OpenAI completion back to the client over SSE, token by token.
6. On stream completion, save the assistant message with `citations` derived from the chunks actually used, and increment `usageCounters`.

## 10. Auth & GitHub Access

- better-auth handles the GitHub OAuth flow and session cookies.
- The GitHub access token from better-auth's `account` collection is reused by Octokit for repo listing, file fetching, and (where possible) webhook registration.
- **Disconnect flow**: unlink the GitHub account via better-auth, then soft-delete all of that user's `repos`/`chatSessions` (see §13).

## 11. Usage Tracking & Rate Limiting

- Every chat message increments `usageCounters` for `(userId, today's date)`.
- A configurable daily limit (proposed default: **50 messages/day**, via env var — confirm the actual number) is checked before processing a new message.
- `GET /api/usage` returns `{ used, limit, resetsAt }` for the Settings page.

## 12. GitHub Webhooks (Outdated Detection)

- On successful indexing, the backend attempts to register a push webhook on the repo via Octokit.
- **Important caveat**: registering a webhook requires **admin rights on the repo** (`admin:repo_hook` scope). This works for repos the user owns, but will fail for repos where they only have collaborator/read access. Recommendation: if webhook registration fails, silently skip outdated-detection for that repo rather than blocking indexing — flag this as a known limitation.
- `POST /api/webhooks/github` verifies the GitHub signature, matches the `push` event to a `repos` doc by `githubRepoId`, and sets `isOutdated: true`.

## 13. Data Lifecycle (Soft Delete)

- Disconnecting GitHub or removing a repo's index sets `isActive: false` (+ cascades to that repo's `chatSessions`) rather than deleting immediately.
- **Inngest cron** (`cleanupSoftDeleted`, proposed daily) finds records inactive for longer than a grace period (proposed **30 days** — confirm) and:
  - Deletes the Mongo docs (`repos`, `chatSessions`, `chatMessages`).
  - Deletes the matching Qdrant points by `repoId` filter.

## 14. Non-Functional Requirements

- GitHub tokens encrypted at rest (confirm better-auth's MongoDB adapter handles this, or add app-level encryption).
- Webhook endpoint verifies GitHub's HMAC signature before trusting any payload.
- SSE endpoint sets proper headers (`Content-Type: text/event-stream`, no buffering) and cleans up the connection if the client disconnects mid-stream.
- All list endpoints (repos, sessions, messages) are paginated.
- CORS restricted to the frontend's origin(s).

## 15. Assumptions & Open Questions (please confirm)

1. **Per-user indexing, not shared**: if two different users index the same public repo, we currently store and embed it twice (once per user). A shared/global index keyed by `githubRepoId` alone would be more efficient but adds multi-tenant complexity — confirm if that's wanted later.
2. **Daily message limit value** — defaulted to 50/day as a placeholder; confirm the real number (or whether it should be plan-based).
3. **Soft-delete grace period** — defaulted to 30 days before permanent purge; confirm.
4. **Webhook permission gap** (§12) — repos without admin access won't get outdated detection; confirm this is an acceptable MVP limitation vs. needing a polling fallback.

## 16. Out of Scope for MVP

- Multi-tenant/shared repo indexes.
- Plan tiers / billing tied to usage limits.
- Re-embedding only changed files on re-index (MVP re-indexes the whole repo; hash-based partial re-index is a future optimization enabled by `contentHash` already being stored).

---
*Companion: `PRD-Frontend.md`*