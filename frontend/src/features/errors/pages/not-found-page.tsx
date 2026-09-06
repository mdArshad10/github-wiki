import { Link } from "@tanstack/react-router"
import { ArrowLeft, Home, SearchX } from "lucide-react"

export function NotFoundPage() {
  return (
    <main className="system-state-page" role="status">
      <div className="landing-grid" />
      <section className="system-state-card">
        <div className="system-state-topline">
          <span>ROUTE / 404</span>
          <span className="system-state-status is-amber">
            <span className="status-dot is-amber" /> TRACE LOST
          </span>
        </div>
        <div className="system-state-icon is-amber">
          <SearchX size={25} />
        </div>
        <span className="console-eyebrow">NO MATCHING ROUTE</span>
        <h1>
          That path is
          <br />
          <em>off the map.</em>
        </h1>
        <p>
          The address does not resolve to a workspace, repository, or indexed
          conversation in this system.
        </p>
        <div className="system-state-actions">
          <Link
            to="/"
            className="inline-flex min-h-[38px] items-center gap-[9px] border border-[var(--terminal-amber)] bg-[var(--terminal-amber)] px-[13px] font-mono text-[9px] leading-none tracking-[.1em] text-[#0b1112] no-underline hover:bg-[#f1ca73]"
          >
            <Home size={15} /> RETURN HOME
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex min-h-[38px] items-center gap-[9px] border border-[var(--terminal-rule)] px-[13px] font-mono text-[9px] leading-none tracking-[.1em] text-[var(--terminal-cyan)] no-underline hover:border-[var(--terminal-cyan)] hover:bg-[#0d1b1e]"
          >
            <ArrowLeft size={15} /> OPEN WORKSPACE
          </Link>
        </div>
      </section>
    </main>
  )
}
