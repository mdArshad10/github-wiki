import { useState } from "react"
import {
  Activity,
  ArrowDown,
  BookOpen,
  FileCode2,
  FolderOpen,
  GitBranch,
  Grid2X2,
  MessageSquareText,
  MoreHorizontal,
  PanelRightClose,
  Pin,
  Plus,
  Send,
  Settings2,
  Sparkles,
  Square,
  X,
} from "lucide-react"

import { Link, useLocation, useParams } from "@tanstack/react-router"

type Message = {
  id: string
  role: "user" | "assistant"
  time: string
  text: string
  citation?: { file: string; line: string; code: string }
}

const initialMessages: Message[] = [
  {
    id: "m1",
    role: "user",
    time: "14:26:41",
    text: "Where does the OAuth callback become a workspace session? Trace the boundary from the GitHub redirect.",
  },
  {
    id: "m2",
    role: "assistant",
    time: "14:26:44",
    text: "The handoff happens in two stages. GitHub returns to the auth callback, which exchanges the temporary code and then creates the application session before redirecting to the workspace.",
    citation: {
      file: "src/auth/github-callback.ts",
      line: "42–68",
      code: "const githubUser = await github.exchangeCode(code)\nconst session = await sessions.create(githubUser)",
    },
  },
  {
    id: "m3",
    role: "assistant",
    time: "14:26:44",
    text: "The session is then attached to the request context by the middleware layer. Downstream repository handlers never read the OAuth token directly; they receive the normalized workspace identity instead.",
    citation: {
      file: "src/middleware/session-context.ts",
      line: "19–34",
      code: "req.context = {\n  userId: session.userId,\n  workspaceId: session.workspaceId\n}",
    },
  },
]

const sessions = [
  { id: "s1", title: "trace the auth boundary", time: "14:26", pinned: true },
  {
    id: "s2",
    title: "where are retries handled?",
    time: "yesterday",
    pinned: false,
  },
  { id: "s3", title: "map the webhook flow", time: "yesterday", pinned: false },
  {
    id: "s4",
    title: "session invalidation notes",
    time: "12 Aug",
    pinned: false,
  },
]

const appNavLinks = [
  { label: "Overview", to: "/dashboard", icon: Grid2X2 },
  { label: "Repositories", to: "/dashboard/repository", icon: BookOpen },
  { label: "Activity", to: "/dashboard/activity", icon: Activity },
  { label: "Settings", to: "/settings", icon: Settings2 },
] as const

