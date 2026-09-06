import { useNavigate, useSearch } from "@tanstack/react-router"

type QueryParams = Record<string, unknown>

export function useQuery<TSearch extends QueryParams = QueryParams>() {
  const navigate = useNavigate({ from: "__root__" })
  // Extracts all currently active search parameters from the URL
  const searchParams = useSearch({
    from: "__root__",
    strict: false,
  }) as TSearch

  /**
   * Sets or updates a specific key-value pair in the URL query string.
   * Example: setQuery('tab', 'profile') -> ?tab=profile
   */
  const setQuery = <TKey extends keyof TSearch>(
    key: TKey,
    value: TSearch[TKey]
  ) => {
    navigate({
      search: (prev) => ({
        ...prev,
        [key]: value,
      }),
    })
  }

  /**
   * Retrieves the value of a specific query key.
   * Example: getQuery('tab') -> 'profile'
   */
  const getQuery = <TKey extends keyof TSearch>(
    key: TKey
  ): TSearch[TKey] | undefined => {
    return searchParams[key]
  }

  /**
   * Completely removes a query key from the URL.
   * Example: removeQuery('tab') -> removes '?tab=...' completely
   */
  const removeQuery = <TKey extends keyof TSearch>(key: TKey) => {
    navigate({
      search: (prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      },
    })
  }

  return { setQuery, getQuery, removeQuery }
}
