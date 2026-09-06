import { Outlet, useLocation } from "@tanstack/react-router"
import { Plus } from "lucide-react"

import { AppShell } from "@/components/app-shell"

export function DashboardLayout() {
  const location = useLocation()
  const isRepositoryPage = location.pathname === "/dashboard/repository"
  const isActivityPage = location.pathname === "/dashboard/activity"

  const pageTitle = isRepositoryPage
    ? "Repository control"
    : isActivityPage
      ? "Workspace activity"
      : "Workspace overview"
  const pageMeta = isRepositoryPage
    ? "repository registry"
    : isActivityPage
      ? "live event stream"
      : "workspace / pasdigital"

  return (
    <AppShell
      pageLabel="WORKSPACE"
      pageTitle={pageTitle}
      pageMeta={pageMeta}
      headerActions={
        <button
          className="inline-flex min-h-[32px] items-center gap-2 border border-[var(--terminal-cyan)] bg-[var(--terminal-cyan)] px-3 font-mono text-[10px] leading-none tracking-[0.08em] text-[#091113] transition-colors hover:bg-[#8de0df]"
          type="button"
        >
          <Plus size={15} /> NEW SESSION
        </button>
      }
    >
      <Outlet />
    </AppShell>
  )
}
