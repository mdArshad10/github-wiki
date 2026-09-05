import type { ErrorComponentProps } from "@tanstack/react-router"

export function RouteErrorPage({ error, reset }: ErrorComponentProps) {
  const message = error instanceof Error ? error.message : "Unable to load this route"

  return (
    <main className="system-state-page" role="alert">
      <div className="landing-grid" />
      <section className="system-state-card">
        <div className="system-state-topline">
          <span>ROUTE / ERROR</span>
          <span className="system-state-status is-red">
            <span className="status-dot is-red" /> LOAD FAILED
          </span>
        </div>
        <div className="system-state-icon">!</div>
        <span className="console-eyebrow">ROUTE INITIALIZATION FAILED</span>
        <h1>We lost the<br /><em>thread.</em></h1>
        <p>
          This workspace view could not be loaded. Retry the request or return
          to the landing page.
        </p>
        <code className="system-state-detail">{message}</code>
        <div className="system-state-actions">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[38px] items-center gap-[9px] border border-[var(--terminal-amber)] bg-[var(--terminal-amber)] px-[13px] font-mono text-[9px] leading-none tracking-[.1em] text-[#0b1112] hover:bg-[#f1ca73]"
          >
            RETRY REQUEST <span aria-hidden="true">↻</span>
          </button>
          <a
            href="/"
            className="inline-flex min-h-[38px] items-center gap-[9px] border border-[var(--terminal-rule)] px-[13px] font-mono text-[9px] leading-none tracking-[.1em] text-[var(--terminal-cyan)] no-underline hover:border-[var(--terminal-cyan)] hover:bg-[#0d1b1e]"
          >
            RETURN HOME <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </main>
  )
}
