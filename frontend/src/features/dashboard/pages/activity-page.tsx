import { cn } from "cn"

const activityEvents = [
  ["14:32:08", "green", "atlas-core", "index completed", "+1,244 docs"],
  [
    "14:26:41",
    "cyan",
    "pasdigital",
    "opened session",
    "trace the auth boundary",
  ],
  ["14:18:03", "amber", "sdk-python", "indexing started", "branch: main"],
  ["13:54:27", "cyan", "webhooks", "repository synced", "12 files changed"],
] as const

export const activityPage=()=> {
  return (
    <div className="grid gap-3.5">
      <section className="border border-(--terminal-rule) bg-(--terminal-surface)">
        <div className="border-b border-(--terminal-rule) px-4.5 pt-4.5 pb-3.75">
          <span className={cn('font-mono text-[9px] leading-none tracking-[0.14em] text-(--terminal-faint)')}>WORKSPACE LOG</span>
          <h2 className="mt-1.75 font-mono text-[16px] leading-none font-medium tracking-[-0.03em] text-[#e7f0ef]">
            Activity
          </h2>
        </div>
        <div className="px-4.5">
          {activityEvents.map(([time, tone, repository, action, detail]) => (
            <div
              key={`${time}-${repository}`}
              className="grid min-h-13.5 grid-cols-[72px_10px_minmax(0,1fr)] items-center gap-3 border-b border-(--terminal-rule-soft) last:border-b-0"
            >
              <span className="font-mono text-[9px] leading-none text-(--terminal-faint)">
                {time}
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full bg-[var(--terminal-${tone})]`}
              />
              <p className="m-0 font-mono text-[10px] leading-[1.4] text-(--terminal-muted)">
                <strong className="font-medium text-(--terminal-text)">
                  {repository}
                </strong>{" "}
                {action}{" "}
                <em className="text-(--terminal-faint) not-italic">{detail}</em>
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3.5 max-[760px]:grid-cols-1">
        {[
          ["INDEX EVENTS", "32", "this week"],
          ["SESSIONS OPENED", "18", "this week"],
          ["DOCUMENTS PROCESSED", "4,281", "across workspace"],
        ].map(([label, value, detail]) => (
          <section
            key={label}
            className="border border-(--terminal-rule) bg-(--terminal-surface) p-4.25"
          >
            <span className={cn('font-mono text-[9px] leading-none tracking-[0.14em] text-(--terminal-faint)')}>{label}</span>
            <strong className="mt-2.5 block font-mono text-[22px] leading-none font-medium text-(--terminal-text)">
              {value}
            </strong>
            <small className="mt-2 block font-mono text-[9px] leading-none text-(--terminal-muted)">
              {detail}
            </small>
          </section>
        ))}
      </div>
    </div>
  )
}
