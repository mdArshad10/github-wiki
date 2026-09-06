import { useCallback, useMemo, useState } from "react"
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import {
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Clock3,
  Code2,
  Database,
  GitBranch,
  MoreHorizontal,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react"

import { Link } from "@tanstack/react-router"
import {
  type Repository,
  type RepositoryStatus,
} from "@/features/dashboard/data/mock-repositories"
import type { DashboardTab } from "@/features/dashboard/dashboard-tabs"
import { type Repository as ApiRepository } from "@/features/dashboard/api/apiRepo"
import { Button } from "@base-ui/react"
import { useFetchReposQuery, useGetAllRepoQuery } from "../api/repos.query"

const statusLabels: Record<RepositoryStatus, string> = {
  ready: "READY",
  indexing: "INDEXING",
  "not-indexed": "NOT INDEXED",
  failed: "FAILED",
}

const statusClasses: Record<RepositoryStatus, string> = {
  ready: "text-(--terminal-green)",
  indexing: "text-(--terminal-amber)",
  "not-indexed": "text-(--terminal-muted)",
  failed: "text-(--terminal-red)",
}

const metricCellClasses = [
  "border-r border-(--terminal-rule)",
  "border-r border-(--terminal-rule) max-[760px]:border-r-0",
  "border-r border-(--terminal-rule) max-[1060px]:border-r-0 max-[760px]:border-r",
  "border-r border-(--terminal-rule) max-[1060px]:border-t max-[760px]:border-r-0",
  "border-r-0 border-(--terminal-rule) max-[1060px]:border-t max-[760px]:border-t",
]

const tableActionClass =
  "inline-flex min-h-[25px] items-center whitespace-nowrap border border-[var(--terminal-rule)] bg-transparent px-[7px] font-mono text-[9px] leading-none tracking-[0.05em] text-[var(--terminal-muted)] transition-colors hover:border-[var(--terminal-cyan)] hover:text-[var(--terminal-cyan)]"

const sectionEyebrowClass =
  "font-mono text-[9px] leading-none tracking-[0.14em] text-[var(--terminal-faint)]"

const repositoryTableFeatures = tableFeatures({})
const repositoryColumnHelper = createColumnHelper<
  typeof repositoryTableFeatures,
  Repository
>()

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

function repositoryColumns(onIndex: (id: string) => void) {
  return repositoryColumnHelper.columns([
    repositoryColumnHelper.accessor("name", {
      header: "REPOSITORY",
      cell: ({ row }) => {
        const repo = row.original

        return (
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
        )
      },
    }),
    repositoryColumnHelper.accessor("language", {
      header: "LANGUAGE",
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-[6px] font-mono text-[10px] leading-none text-[#a8b8ba]">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: row.original.languageColor }}
          />
          {row.original.language}
        </span>
      ),
    }),
    repositoryColumnHelper.accessor("visibility", {
      header: "VISIBILITY",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center border px-[6px] py-1 font-mono text-[8px] leading-none tracking-[0.1em] ${row.original.visibility === "PRIVATE" ? "border-[#574b2d] text-[var(--terminal-amber)]" : "border-[#2a3a40] text-[var(--terminal-muted)]"}`}
        >
          {row.original.visibility}
        </span>
      ),
    }),
    repositoryColumnHelper.accessor("updatedAt", {
      header: "ACTIVITY",
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-2.5 font-mono text-[10px] leading-none text-[var(--terminal-muted)]">
          <span className="inline-flex items-center gap-1">
            <Star size={13} className="text-[var(--terminal-faint)]" />
            {row.original.stars}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitBranch size={13} className="text-[var(--terminal-faint)]" />
            {row.original.forks}
          </span>
          <small className="text-[var(--terminal-faint)]">
            {row.original.updatedAt}
          </small>
        </div>
      ),
    }),
    repositoryColumnHelper.accessor("status", {
      header: "INDEX STATE",
      cell: ({ row }) => {
        const repo = row.original

        return (
          <div className="flex min-w-[165px] flex-col gap-[7px]">
            <span
              className={`inline-flex w-fit items-center gap-[5px] font-mono text-[9px] leading-none tracking-[0.08em] ${statusClasses[repo.status]}`}
            >
              <StatusMark status={repo.status} /> {statusLabels[repo.status]}
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
        )
      },
    }),
    repositoryColumnHelper.display({
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <RepoAction repo={row.original} onIndex={onIndex} />
          <button
            className="grid h-[25px] w-[25px] place-items-center border border-[var(--terminal-rule)] bg-transparent text-[var(--terminal-muted)] transition-colors hover:border-[var(--terminal-cyan)] hover:text-[var(--terminal-cyan)]"
            type="button"
            aria-label={`More actions for ${row.original.name}`}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      ),
    }),
  ])
}

function toDashboardRepository(repo: ApiRepository): Repository {
  const progress = repo.indexingProgress.totalFiles
    ? Math.round(
        (repo.indexingProgress.filesProcessed /
          repo.indexingProgress.totalFiles) *
          100
      )
    : undefined

  return {
    id: repo._id,
    name: repo.fullName,
    description: `${repo.defaultBranch} branch · GitHub repository`,
    language: repo.language ?? "Unknown",
    languageColor: "#58c6cc",
    visibility: repo.private ? "PRIVATE" : "PUBLIC",
    stars: repo.stars,
    forks: 0,
    status:
      repo.indexingStatus === "not_indexed"
        ? "not-indexed"
        : repo.indexingStatus,
    progress,
    size: "—",
    updatedAt: repo.updatedAt ?? "unknown",
    indexedAt: repo.lastIndexedAt ?? undefined,
    outdated: repo.isOutdated,
  }
}

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

function ActivityView() {
  return (
    <div className="grid gap-3.5">
      <section className="border border-(--terminal-rule) bg-(--terminal-surface)">
        <div className="border-b border-(--terminal-rule) px-4.5 pt-4.5 pb-3.75">
          <span className={sectionEyebrowClass}>WORKSPACE LOG</span>
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
            <span className={sectionEyebrowClass}>{label}</span>
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

type DashboardPageProps = {
  view?: DashboardTab
}

export function DashboardPage({ view = "overview" }: DashboardPageProps) {
  const [search, setSearch] = useState("")
  const [activeFilter, setActiveFilter] = useState("ALL REPOS")
  const [repoRowsOverride, setRepoRowsOverride] = useState<Repository[] | null>(
    null
  )
  const activeTab = view
  const {
    data: fetchedRepos,
    isFetching,
    refetch,
    error: fetchReposError,
  } = useFetchReposQuery()
  const {
    data: allRepoData,
    isLoading,
    error: getAllReposError,
  } = useGetAllRepoQuery()

  const queryRepoRows = useMemo(
    () => (fetchedRepos ?? allRepoData ?? []).map(toDashboardRepository),
    [allRepoData, fetchedRepos]
  )
  const repoRows = repoRowsOverride ?? queryRepoRows

  const filteredRepos = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return repoRows.filter((repo) => {
      const matchesSearch =
        !normalizedSearch ||
        repo?.name?.includes(normalizedSearch) ||
        repo?.description?.toLowerCase().includes(normalizedSearch)
      const matchesFilter =
        activeFilter === "ALL REPOS" ||
        (activeFilter === "READY" && repo.status === "ready") ||
        (activeFilter === "ACTION NEEDED" &&
          (repo?.status === "not-indexed" || repo.status === "failed"))
      return matchesSearch && matchesFilter
    })
  }, [activeFilter, repoRows, search])

  const indexRepo = useCallback(
    (id: string) => {
      setRepoRowsOverride((current) =>
        (current ?? repoRows).map((repo) =>
          repo.id === id ? { ...repo, status: "indexing", progress: 8 } : repo
        )
      )
      window.setTimeout(() => {
        setRepoRowsOverride((current) =>
          (current ?? repoRows).map((repo) =>
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
    },
    [repoRows]
  )

  const columns = useMemo(() => repositoryColumns(indexRepo), [indexRepo])
  const table = useTable({
    features: repositoryTableFeatures,
    columns,
    data: filteredRepos,
    getRowId: (row) => row.id,
  })

  const repositoryError = fetchReposError ?? getAllReposError

  const handleFetchRepositories = useCallback(() => {
    setRepoRowsOverride(null)
    void refetch()
  }, [refetch])

  return (
    <>
      {activeTab === "activity" ? (
        <ActivityView />
      ) : (
        <>
          <div className="grid grid-cols-5 border border-(--terminal-rule) bg-(--terminal-surface) max-[1060px]:grid-cols-3 max-[760px]:grid-cols-2">
            <div className={metricCellClass(0)}>
              <span className="font-mono text-[9px] leading-none tracking-[0.08em] text-(--terminal-muted)">
                VISIBLE REPOS
              </span>
              <strong className="mt-2.25 block font-mono text-[22px] leading-none font-medium text-(--terminal-text)">
                12
              </strong>
              <small className="mt-2 block font-mono text-[9px] leading-none text-(--terminal-muted)">
                +2 this week
              </small>
            </div>
            <div className={metricCellClass(1)}>
              <span className="font-mono text-[9px] leading-none tracking-[0.08em] text-(--terminal-muted)">
                INDEXED
              </span>
              <strong className="mt-2.25 block font-mono text-[22px] leading-none font-medium text-(--terminal-text)">
                07
              </strong>
              <small className="mt-2 block font-mono text-[9px] leading-none text-(--terminal-green)">
                58.3% coverage
              </small>
            </div>
            <div className={metricCellClass(2)}>
              <span className="font-mono text-[9px] leading-none tracking-[0.08em] text-(--terminal-muted)">
                KNOWLEDGE BASE
              </span>
              <strong className="mt-2.25 block font-mono text-[22px] leading-none font-medium text-(--terminal-text)">
                1.8
                <span className="ml-0.75 text-[12px] text-(--terminal-muted)">
                  GB
                </span>
              </strong>
              <small className="mt-2 block font-mono text-[9px] leading-none text-(--terminal-muted)">
                4,281 documents
              </small>
            </div>
            <div className={metricCellClass(3)}>
              <span className="font-mono text-[9px] leading-none tracking-[0.08em] text-(--terminal-muted)">
                QUOTA
              </span>
              <strong className="mt-2.25 block font-mono text-[22px] leading-none font-medium text-(--terminal-text)">
                62
                <span className="ml-0.75 text-[12px] text-(--terminal-muted)">
                  %
                </span>
              </strong>
              <div className="mt-2.75 h-0.75 bg-[#1b2a30]">
                <span
                  className="block h-full bg-(--terminal-amber)"
                  style={{ width: "62%" }}
                />
              </div>
            </div>
            <div className={`${metricCellClass(4)} max-[760px]:col-span-2`}>
              <span className="font-mono text-[9px] leading-none tracking-[0.08em] text-(--terminal-muted)">
                PIPELINE
              </span>
              <strong className="mt-2.25 flex items-center gap-1.75 font-mono text-[13px] leading-none font-medium text-(--terminal-green)">
                <Zap size={15} /> NOMINAL
              </strong>
              <small className="mt-2 block font-mono text-[9px] leading-none text-(--terminal-muted)">
                last event 00:04 ago
              </small>
            </div>
          </div>

          {activeTab === "repositories" && (
            <>
              <div className="flex min-h-16.75 items-center justify-between gap-4 border-b border-(--terminal-rule) max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:justify-center max-[760px]:py-3">
                <div className="flex w-72.5 min-w-0 items-center gap-2 text-(--terminal-muted) max-[760px]:w-full">
                  <Search size={15} className="shrink-0" />
                  <input
                    className="min-w-0 flex-1 border-0 bg-transparent font-mono text-[11px] leading-none text-(--terminal-text) outline-none placeholder:text-(--terminal-faint)"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Filter repositories..."
                  />
                  <kbd className="ml-auto border border-(--terminal-rule) px-1.25 py-0.75 font-mono text-[9px] leading-none text-(--terminal-faint)">
                    /
                  </kbd>
                </div>
                <div className="flex gap-1.25 overflow-x-auto max-[760px]:pb-1">
                  {["ALL REPOS", "READY", "ACTION NEEDED"].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={`inline-flex min-h-6.5 shrink-0 items-center gap-1.25 border px-2 font-mono text-[9px] leading-none tracking-[0.06em] transition-colors ${activeFilter === filter ? "border-(--terminal-rule) bg-[#0d1518] text-(--terminal-cyan)" : "border-transparent bg-transparent text-(--terminal-muted) hover:border-(--terminal-rule) hover:bg-[#0d1518] hover:text-(--terminal-text)"}`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                  <button
                    className="inline-flex min-h-[26px] shrink-0 items-center gap-[5px] border border-transparent bg-transparent px-2 font-mono text-[9px] leading-none tracking-[0.06em] text-(--terminal-muted) transition-colors hover:border-(--terminal-rule) hover:bg-[#0d1518] hover:text-(--terminal-text)"
                    type="button"
                  >
                    LANGUAGE <ChevronDown size={13} />
                  </button>
                </div>
              </div>

              <section className="mt-6.5 border border-(--terminal-rule) bg-(--terminal-surface)">
                <div className="flex items-end justify-between border-b border-(--terminal-rule) px-4.5 pt-4.5 pb-3.75 max-[760px]:flex-col max-[760px]:items-start max-[760px]:gap-3">
                  <div>
                    <span className={sectionEyebrowClass}>SOURCE REGISTRY</span>
                    <h2 className="mt-1.75 font-mono text-[16px] leading-none font-medium tracking-[-0.03em] text-[#e7f0ef]">
                      Repositories
                    </h2>
                  </div>
                  <div className="flex items-center gap-4.5 font-mono text-[9px] leading-none text-(--terminal-muted) max-[760px]:flex-wrap">
                    <span className="gap- inline-flex items-center font-mono text-[9px] leading-none tracking-[0.06em]">
                      <ShieldCheck size={14} /> GITHUB OAUTH
                    </span>
                    <span className="font-mono text-[9px] leading-none tracking-[0.06em]">
                      SYNCED 00:04 AGO
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-240 border-collapse">
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <th
                              key={header.id}
                              className="h-8.5 border-b border-(--terminal-rule) px-3.5 text-left font-mono text-[9px] leading-none font-normal tracking-[0.12em] text-(--terminal-faint)"
                              aria-label={
                                header.id === "actions" ? "Actions" : undefined
                              }
                            >
                              {header.isPlaceholder ? null : (
                                <table.FlexRender header={header} />
                              )}
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td
                            colSpan={table.getAllLeafColumns().length}
                            className="border-(--terminal-rule-oft)] h-40 border-b p-3.5 text-center align-middle"
                          >
                            <span className="inline-flex items-center gap-2 font-mono text-[11px] leading-none text-(--terminal-muted)">
                              <RefreshCw
                                size={16}
                                className="animate-spin animation-duration-[1.5s]"
                              />
                              LOADING REPOSITORIES...
                            </span>
                          </td>
                        </tr>
                      ) : (
                        table.getRowModel().rows.map((row) => (
                          <tr
                            key={row.id}
                            className="transition-colors hover:bg-[#0e171b] last:[&>td]:border-b-0"
                          >
                            {row.getAllCells().map((cell) => (
                              <td
                                key={cell.id}
                                className="border-(--terminal-rule-oft)] border-b p-3.5 align-middle"
                              >
                                <table.FlexRender cell={cell} />
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                      {!isLoading && table.getRowModel().rows.length === 0 && (
                        <tr>
                          <td
                            colSpan={table.getAllLeafColumns().length}
                            className="border-(--terminal-rule-oft)] h-40 border-b p-3.5 text-center align-middle"
                          >
                            <div className="inline-flex flex-col items-center gap-4 font-mono text-[11px] leading-none text-(--terminal-muted)">
                              <div className="flex flex-col items-center gap-2">
                                <Database size={18} />
                                <span>No repositories match this filter.</span>
                              </div>
                              {repositoryError && (
                                <span className="max-w-[320px] text-center text-(--terminal-red)">
                                  {repositoryError.message}
                                </span>
                              )}
                              <Button
                                className="inline-flex min-h-[28px] items-center border border-(--terminal-cyan) bg-(--terminal-cyan) px-3 font-mono text-[9px] leading-none tracking-[0.08em] text-[#091113] transition-colors hover:bg-[#8de0df]"
                                type="button"
                                onClick={handleFetchRepositories}
                                disabled={isFetching}
                              >
                                {isFetching
                                  ? "FETCHING REPOS..."
                                  : "FETCH ALL REPOS"}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex min-h-[39px] items-center justify-between border-t border-(--terminal-rule) px-[14px] font-mono text-[9px] leading-none tracking-[0.06em] text-(--terminal-faint) max-[760px]:gap-3 max-[760px]:overflow-x-auto">
                  <span className="shrink-0">
                    SHOWING {filteredRepos.length.toString().padStart(2, "0")}{" "}
                    OF 12 REPOSITORIES
                  </span>
                  <span className="shrink-0">
                    SCROLL TO LOAD MORE{" "}
                    <span className="text-(--terminal-green)">↓</span>
                  </span>
                </div>
              </section>
            </>
          )}

          <div className="mt-[14px] grid grid-cols-[1.2fr_0.8fr] gap-[14px] max-[1060px]:grid-cols-1">
            <section className="min-h-40 border border-(--terminal-rule) bg-(--terminal-surface) p-[17px]">
              <div className="flex items-end justify-between">
                <div>
                  <span className={sectionEyebrowClass}>LIVE FEED</span>
                  <h2 className="mt-[7px] font-mono text-[16px] leading-none font-medium tracking-[-0.03em] text-[#e7f0ef]">
                    Recent activity
                  </h2>
                </div>
                <button
                  className="inline-flex items-center gap-1.5 border-0 bg-transparent font-mono text-[9px] leading-none tracking-[0.06em] text-(--terminal-cyan) transition-colors hover:text-[#a5eeee]"
                  type="button"
                >
                  VIEW LOG <span>↗</span>
                </button>
              </div>
              <div className="mt-[17px]">
                <div className="border-(--terminal-rule-oft)] grid min-h-[31px] grid-cols-[62px_10px_1fr] items-center gap-2 border-t">
                  <span className="font-mono text-[9px] leading-none text-(--terminal-faint)">
                    14:32:08
                  </span>
                  <span className="h-[5px] w-[5px] rounded-full bg-(--terminal-green)" />
                  <p className="m-0 font-mono text-[10px] leading-none text-(--terminal-muted)">
                    <strong className="font-medium text-(--terminal-text)">
                      atlas-core
                    </strong>{" "}
                    index completed{" "}
                    <em className="text-(--terminal-faint) not-italic">
                      +1,244 docs
                    </em>
                  </p>
                </div>
                <div className="border-(--terminal-rule-oft)] grid min-h-[31px] grid-cols-[62px_10px_1fr] items-center gap-2 border-t">
                  <span className="font-mono text-[9px] leading-none text-(--terminal-faint)">
                    14:26:41
                  </span>
                  <span className="h-[5px] w-[5px] rounded-full bg-(--terminal-cyan)" />
                  <p className="m-0 font-mono text-[10px] leading-none text-(--terminal-muted)">
                    <strong className="font-medium text-(--terminal-text)">
                      pasdigital
                    </strong>{" "}
                    opened session{" "}
                    <em className="text-(--terminal-faint) not-italic">
                      “trace the auth boundary”
                    </em>
                  </p>
                </div>
                <div className="border-(--terminal-rule-oft)] grid min-h-[31px] grid-cols-[62px_10px_1fr] items-center gap-2 border-t">
                  <span className="font-mono text-[9px] leading-none text-(--terminal-faint)">
                    14:18:03
                  </span>
                  <span className="h-[5px] w-[5px] rounded-full bg-(--terminal-amber)" />
                  <p className="m-0 font-mono text-[10px] leading-none text-(--terminal-muted)">
                    <strong className="font-medium text-(--terminal-text)">
                      sdk-python
                    </strong>{" "}
                    indexing started{" "}
                    <em className="text-(--terminal-faint) not-italic">
                      branch: main
                    </em>
                  </p>
                </div>
              </div>
            </section>
            <section className="relative flex min-h-40 items-start gap-[13px] border border-(--terminal-rule) bg-(--terminal-surface) p-[17px]">
              <div className="grid h-[34px] w-[34px] shrink-0 place-items-center border border-[#66532c] text-(--terminal-amber)">
                <Zap size={18} />
              </div>
              <div>
                <span className={sectionEyebrowClass}>NEXT ACTION</span>
                <h2 className="my-[7px] mt-2 font-mono text-[15px] leading-none font-medium text-(--terminal-text)">
                  Ask your first question
                </h2>
                <p className="m-0 max-w-[255px] font-mono text-[10px] leading-[1.5] text-(--terminal-muted)">
                  Open any ready repository to start a grounded chat session.
                </p>
              </div>
              <Link
                to="/repo/$repoId"
                params={{ repoId: "atlas-core" }}
                className="absolute right-[17px] bottom-[17px] grid h-[30px] w-[30px] place-items-center border border-[#2d555c] text-(--terminal-cyan) no-underline transition-colors hover:bg-[#112428]"
              >
                ↗
              </Link>
            </section>
          </div>
        </>
      )}
    </>
  )
}

export function DashboardActivityPage() {
  return <DashboardPage view="activity" />
}

export function DashboardRepositoriesPage() {
  return <DashboardPage view="repositories" />
}
