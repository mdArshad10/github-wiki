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
import { RouteTransitionLoader } from "@/components/route-transition-loader"
import { LandingPage } from "@/features/landing/pages/landing-page"
import { queryClient } from "@/lib/query-client"
import { useUserStore } from "@/stores/user.store"

export type RouterContext = {
  authClient: typeof authClient
  queryClient: typeof queryClient,
  auth: ReturnType<typeof useUserStore.getState>
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  validateSearch: (search: Record<string, unknown>) => search,
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
  beforeLoad: async({context,location})=>{
    const store = context.auth;
    if(store.userDetail.email !== null){
      throw redirect({
        to:"/login",
        search:{
          redirect:location.href
        }
      })
    }
  }
})

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  beforeLoad: async ({ context }) => {
    const store = context.auth;

    if(store.userDetail.email) return;

    const session = await context.authClient.getSession()

    if (!session.data) {
      throw redirect({ to: "/login" })
    }
    store.setSession(session.data.session.token);
    store.setUserDetails({
      email: session.data.user.email,
      avatarUrl:session.data.user?.image ?? null,
      githubUsername:session.data.user.name,
    })
  },
  component: ProtectedRouteComponent,
})

const dashboardRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/dashboard",
  component: lazyRouteComponent(
    () => import("@/features/dashboard/layouts/dashboard-layout"),
    "DashboardLayout"
  ),
})

const dashboardOverviewRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/",
  component: lazyRouteComponent(
    () => import("@/features/dashboard/pages/dashboard-page"),
    "DashboardPage"
  ),
})

const activityRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/activity",
  component: lazyRouteComponent(
    () => import("@/features/dashboard/pages/activity-page"),
    "activityPage"
  ),
})

const repositoryRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: "/repository",
  component: lazyRouteComponent(
    () => import("@/features/dashboard/pages/dashboard-page"),
    "DashboardRepositoriesPage"
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
    dashboardRoute.addChildren([
      dashboardOverviewRoute,
      repositoryRoute,
      activityRoute,
    ]),
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
    auth:useUserStore.getState(),
  },
  defaultErrorComponent: RouteErrorPage,
  defaultNotFoundComponent: NotFoundPage,
  defaultPendingComponent: RouteTransitionLoader,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
