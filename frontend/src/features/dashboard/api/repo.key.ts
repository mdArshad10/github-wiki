export const repoKeys = {
  all: ["repo"] as const,
  lists: () => [...repoKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...repoKeys.lists(), filters] as const,
  details: () => [...repoKeys.all, "detail"] as const,
  detail: (id: string) => [...repoKeys.details(), id] as const,
}
