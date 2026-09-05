import type { FallbackProps } from "react-error-boundary"

export function AppErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const message = error instanceof Error ? error.message : "Unknown runtime error"

  return (
    <main className="system-state-page" role="alert">
      <div className="landing-grid" />
      <section className="system-state-card">
        <div className="system-state-topline">
          <span>RUNTIME / 500</span>
          <span className="system-state-status is-red">
            <span className="status-dot is-red" /> SYSTEM FAULT
          </span>
        </div>
        <div className="system-state-icon">!</div>
        <span className="console-eyebrow">UNEXPECTED INTERRUPTION</span>
        <h1>Something went<br /><em>off-script.</em></h1>
        <p>
          The workspace hit an unexpected error. Try rendering the current
          view again, or return to the command center.
        </p>
        <code className="system-state-detail">{message}</code>
        <div className="system-state-actions">
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="inline-flex min-h-[38px] items-center gap-[9px] border border-[var(--terminal-amber)] bg-[var(--terminal-amber)] px-[13px] font-mono text-[9px] leading-none tracking-[.1em] text-[#0b1112] hover:bg-[#f1ca73]"
          >
            RETRY SYSTEM <span aria-hidden="true">↻</span>
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
