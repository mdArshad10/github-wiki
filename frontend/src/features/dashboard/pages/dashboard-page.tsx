import { useMemo, useState } from "react"
import {
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Clock3,
  Code2,
  Database,
  GitBranch,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { Link } from "@tanstack/react-router"
import {
  repositories,
  type Repository,
  type RepositoryStatus,
} from "@/features/dashboard/data/mock-repositories"

const statusLabels: Record<RepositoryStatus, string> = {
  ready: "READY",
  indexing: "INDEXING",
  "not-indexed": "NOT INDEXED",
  failed: "FAILED",
}

const statusClasses: Record<RepositoryStatus, string> = {
  ready: "text-[var(--terminal-green)]",
  indexing: "text-[var(--terminal-amber)]",
  "not-indexed": "text-[var(--terminal-muted)]",
  failed: "text-[var(--terminal-red)]",
}

const metricCellClasses = [
  "border-r border-[var(--terminal-rule)]",
  "border-r border-[var(--terminal-rule)] max-[760px]:border-r-0",
  "border-r border-[var(--terminal-rule)] max-[1060px]:border-r-0 max-[760px]:border-r",
  "border-r border-[var(--terminal-rule)] max-[1060px]:border-t max-[760px]:border-r-0",
  "border-r-0 border-[var(--terminal-rule)] max-[1060px]:border-t max-[760px]:border-t",
]

const tableActionClass =
  "inline-flex min-h-[25px] items-center whitespace-nowrap border border-[var(--terminal-rule)] bg-transparent px-[7px] font-mono text-[9px] leading-none tracking-[0.05em] text-[var(--terminal-muted)] transition-colors hover:border-[var(--terminal-cyan)] hover:text-[var(--terminal-cyan)]"

const sectionEyebrowClass =
  "font-mono text-[9px] leading-none tracking-[0.14em] text-[var(--terminal-faint)]"

function metricCellClass(index: number) {
  return `min-h-[86px] px-[17px] py-[15px] ${metricCellClasses[index]}`
}

function StatusMark({ status }: { status: RepositoryStatus }) {
  if (status === "ready") return <CircleCheck size={14} />
  if (status === "failed") return <CircleAlert size={14} />
  if (status === "indexing")
    return (
      <RefreshCw size={13} className="animate-spin [animation-duration:1.5s]" />
    )
  return <Clock3 size={13} />
}

function RepoAction({
  repo,
  onIndex,
}: {
  repo: Repository
  onIndex: (id: string) => void
}) {
  if (repo.status === "ready")
    return (
      <Link
        to="/repo/$repoId"
        params={{ repoId: repo.id }}
        className={`${tableActionClass} border-[#2d625e] text-[var(--terminal-green)] no-underline`}
      >
        OPEN CHAT <span className="pl-[6px] text-[13px]">↗</span>
      </Link>
    )
  if (repo.status === "indexing")
    return (
      <span
        className={`${tableActionClass} border-transparent text-[var(--terminal-amber)]`}
      >
        {repo.progress}% COMPLETE
      </span>
    )
  if (repo.status === "failed")
    return (
      <button
        className={`${tableActionClass} border-[#65522d] text-[var(--terminal-amber)]`}
        type="button"
        onClick={() => onIndex(repo.id)}
      >
        RETRY INDEXING <span className="pl-[6px] text-[13px]">↻</span>
      </button>
    )
  return (
    <button
      className={tableActionClass}
      type="button"
      onClick={() => onIndex(repo.id)}
    >
      INDEX REPO <span className="pl-[6px] text-[13px]">+</span>
    </button>
  )
}

export function DashboardPage() {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("ALL REPOS")
  const [repoRows, setRepoRows] = useState(repositories)

  const filteredRepos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return repoRows.filter((repo) => {
      const matchesSearch =
        !normalizedSearch ||
        repo.name.includes(normalizedSearch) ||
        repo.description.toLowerCase().includes(normalizedSearch)
      const matchesFilter =
        activeFilter === "ALL REPOS" ||
        (activeFilter === "READY" && repo.status === "ready") ||
        (activeFilter === "ACTION NEEDED" &&
          (repo.status === "not-indexed" || repo.status === "failed"))
      return matchesSearch && matchesFilter
    })
  }, [activeFilter, repoRows, search])

  function indexRepo(id: string) {
    setRepoRows((current) =>
      current.map((repo) =>
        repo.id === id ? { ...repo, status: "indexing", progress: 8 } : repo
      )
    )
    window.setTimeout(() => {
      setRepoRows((current) =>
        current.map((repo) =>
          repo.id === id
            ? {
                ...repo,
                status: "ready",
                progress: undefined,
                indexedAt: "just now",
              }
            : repo
        )
      )
    }, 1500)
  }

  return (
    <AppShell
      pageLabel="WORKSPACE"
      pageTitle="Repository control"
      pageMeta="05 visible"
      headerActions={
        <button
          className="inline-flex min-h-[32px] items-center gap-2 border border-[var(--terminal-cyan)] bg-[var(--terminal-cyan)] px-3 font-mono text-[10px] leading-none tracking-[0.08em] text-[#091113] transition-colors hover:bg-[#8de0df]"
          type="button"
        >
          <Plus size={15} /> NEW SESSION
        </button>
      }
    >
      <div className="grid grid-cols-5 border border-[var(--terminal-rule)] bg-[var(--terminal-surface)] max-[1060px]:grid-cols-3 max-[760px]:grid-cols-2">
        <div className={metricCellClass(0)}>
          <span className="font-mono text-[9px] leading-none tracking-[0.08em] text-[var(--terminal-muted)]">
            VISIBLE REPOS
          </span>
          <strong className="mt-[9px] block font-mono text-[22px] leading-none font-medium text-[var(--terminal-text)]">
            12
          </strong>
          <small className="mt-2 block font-mono text-[9px] leading-none text-[var(--terminal-muted)]">
            +2 this week
          </small>
        </div>
        <div className={metricCellClass(1)}>
          <span className="font-mono text-[9px] leading-none tracking-[0.08em] text-[var(--terminal-muted)]">
            INDEXED
          </span>
          <strong className="mt-[9px] block font-mono text-[22px] leading-none font-medium text-[var(--terminal-text)]">
            07
          </strong>
          <small className="mt-2 block font-mono text-[9px] leading-none text-[var(--terminal-green)]">
            58.3% coverage
          </small>
        </div>
        <div className={metricCellClass(2)}>
          <span className="font-mono text-[9px] leading-none tracking-[0.08em] text-[var(--terminal-muted)]">
            KNOWLEDGE BASE
          </span>
          <strong className="mt-[9px] block font-mono text-[22px] leading-none font-medium text-[var(--terminal-text)]">
            1.8
            <span className="ml-[3px] text-[12px] text-[var(--terminal-muted)]">
              GB
            </span>
          </strong>
          <small className="mt-2 block font-mono text-[9px] leading-none text-[var(--terminal-muted)]">
            4,281 documents
          </small>
        </div>
        <div className={metricCellClass(3)}>
          <span className="font-mono text-[9px] leading-none tracking-[0.08em] text-[var(--terminal-muted)]">
            QUOTA
          </span>
          <strong className="mt-[9px] block font-mono text-[22px] leading-none font-medium text-[var(--terminal-text)]">
            62
            <span className="ml-[3px] text-[12px] text-[var(--terminal-muted)]">
              %
            </span>
          </strong>
          <div className="mt-[11px] h-[3px] bg-[#1b2a30]">
            <span
              className="block h-full bg-[var(--terminal-amber)]"
              style={{ width: "62%" }}
            />
          </div>
        </div>
        <div className={`${metricCellClass(4)} max-[760px]:col-span-2`}>
          <span className="font-mono text-[9px] leading-none tracking-[0.08em] text-[var(--terminal-muted)]">
            PIPELINE
          </span>
          <strong className="mt-[9px] flex items-center gap-[7px] font-mono text-[13px] leading-none font-medium text-[var(--terminal-green)]">
            <Zap size={15} /> NOMINAL
          </strong>
          <small className="mt-2 block font-mono text-[9px] leading-none text-[var(--terminal-muted)]">
            last event 00:04 ago
          </small>
        </div>
      </div>

      <div className="flex min-h-[67px] items-center justify-between gap-4 border-b border-[var(--terminal-rule)] max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:justify-center max-[760px]:py-3">
        <div className="flex w-[290px] min-w-0 items-center gap-2 text-[var(--terminal-muted)] max-[760px]:w-full">
          <Search size={15} className="shrink-0" />
          <input
            className="min-w-0 flex-1 border-0 bg-transparent font-mono text-[11px] leading-none text-[var(--terminal-text)] outline-none placeholder:text-[var(--terminal-faint)]"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter repositories..."
          />
          <kbd className="ml-auto border border-[var(--terminal-rule)] px-[5px] py-[3px] font-mono text-[9px] leading-none text-[var(--terminal-faint)]">
            /
          </kbd>
        </div>
        <div className="flex gap-[5px] overflow-x-auto max-[760px]:pb-1">
          {["ALL REPOS", "READY", "ACTION NEEDED"].map((filter) => (
            <button
              key={filter}
              type="button"
              className={`inline-flex min-h-[26px] shrink-0 items-center gap-[5px] border px-2 font-mono text-[9px] leading-none tracking-[0.06em] transition-colors ${activeFilter === filter ? "border-[var(--terminal-rule)] bg-[#0d1518] text-[var(--terminal-cyan)]" : "border-transparent bg-transparent text-[var(--terminal-muted)] hover:border-[var(--terminal-rule)] hover:bg-[#0d1518] hover:text-[var(--terminal-text)]"}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
          <button
            className="inline-flex min-h-[26px] shrink-0 items-center gap-[5px] border border-transparent bg-transparent px-2 font-mono text-[9px] leading-none tracking-[0.06em] text-[var(--terminal-muted)] transition-colors hover:border-[var(--terminal-rule)] hover:bg-[#0d1518] hover:text-[var(--terminal-text)]"
            type="button"
          >
            LANGUAGE <ChevronDown size={13} />
          </button>
        </div>
      </div>

      <section className="mt-[26px] border border-[var(--terminal-rule)] bg-[var(--terminal-surface)]">
        <div className="flex items-end justify-between border-b border-[var(--terminal-rule)] px-[18px] pt-[18px] pb-[15px] max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-3">
          <div>
            <span className={sectionEyebrowClass}>SOURCE REGISTRY</span>
            <h2 className="mt-[7px] font-mono text-[16px] leading-none font-medium tracking-[-0.03em] text-[#e7f0ef]">
              Repositories
            </h2>
          </div>
          <div className="flex items-center gap-[18px] font-mono text-[9px] leading-none text-[var(--terminal-muted)] max-[760px]:flex-wrap">
            <span className="inline-flex items-center gap-[6px] font-mono text-[9px] leading-none tracking-[0.06em]">
              <ShieldCheck size={14} /> GITHUB OAUTH
            </span>
            <span className="font-mono text-[9px] leading-none tracking-[0.06em]">
              SYNCED 00:04 AGO
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse">
            <thead>
              <tr>
                {[
                  "REPOSITORY",
                  "LANGUAGE",
                  "VISIBILITY",
                  "ACTIVITY",
                  "INDEX STATE",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="h-[34px] border-b border-[var(--terminal-rule)] px-[14px] text-left font-mono text-[9px] leading-none font-normal tracking-[0.12em] text-[var(--terminal-faint)]"
                  >
                    {heading}
                  </th>
                ))}
                <th
                  className="h-[34px] border-b border-[var(--terminal-rule)] px-[14px] text-left"
                  aria-label="Actions"
                />
              </tr>
            </thead>
            <tbody>
              {filteredRepos.map((repo) => (
                <tr
                  key={repo.id}
                  className="transition-colors hover:bg-[#0e171b] last:[&>td]:border-b-0"
                >
                  <td className="border-b border-[var(--terminal-rule-soft)] p-[14px] align-middle">
                    <div className="flex min-w-[260px] items-center gap-2.5">
                      <span className="grid h-[25px] w-[25px] shrink-0 place-items-center border border-[#2d555c] bg-[#0b181b] text-[var(--terminal-cyan)]">
                        <Code2 size={15} />
                      </span>
                      <div className="flex min-w-0 flex-col gap-[5px]">
                        <strong className="font-mono text-[12px] leading-none font-semibold text-[var(--terminal-text)]">
                          {repo.name}
                        </strong>
                        <small className="max-w-[280px] overflow-hidden font-mono text-[10px] leading-[1.2] text-ellipsis whitespace-nowrap text-[var(--terminal-muted)]">
                          {repo.description}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-[var(--terminal-rule-soft)] p-[14px] align-middle">
                    <span className="inline-flex items-center gap-[6px] font-mono text-[10px] leading-none text-[#a8b8ba]">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: repo.languageColor }}
                      />
                      {repo.language}
                    </span>
                  </td>
                  <td className="border-b border-[var(--terminal-rule-soft)] p-[14px] align-middle">
                    <span
                      className={`inline-flex items-center border px-[6px] py-1 font-mono text-[8px] leading-none tracking-[0.1em] ${repo.visibility === "PRIVATE" ? "border-[#574b2d] text-[var(--terminal-amber)]" : "border-[#2a3a40] text-[var(--terminal-muted)]"}`}
                    >
                      {repo.visibility}
                    </span>
                  </td>
                  <td className="border-b border-[var(--terminal-rule-soft)] p-[14px] align-middle">
                    <div className="inline-flex items-center gap-2.5 font-mono text-[10px] leading-none text-[var(--terminal-muted)]">
                      <span className="inline-flex items-center gap-1">
                        <Star
                          size={13}
                          className="text-[var(--terminal-faint)]"
                        />{" "}
                        {repo.stars}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitBranch
                          size={13}
                          className="text-[var(--terminal-faint)]"
                        />{" "}
                        {repo.forks}
                      </span>
                      <small className="text-[var(--terminal-faint)]">
                        {repo.updatedAt}
                      </small>
                    </div>
                  </td>
                  <td className="border-b border-[var(--terminal-rule-soft)] p-[14px] align-middle">
                    <div className="flex min-w-[165px] flex-col gap-[7px]">
                      <span
                        className={`inline-flex w-fit items-center gap-[5px] font-mono text-[9px] leading-none tracking-[0.08em] ${statusClasses[repo.status]}`}
                      >
                        <StatusMark status={repo.status} />{" "}
                        {statusLabels[repo.status]}
                      </span>
                      {repo.status === "indexing" && (
                        <div className="h-[3px] w-[108px] bg-[#1b2a30]">
                          <span
                            className="block h-full bg-[var(--terminal-amber)]"
                            style={{ width: `${repo.progress ?? 0}%` }}
                          />
                        </div>
                      )}
                      {repo.outdated && (
                        <small className="font-mono text-[9px] leading-none text-[var(--terminal-amber)]">
                          OUTDATED · RE-INDEX AVAILABLE
                        </small>
                      )}
                      {repo.status === "ready" && repo.indexedAt && (
                        <small className="font-mono text-[9px] leading-none text-[var(--terminal-muted)]">
                          indexed {repo.indexedAt}
                        </small>
                      )}
                    </div>
                  </td>
                  <td className="border-b border-[var(--terminal-rule-soft)] p-[14px] align-middle">
                    <div className="flex justify-end gap-2">
                      <RepoAction repo={repo} onIndex={indexRepo} />
                      <button
                        className="grid h-[25px] w-[25px] place-items-center border border-[var(--terminal-rule)] bg-transparent text-[var(--terminal-muted)] transition-colors hover:border-[var(--terminal-cyan)] hover:text-[var(--terminal-cyan)]"
                        type="button"
                        aria-label={`More actions for ${repo.name}`}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRepos.length === 0 && (
            <div className="flex min-h-[160px] items-center justify-center gap-2 font-mono text-[11px] leading-none text-[var(--terminal-muted)]">
              <Database size={18} />
              <span>No repositories match this filter.</span>
            </div>
          )}
        </div>
        <div className="flex min-h-[39px] items-center justify-between border-t border-[var(--terminal-rule)] px-[14px] font-mono text-[9px] leading-none tracking-[0.06em] text-[var(--terminal-faint)] max-[760px]:gap-3 max-[760px]:overflow-x-auto">
          <span className="shrink-0">
            SHOWING {filteredRepos.length.toString().padStart(2, "0")} OF 12
            REPOSITORIES
          </span>
          <span className="shrink-0">
            SCROLL TO LOAD MORE{" "}
            <span className="text-[var(--terminal-green)]">↓</span>
          </span>
        </div>
      </section>

      <div className="mt-[14px] grid grid-cols-[1.2fr_0.8fr] gap-[14px] max-[1060px]:grid-cols-1">
        <section className="min-h-[160px] border border-[var(--terminal-rule)] bg-[var(--terminal-surface)] p-[17px]">
          <div className="flex items-end justify-between">
            <div>
              <span className={sectionEyebrowClass}>LIVE FEED</span>
              <h2 className="mt-[7px] font-mono text-[16px] leading-none font-medium tracking-[-0.03em] text-[#e7f0ef]">
                Recent activity
              </h2>
            </div>
            <button
              className="inline-flex items-center gap-1.5 border-0 bg-transparent font-mono text-[9px] leading-none tracking-[0.06em] text-[var(--terminal-cyan)] transition-colors hover:text-[#a5eeee]"
              type="button"
            >
              VIEW LOG <span>↗</span>
            </button>
          </div>
          <div className="mt-[17px]">
            <div className="grid min-h-[31px] grid-cols-[62px_10px_1fr] items-center gap-2 border-t border-[var(--terminal-rule-soft)]">
              <span className="font-mono text-[9px] leading-none text-[var(--terminal-faint)]">
                14:32:08
              </span>
              <span className="h-[5px] w-[5px] rounded-full bg-[var(--terminal-green)]" />
              <p className="m-0 font-mono text-[10px] leading-none text-[var(--terminal-muted)]">
                <strong className="font-medium text-[var(--terminal-text)]">
                  atlas-core
                </strong>{" "}
                index completed{" "}
                <em className="text-[var(--terminal-faint)] not-italic">
                  +1,244 docs
                </em>
              </p>
            </div>
            <div className="grid min-h-[31px] grid-cols-[62px_10px_1fr] items-center gap-2 border-t border-[var(--terminal-rule-soft)]">
              <span className="font-mono text-[9px] leading-none text-[var(--terminal-faint)]">
                14:26:41
              </span>
              <span className="h-[5px] w-[5px] rounded-full bg-[var(--terminal-cyan)]" />
              <p className="m-0 font-mono text-[10px] leading-none text-[var(--terminal-muted)]">
                <strong className="font-medium text-[var(--terminal-text)]">
                  pasdigital
                </strong>{" "}
                opened session{" "}
                <em className="text-[var(--terminal-faint)] not-italic">
                  “trace the auth boundary”
                </em>
              </p>
            </div>
            <div className="grid min-h-[31px] grid-cols-[62px_10px_1fr] items-center gap-2 border-t border-[var(--terminal-rule-soft)]">
              <span className="font-mono text-[9px] leading-none text-[var(--terminal-faint)]">
                14:18:03
              </span>
              <span className="h-[5px] w-[5px] rounded-full bg-[var(--terminal-amber)]" />
              <p className="m-0 font-mono text-[10px] leading-none text-[var(--terminal-muted)]">
                <strong className="font-medium text-[var(--terminal-text)]">
                  sdk-python
                </strong>{" "}
                indexing started{" "}
                <em className="text-[var(--terminal-faint)] not-italic">
                  branch: main
                </em>
              </p>
            </div>
          </div>
        </section>
        <section className="relative flex min-h-[160px] items-start gap-[13px] border border-[var(--terminal-rule)] bg-[var(--terminal-surface)] p-[17px]">
          <div className="grid h-[34px] w-[34px] shrink-0 place-items-center border border-[#66532c] text-[var(--terminal-amber)]">
            <Zap size={18} />
          </div>
          <div>
            <span className={sectionEyebrowClass}>NEXT ACTION</span>
            <h2 className="my-[7px] mt-2 font-mono text-[15px] leading-none font-medium text-[var(--terminal-text)]">
              Ask your first question
            </h2>
            <p className="m-0 max-w-[255px] font-mono text-[10px] leading-[1.5] text-[var(--terminal-muted)]">
              Open any ready repository to start a grounded chat session.
            </p>
          </div>
          <Link
            to="/repo/$repoId"
            params={{ repoId: "atlas-core" }}
            className="absolute right-[17px] bottom-[17px] grid h-[30px] w-[30px] place-items-center border border-[#2d555c] text-[var(--terminal-cyan)] no-underline transition-colors hover:bg-[#112428]"
          >
            ↗
          </Link>
        </section>
      </div>
    </AppShell>
  )
}
