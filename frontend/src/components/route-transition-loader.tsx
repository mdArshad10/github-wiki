const STEPS = [
  "RESOLVING ROUTE",
  "MOUNTING MODULE",
  "SYNCING VIEW",
] as const

export function RouteTransitionLoader() {
  return (
    <div
      className="relative grid min-h-screen place-items-center overflow-hidden bg-[var(--terminal-bg)] px-6"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(#1b313811_1px,transparent_1px),linear-gradient(90deg,#1b313811_1px,transparent_1px)] bg-[length:46px_46px] opacity-[.28] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-px bg-[#20303855]"
      />

      <div className="relative z-10 w-full max-w-[360px] border border-[#2a444b] bg-[#0b1215] shadow-[12px_12px_0_#050708]">
        <div className="flex items-center justify-between border-b border-[var(--terminal-rule)] px-[17px] py-[15px] font-mono text-[9px] leading-none tracking-[0.13em] text-[var(--terminal-faint)]">
          <span>NAV / 003</span>
          <span className="inline-flex items-center gap-[7px] text-[var(--terminal-amber)]">
            <span className="queue-pulse" />
            TRANSITION
          </span>
        </div>

        <div className="flex flex-col items-center px-[23px] pb-[24px] pt-[31px] text-center">
          <div className="relative grid size-[52px] place-items-center">
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-spin border border-[#2a5557] border-t-[var(--terminal-cyan)] [animation-duration:1.1s]"
            />
            <span className="grid size-[29px] place-items-center border border-[var(--terminal-cyan)] bg-[#0b171b] font-mono text-[12px] leading-none font-bold tracking-[-1px] text-[var(--terminal-cyan)]">
              W/
            </span>
          </div>

          <strong className="mt-[26px] font-mono text-[11px] leading-none tracking-[0.08em] text-[#e6efef]">
            WIKI//RAG
          </strong>

          <p className="mt-[10px] font-mono text-[9px] leading-none tracking-[0.14em] text-[var(--terminal-muted)]">
            LOADING WORKSPACE
          </p>

          <div className="mt-[19px] flex h-[3px] w-[154px] gap-[3px] p-px">
            {STEPS.map((_, index) => (
              <span
                key={index}
                aria-hidden="true"
                className="animate-loader-step h-full flex-1 bg-[#1b2a30]"
                style={{ animationDelay: `${index * 1.1}s` }}
              />
            ))}
          </div>

          <div className="relative mt-[21px] h-[10px] w-[120px] font-mono text-[8px] leading-none tracking-[0.1em] text-[var(--terminal-faint)]">
            {STEPS.map((step, index) => (
              <span
                key={step}
                aria-hidden="true"
                className="animate-loader-step-label absolute inset-0 opacity-0"
                style={{ animationDelay: `${index * 1.1}s` }}
              >
                {step}
              </span>
            ))}
            <span
              aria-hidden="true"
              className="animate-loader-caret absolute top-1/2 block h-[10px] w-[5px] -translate-y-1/2 bg-[var(--terminal-green)]"
              style={{ left: "calc(100% + 6px)" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
