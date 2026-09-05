export const dashboardTabs = ["overview", "repositories", "activity"] as const

export type DashboardTab = (typeof dashboardTabs)[number]

export function isDashboardTab(value: unknown): value is DashboardTab {
  return (
    typeof value === "string" && dashboardTabs.includes(value as DashboardTab)
  )
}
