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

function StatusMark({ status }: { status: RepositoryStatus }) {
  if (status === "ready") return <CircleCheck size={14} />
  if (status === "failed") return <CircleAlert size={14} />
  if (status === "indexing")
    return <RefreshCw size={13} className="spin-slow" />
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
        className="table-action primary"
      >
        OPEN CHAT <span>↗</span>
      </Link>
    )
  if (repo.status === "indexing")
    return (
      <span className="table-action is-disabled">
        {repo.progress}% COMPLETE
      </span>
    )
  if (repo.status === "failed")
    return (
      <button
        className="table-action warning"
        type="button"
        onClick={() => onIndex(repo.id)}
      >
        RETRY INDEXING <span>↻</span>
      </button>
    )
  return (
    <button
      className="table-action"
      type="button"
      onClick={() => onIndex(repo.id)}
    >
      INDEX REPO <span>+</span>
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
        <button className="solid-button" type="button">
          <Plus size={15} /> NEW SESSION
        </button>
      }
    >
      <div className="metric-strip">
        <div className="metric-cell">
          <span className="metric-label">VISIBLE REPOS</span>
          <strong>12</strong>
          <small>+2 this week</small>
        </div>
        <div className="metric-cell">
          <span className="metric-label">INDEXED</span>
          <strong>07</strong>
          <small className="green-text">58.3% coverage</small>
        </div>
        <div className="metric-cell">
          <span className="metric-label">KNOWLEDGE BASE</span>
          <strong>
            1.8<span className="metric-unit">GB</span>
          </strong>
          <small>4,281 documents</small>
        </div>
        <div className="metric-cell">
          <span className="metric-label">QUOTA</span>
          <strong>
            62<span className="metric-unit">%</span>
          </strong>
          <div className="metric-progress">
            <span style={{ width: "62%" }} />
          </div>
        </div>
        <div className="metric-cell metric-cell-status">
          <span className="metric-label">PIPELINE</span>
          <strong className="green-text">
            <Zap size={15} /> NOMINAL
          </strong>
          <small>last event 00:04 ago</small>
        </div>
      </div>

      <div className="section-toolbar">
        <div className="toolbar-search">
          <Search size={15} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Filter repositories..."
          />
          <kbd>/</kbd>
        </div>
        <div className="toolbar-filters">
          {["ALL REPOS", "READY", "ACTION NEEDED"].map((filter) => (
            <button
              key={filter}
              type="button"
              className={
                activeFilter === filter
                  ? "filter-button is-active"
                  : "filter-button"
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
          <button className="filter-button" type="button">
            LANGUAGE <ChevronDown size={13} />
          </button>
        </div>
      </div>

      <section className="repo-table-section">
        <div className="table-heading-row">
          <div>
            <span className="eyebrow">SOURCE REGISTRY</span>
            <h2>Repositories</h2>
          </div>
          <div className="table-heading-meta">
            <span>
              <ShieldCheck size={14} /> GITHUB OAUTH
            </span>
            <span>SYNCED 00:04 AGO</span>
          </div>
        </div>
        <div className="repo-table-wrap">
          <table className="repo-table">
            <thead>
              <tr>
                <th>REPOSITORY</th>
                <th>LANGUAGE</th>
                <th>VISIBILITY</th>
                <th>ACTIVITY</th>
                <th>INDEX STATE</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filteredRepos.map((repo) => (
                <tr key={repo.id}>
                  <td>
                    <div className="repo-name-cell">
                      <span className="repo-icon">
                        <Code2 size={15} />
                      </span>
                      <div>
                        <strong>{repo.name}</strong>
                        <small>{repo.description}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="language-label">
                      <span
                        className="language-dot"
                        style={{ backgroundColor: repo.languageColor }}
                      />
                      {repo.language}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        repo.visibility === "PRIVATE"
                          ? "visibility-label private"
                          : "visibility-label"
                      }
                    >
                      {repo.visibility}
                    </span>
                  </td>
                  <td>
                    <div className="activity-cell">
                      <span>
                        <Star size={13} /> {repo.stars}
                      </span>
                      <span>
                        <GitBranch size={13} /> {repo.forks}
                      </span>
                      <small>{repo.updatedAt}</small>
                    </div>
                  </td>
                  <td>
                    <div className="index-state-cell">
                      <span className={`index-status ${repo.status}`}>
                        <StatusMark status={repo.status} />{" "}
                        {statusLabels[repo.status]}
                      </span>
                      {repo.status === "indexing" && (
                        <div className="row-progress">
                          <span style={{ width: `${repo.progress ?? 0}%` }} />
                        </div>
                      )}
                      {repo.outdated && (
                        <small className="outdated-label">
                          OUTDATED · RE-INDEX AVAILABLE
                        </small>
                      )}
                      {repo.status === "ready" && repo.indexedAt && (
                        <small>indexed {repo.indexedAt}</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="row-actions">
                      <RepoAction repo={repo} onIndex={indexRepo} />
                      <button
                        className="row-more"
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
            <div className="empty-table">
              <Database size={18} />
              <span>No repositories match this filter.</span>
            </div>
          )}
        </div>
        <div className="table-footer">
          <span>
            SHOWING {filteredRepos.length.toString().padStart(2, "0")} OF 12
            REPOSITORIES
          </span>
          <span>
            SCROLL TO LOAD MORE <span className="green-text">↓</span>
          </span>
        </div>
      </section>

      <div className="dashboard-lower-grid">
        <section className="activity-panel">
          <div className="panel-title-row">
            <div>
              <span className="eyebrow">LIVE FEED</span>
              <h2>Recent activity</h2>
            </div>
            <button className="text-button" type="button">
              VIEW LOG <span>↗</span>
            </button>
          </div>
          <div className="activity-log">
            <div>
              <span className="log-time">14:32:08</span>
              <span className="log-dot is-green" />
              <p>
                <strong>atlas-core</strong> index completed <em>+1,244 docs</em>
              </p>
            </div>
            <div>
              <span className="log-time">14:26:41</span>
              <span className="log-dot is-cyan" />
              <p>
                <strong>pasdigital</strong> opened session{" "}
                <em>“trace the auth boundary”</em>
              </p>
            </div>
            <div>
              <span className="log-time">14:18:03</span>
              <span className="log-dot is-amber" />
              <p>
                <strong>sdk-python</strong> indexing started{" "}
                <em>branch: main</em>
              </p>
            </div>
          </div>
        </section>
        <section className="quickstart-panel">
          <div className="quickstart-icon">
            <Zap size={18} />
          </div>
          <div>
            <span className="eyebrow">NEXT ACTION</span>
            <h2>Ask your first question</h2>
            <p>Open any ready repository to start a grounded chat session.</p>
          </div>
          <Link
            to="/repo/$repoId"
            params={{ repoId: "atlas-core" }}
            className="square-arrow"
          >
            ↗
          </Link>
        </section>
      </div>
    </AppShell>
  )
}
