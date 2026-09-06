import { getResponseData, type ApiResponse } from "@/config/function"
import { apiClient } from "@/lib/api-client"

export type IndexingStatus = "not_indexed" | "indexing" | "ready" | "failed"

export type Repository = {
  _id: string
  githubRepoId: number
  fullName: string
  defaultBranch: string
  private: boolean
  language: string | null
  stars: number
  indexingStatus: IndexingStatus
  indexingProgress: {
    filesProcessed: number
    totalFiles: number
  }
  lastIndexedCommitSha: string | null
  lastIndexedAt: string | null
  isOutdated: boolean
  webhookId: string | null
  isActive: boolean
  deactivatedAt: string | null
  createdAt?: string
  updatedAt?: string
}


export const repositoryApi = {
  async list() {
    const response = await apiClient.get<ApiResponse<Repository[]>>("/repos")

    return getResponseData(response.data)
  },

  async fetchAllRepos() {
    const response =
      await apiClient.get<ApiResponse<Repository[]>>("/repos/fetch-repos")

    return getResponseData(response.data)
  },
}

export const userApi = {
  async logout(){},
  async me(){},
  async dashboardAnalysis(){},
  
}
