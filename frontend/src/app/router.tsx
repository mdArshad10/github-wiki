import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
} from "@tanstack/react-router"

import {
  ProtectedRouteComponent,
  RootRouteComponent,
} from "@/app/route-components"
import { authClient } from "@/features/auth/lib/auth-client"
import { NotFoundPage } from "@/features/errors/pages/not-found-page"
import { RouteErrorPage } from "@/features/errors/pages/route-error-page"
import { LandingPage } from "@/features/landing/pages/landing-page"
import { isDashboardTab } from "@/features/dashboard/dashboard-tabs"
import { queryClient } from "@/lib/query-client"

export type RouterContext = {
  authClient: typeof authClient
  queryClient: typeof queryClient
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: RootRouteComponent,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: lazyRouteComponent(
    () => import("@/features/auth/pages/login-page"),
    "LoginPage"
  ),
})

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  beforeLoad: async ({ context }) => {
    const session = await context.authClient.getSession()

    if (!session.data) {
      throw redirect({ to: "/login" })
    }
  },
  component: ProtectedRouteComponent,
})

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard",
  validateSearch: (search: Record<string, unknown>) => ({
    tab: isDashboardTab(search.tab) ? search.tab : "overview",
  }),
  component: lazyRouteComponent(
    () => import("@/features/dashboard/pages/dashboard-page"),
    "DashboardPage"
  ),
})

const repoRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/repo/$repoId",
  component: lazyRouteComponent(
    () => import("@/features/repos/pages/repo-chat-page"),
    "RepoChatPage"
  ),
})

const repoSessionRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/repo/$repoId/session/$sessionId",
  component: lazyRouteComponent(
    () => import("@/features/repos/pages/repo-session-page"),
    "RepoSessionPage"
  ),
})

const settingsRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/settings",
  component: lazyRouteComponent(
    () => import("@/features/settings/pages/settings-page"),
    "SettingsPage"
  ),
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  protectedRoute.addChildren([
    dashboardRoute,
    repoRoute,
    repoSessionRoute,
    settingsRoute,
  ]),
])

export const router = createRouter({
  routeTree,
  context: {
    authClient,
    queryClient,
  },
  defaultErrorComponent: RouteErrorPage,
  defaultNotFoundComponent: NotFoundPage,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
