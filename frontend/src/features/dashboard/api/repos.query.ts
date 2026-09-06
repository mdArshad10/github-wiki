import { useQuery } from "@tanstack/react-query"
import { repoKeys } from "./repo.key"
import { repositoryApi } from "./apiRepo"

export const useFetchReposQuery = () =>
  useQuery({
    queryKey: repoKeys.list(),
    queryFn: repositoryApi.fetchAllRepos,
    enabled: false,
  })

export const useGetAllRepoQuery = () =>
  useQuery({
    queryKey: repoKeys.all,
    queryFn: () => repositoryApi.list(),
  })
