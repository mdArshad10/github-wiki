import type { ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import {
  Activity,
  BookOpen,
  ChevronRight,
  Command,
  Grid2X2,
  LogOut,
  MessageSquareText,
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
} from "lucide-react"

import { useUiStore } from "@/stores/ui.store"

type AppShellProps = {
  children: ReactNode
  pageLabel: string
  pageTitle: string
  pageMeta?: string
  headerActions?: ReactNode
}

const navItems = [
  { label: "Overview", to: "/dashboard", icon: Grid2X2 },
  { label: "Repositories", to: "/dashboard", icon: BookOpen },
  { label: "Activity", to: "/dashboard", icon: Activity },
  { label: "Settings", to: "/settings", icon: Settings2 },
] as const

export function AppShell({
  children,
  pageLabel,
  pageTitle,
  pageMeta,
  headerActions,
}: AppShellProps) {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed)
  const setSidebarCollapsed = useUiStore((state) => state.setSidebarCollapsed)

  return (
    <div className="terminal-app">
      <aside
        className={
          sidebarCollapsed
            ? "terminal-sidebar is-collapsed"
            : "terminal-sidebar"
        }
      >
        <div className="sidebar-topline">
          <Link
            to="/dashboard"
            className="brand-lockup"
            aria-label="Wiki RAG home"
          >
            <span className="brand-mark">W/</span>
            {!sidebarCollapsed && (
              <span className="brand-copy">
                <strong>WIKI//RAG</strong>
                <small>CODE INTELLIGENCE</small>
              </span>
            )}
          </Link>
          <button
            className="icon-button sidebar-toggle"
            type="button"
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={16} />
            ) : (
              <PanelLeftClose size={16} />
            )}
          </button>
        </div>

        <div className="sidebar-rule" />

        <div className="workspace-switcher">
          <span className="workspace-avatar">PA</span>
          {!sidebarCollapsed && (
            <span className="workspace-copy">
              <strong>pasdigital</strong>
              <small>PERSONAL WORKSPACE</small>
            </span>
          )}
          {!sidebarCollapsed && (
            <ChevronRight size={14} className="muted-icon" />
          )}
        </div>

        <nav className="terminal-nav" aria-label="Primary navigation">
          <span className="nav-section-label">NAVIGATION</span>
          {navItems.map(({ label, to, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className="nav-link"
              activeProps={{ className: "nav-link is-active" }}
              title={sidebarCollapsed ? label : undefined}
            >
              <Icon size={16} />
              {!sidebarCollapsed && <span>{label}</span>}
              {!sidebarCollapsed && label === "Repositories" && (
                <span className="nav-count">12</span>
              )}
            </Link>
          ))}
        </nav>

        {!sidebarCollapsed && (
          <div className="sidebar-module">
            <div className="module-heading">
              <span>INDEX QUEUE</span>
              <span className="status-dot is-amber" />
            </div>
            <div className="queue-item">
              <div>
                <strong>sdk-python</strong>
                <small>42% · 03:18 remaining</small>
              </div>
              <span className="queue-pulse" />
            </div>
            <div className="queue-item is-muted">
              <div>
                <strong>auth-service</strong>
                <small>failed · 14m ago</small>
              </div>
              <span className="status-dot is-red" />
            </div>
          </div>
        )}

        <div className="sidebar-bottom">
          <div className="connection-status">
            <span className="status-dot is-green" />
            {!sidebarCollapsed && <span>API CONNECTED</span>}
          </div>
          <button
            className="nav-link logout-link"
            type="button"
            title="Sign out"
          >
            <LogOut size={16} />
            {!sidebarCollapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <main className="terminal-main">
        <header className="terminal-header">
          <div className="breadcrumb-line">
            <span className="breadcrumb-root">WIKI//RAG</span>
            <ChevronRight size={13} />
            <span>{pageLabel}</span>
            {pageMeta && (
              <>
                <ChevronRight size={13} />
                <span className="muted-text">{pageMeta}</span>
              </>
            )}
          </div>
          <div className="header-tools">
            <button className="command-trigger" type="button">
              <Command size={14} />
              <span>Jump to</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="header-icon-button"
              type="button"
              aria-label="Messages"
            >
              <MessageSquareText size={16} />
              <span className="notification-dot" />
            </button>
            <div className="header-user">
              <span className="user-initials">PA</span>
              <span className="header-user-copy">
                <strong>pasdigital</strong>
                <small>GITHUB</small>
              </span>
            </div>
          </div>
        </header>

        <div className="page-header">
          <div>
            <span className="eyebrow">{pageLabel}</span>
            <h1>{pageTitle}</h1>
          </div>
          {headerActions && <div className="page-actions">{headerActions}</div>}
        </div>

        <div className="terminal-content">{children}</div>
      </main>
    </div>
  )
}
