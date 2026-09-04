export type RepositoryStatus = "ready" | "indexing" | "not-indexed" | "failed"

export type Repository = {
  id: string
  name: string
  description: string
  language: string
  languageColor: string
  visibility: "PUBLIC" | "PRIVATE"
  stars: number
  forks: number
  status: RepositoryStatus
  progress?: number
  size: string
  updatedAt: string
  indexedAt?: string
  outdated?: boolean
}

export const repositories: Repository[] = [
  {
    id: "atlas-core",
    name: "atlas-core",
    description: "Internal platform primitives and service contracts.",
    language: "TypeScript",
    languageColor: "#42d3c5",
    visibility: "PRIVATE",
    stars: 842,
    forks: 61,
    status: "ready",
    size: "78.2 MB",
    updatedAt: "14 min ago",
    indexedAt: "2h ago",
    outdated: true,
  },
  {
    id: "sdk-python",
    name: "sdk-python",
    description: "Official Python client for the Atlas API.",
    language: "Python",
    languageColor: "#e4b84a",
    visibility: "PUBLIC",
    stars: 319,
    forks: 42,
    status: "indexing",
    progress: 42,
    size: "24.8 MB",
    updatedAt: "38 min ago",
  },
  {
    id: "actions-dashboard",
    name: "actions-dashboard",
    description: "Operational console for running and inspecting jobs.",
    language: "React",
    languageColor: "#6ea8ff",
    visibility: "PRIVATE",
    stars: 128,
    forks: 12,
    status: "not-indexed",
    size: "112.4 MB",
    updatedAt: "1h ago",
  },
  {
    id: "auth-service",
    name: "auth-service",
    description: "OAuth, sessions, and workspace access control.",
    language: "Go",
    languageColor: "#6ba8c8",
    visibility: "PRIVATE",
    stars: 86,
    forks: 9,
    status: "failed",
    size: "18.1 MB",
    updatedAt: "14m ago",
  },
  {
    id: "webhooks",
    name: "webhooks",
    description: "Event ingestion and delivery guarantees.",
    language: "TypeScript",
    languageColor: "#42d3c5",
    visibility: "PUBLIC",
    stars: 57,
    forks: 7,
    status: "ready",
    size: "9.6 MB",
    updatedAt: "3h ago",
    indexedAt: "yesterday",
  },
]