function ChatChromeHeader({
  repoId,
}: {
  repoId: string
}) {
  const location = useLocation()

  return (
    <header className="flex h-[68px] shrink-0 items-center justify-between border-b border-[var(--terminal-rule)] bg-[#070a0c] px-[18px] max-[900px]:flex-wrap max-[900px]:h-auto max-[900px]:gap-y-2 max-[900px]:py-2">
      <div className="flex min-w-0 items-center gap-6">
        <Link
          to="/dashboard"
          className="flex shrink-0 items-center gap-2.5 no-underline"
          aria-label="Wiki RAG home"
        >
          <span className="grid size-[29px] shrink-0 place-items-center border border-[var(--terminal-cyan)] font-mono text-[12px] leading-none font-bold tracking-[-1px] text-[var(--terminal-cyan)]">
            W/
          </span>
          <span className="hidden flex-col gap-[3px] whitespace-nowrap min-[520px]:flex">
            <strong className="font-mono text-[12px] leading-none font-bold tracking-[0.08em] text-[var(--terminal-text)]">
              WIKI//RAG
            </strong>
            <small className="font-mono text-[8px] leading-none tracking-[0.14em] text-[var(--terminal-muted)]">
              CODE INTELLIGENCE
            </small>
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-[7px] font-mono text-[10px] leading-none tracking-[0.06em] text-[var(--terminal-muted)]">
          <Link
            to="/dashboard/repository"
            className="shrink-0 text-[var(--terminal-cyan)] no-underline hover:text-[#a5eeee]"
          >
            REPOSITORY CONTROL
          </Link>
          <span className="text-[var(--terminal-faint)]">/</span>
          <span className="truncate text-[var(--terminal-text)]">
            {repoId}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-[14px]">
        <nav
          className="flex items-center gap-1 border border-[var(--terminal-rule)] bg-[#0b1114] p-[3px] font-mono text-[9px] leading-none tracking-[0.06em]"
          aria-label="Workspace navigation"
        >
          {appNavLinks.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-[24px] items-center gap-[6px] px-2 no-underline transition-colors ${
                  isActive
                    ? "bg-[#101a1e] text-[var(--terminal-cyan)]"
                    : "text-[var(--terminal-muted)] hover:bg-[#0d161a] hover:text-[var(--terminal-text)]"
                }`}
              >
                <Icon size={13} />
                <span className="hidden min-[480px]:inline">{label}</span>
              </Link>
            )
          })}
        </nav>

        <button
          className="relative grid size-[28px] shrink-0 place-items-center border-0 bg-transparent text-[var(--terminal-muted)] transition-colors hover:bg-[var(--terminal-surface-raised)] hover:text-[var(--terminal-text)]"
          type="button"
          aria-label="Messages"
        >
          <MessageSquareText size={16} />
          <span className="absolute top-[5px] right-[5px] size-1 rounded-full bg-[var(--terminal-amber)]" />
        </button>

        <div className="flex items-center gap-2 border-l border-[var(--terminal-rule)] pl-[14px]">
          <span className="grid size-[26px] place-items-center bg-[var(--terminal-amber)] font-mono text-[10px] leading-none font-bold text-[#101719]">
            PA
          </span>
          <span className="hidden flex-col gap-[3px] min-[380px]:flex">
            <strong className="font-mono text-[11px] leading-none font-semibold text-[var(--terminal-text)]">
              pasdigital
            </strong>
            <small className="font-mono text-[8px] leading-none tracking-[0.08em] text-[var(--terminal-muted)]">
              GITHUB
            </small>
          </span>
        </div>
      </div>
    </header>
  )
}

export function ChatWorkspace({
  sessionId = "s1",
  repoId = "atlas-core",
}: {
  sessionId?: string
  repoId?: string
}) {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState("")
  const [citation, setCitation] = useState<Message["citation"]>(
    initialMessages[1].citation
  )
  const [isStreaming, setIsStreaming] = useState(false)

  function sendMessage() {
    const text = draft.trim()
    if (!text || isStreaming) return
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", time: "now", text },
    ])
    setDraft("")
    setIsStreaming(true)
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          time: "now",
          text: "I’m tracing that path across the indexed files now. The first relevant handoff is in the request boundary; I’ll keep the answer anchored to the implementation.",
          citation: {
            file: "src/context/request-context.ts",
            line: "11–29",
            code: "export function withWorkspace(req, next) {\n  return next(resolveWorkspace(req))\n}",
          },
        },
      ])
      setIsStreaming(false)
    }, 900)
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-[var(--terminal-bg)] text-[var(--terminal-text)]">
      <ChatChromeHeader repoId={repoId} />

      <div className="chat-layout min-h-0! flex-1! border-0! max-[760px]:flex! max-[760px]:min-h-0!">
        <aside className="session-sidebar">
          <div className="session-sidebar-top">
            <div>
              <span className="eyebrow">SESSIONS</span>
              <strong>04 THREADS</strong>
            </div>
            <button
              className="mini-icon-button"
              type="button"
              aria-label="New session"
            >
              <Plus size={15} />
            </button>
          </div>
          <div className="session-list">
            {sessions.map((session) => (
              <Link
                key={session.id}
                to="/repo/$repoId/session/$sessionId"
                params={{ repoId, sessionId: session.id }}
                className={
                  session.id === sessionId
                    ? "session-item is-active"
                    : "session-item"
                }
              >
                <span className="session-item-indicator" />{" "}
                <div>
                  <strong>{session.title}</strong>
                  <small>{session.time}</small>
                </div>
                {session.pinned && <Pin size={13} className="session-pin" />}
              </Link>
            ))}
          </div>
          <div className="session-sidebar-bottom">
            <div className="repo-context">
              <span className="repo-icon">
                <FolderOpen size={15} />
              </span>
              <div>
                <strong>{repoId}</strong>
                <small>
                  <GitBranch size={11} /> main
                </small>
              </div>
              <MoreHorizontal size={15} />
            </div>
            <div className="session-hint">
              <Sparkles size={13} />
              <span>
                Answers stay grounded
                <br />
                in indexed source.
              </span>
            </div>
          </div>
        </aside>

        <section className="chat-thread">
          <div className="thread-toolbar">
            <div>
              <span className="eyebrow">SESSION 01</span>
              <h2>trace the auth boundary</h2>
            </div>
            <div className="thread-toolbar-actions">
              <span className="thread-token-count">1.2k TOKENS</span>
              <button
                className="mini-icon-button"
                type="button"
                aria-label="More session actions"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
          <div className="message-scroll">
            <div className="thread-date">
              <span />
              TODAY · 04 SEP 2026
              <span />
            </div>
            {messages.map((message) => (
              <article
                key={message.id}
                className={
                  message.role === "user"
                    ? "message-row is-user"
                    : "message-row"
                }
              >
                <div className="message-meta">
                  <span
                    className={
                      message.role === "user"
                        ? "message-avatar user"
                        : "message-avatar assistant"
                    }
                  >
                    {message.role === "user" ? "PA" : <Sparkles size={13} />}
                  </span>
                  <span>{message.role === "user" ? "YOU" : "WIKI//RAG"}</span>
                  <time>{message.time}</time>
                </div>
                <div
                  className={
                    message.role === "user"
                      ? "message-bubble user-bubble"
                      : "message-bubble"
                  }
                >
                  <p>{message.text}</p>
                  {message.citation && (
                    <button
                      className="citation-chip"
                      type="button"
                      onClick={() => setCitation(message.citation)}
                    >
                      <FileCode2 size={13} />
                      <span>{message.citation.file}</span>
                      <strong>:{message.citation.line}</strong>
                      <span>↗</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
            {isStreaming && (
              <div className="streaming-line">
                <Sparkles size={14} />
                <span>SEARCHING INDEX</span>
                <i />
                <i />
                <i />
              </div>
            )}
          </div>
          <div className="composer-wrap">
            <div className="composer-context">
              <span>
                <span className="status-dot is-green" /> ANSWERS FROM 1,244
                INDEXED FILES
              </span>
              <span>SHIFT ↵ FOR NEWLINE</span>
            </div>
            <div className="composer">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Ask about this repository..."
                rows={2}
              />
              <button
                className="composer-send"
                type="button"
                onClick={sendMessage}
                disabled={!draft.trim() || isStreaming}
                aria-label="Send message"
              >
                {isStreaming ? <Square size={15} /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </section>

        {citation && (
          <aside className="citation-panel">
            <div className="citation-panel-heading">
              <div>
                <span className="eyebrow">SOURCE TRACE</span>
                <h2>Referenced file</h2>
              </div>
              <button
                className="mini-icon-button"
                type="button"
                onClick={() => setCitation(undefined)}
                aria-label="Close source trace"
              >
                <X size={15} />
              </button>
            </div>
            <div className="citation-file-head">
              <FileCode2 size={17} />
              <div>
                <strong>{citation.file}</strong>
                <small>atlas-core · main</small>
              </div>
            </div>
            <div className="source-location">
              <span>LINES {citation.line}</span>
              <span>TS</span>
            </div>
            <pre className="code-block">
              <code>{citation.code}</code>
            </pre>
            <div className="citation-panel-footer">
              <button className="text-button" type="button">
                <ArrowDown size={14} /> OPEN IN GITHUB
              </button>
              <button className="text-button" type="button">
                <PanelRightClose size={14} /> HIDE PANEL
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

export function RepoChatPage() {
  const { repoId } = useParams({ from: "/protected/repo/$repoId" })
  return <ChatWorkspace repoId={repoId} />
}
