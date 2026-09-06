import type { ReactNode } from "react"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import {
  Activity,
  BookOpen,
  ChevronRight,
  Command,
  Grid2X2,
  LogOut,
  MessageSquareText,
  Settings2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useUiStore } from "@/stores/ui.store"
import { Button } from "./ui/button"
import { useLoginMutation } from "@/features/auth/api/auth.mutation"
import { useUserStore } from "@/stores/user.store"

type AppShellProps = {
  children: ReactNode
  pageLabel: string
  pageTitle: string
  pageMeta?: string
  headerActions?: ReactNode
}

const navItems = [
  {
    label: "Overview",
    to: "/dashboard",
    icon: Grid2X2,
  },
  {
    label: "Repositories",
    to: "/dashboard/repository",
    icon: BookOpen,
  },
  {
    label: "Activity",
    to: "/dashboard/activity",
    icon: Activity,
  },
  { label: "Settings", to: "/settings", icon: Settings2 },
] as const

export function AppShell({
  children,
  pageLabel,
  pageTitle,
  pageMeta,
  headerActions,
}: AppShellProps) {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed)
  const setSidebarCollapsed = useUiStore((state) => state.setSidebarCollapsed)
  const userDetail = useUserStore((state)=>state.userDetail)
  const location = useLocation();
  const navigate = useNavigate();
  const authMutation = useLoginMutation();
  const {setUserDetails,setSession}= useUserStore();

  const onLogoutHandler = async ()=>{
      await authMutation.mutateAsync();
      setSession("");
      setUserDetails({
        email:null,
        avatarUrl:null,
        githubUsername:null
      });
       await navigate({ to: "/login" })
  }

  return (
    <SidebarProvider
      open={!sidebarCollapsed}
      onOpenChange={(open) => setSidebarCollapsed(!open)}
      className="min-h-screen bg-[var(--terminal-bg)]"
      style={{ "--sidebar-width-icon": "62px" } as React.CSSProperties}
    >
      <Sidebar
        collapsible="icon"
        className="[--sidebar-accent-foreground:var(--terminal-text)] [--sidebar-accent:#101a1e] [--sidebar-border:var(--terminal-rule)] [--sidebar-foreground:var(--terminal-muted)] [--sidebar-ring:var(--terminal-cyan)] [--sidebar:#080d10]"
      >
        <SidebarHeader className="h-[68px] justify-center border-b border-[var(--terminal-rule)] p-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 text-[var(--terminal-text)] no-underline group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
            aria-label="Wiki RAG home"
          >
            <span className="grid size-[29px] shrink-0 place-items-center border border-[var(--terminal-cyan)] font-mono text-[12px] leading-none font-bold tracking-[-1px] text-[var(--terminal-cyan)]">
              W/
            </span>
            <span className="flex flex-col gap-[3px] whitespace-nowrap group-data-[collapsible=icon]:hidden">
              <strong className="font-mono text-[12px] leading-none font-bold tracking-[0.08em] text-[var(--terminal-text)]">
                WIKI//RAG
              </strong>
              <small className="font-mono text-[8px] leading-none tracking-[0.14em] text-[var(--terminal-muted)]">
                CODE INTELLIGENCE
              </small>
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="gap-3 p-3">
            <div className="flex items-center gap-[9px] border border-[var(--terminal-rule)] bg-[#0b1215] px-2 py-[9px] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
              <span className="grid size-[25px] shrink-0 place-items-center bg-[var(--terminal-amber)] font-mono text-[10px] leading-none font-bold text-[#101719]">
                {userDetail?.githubUsername?.split(' ').map(word => word[0]).join('')}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-[3px] group-data-[collapsible=icon]:hidden">
                <strong className="truncate font-mono text-[11px] leading-none font-semibold text-[var(--terminal-text)]">
                  {userDetail?.githubUsername}
                </strong>
                <small className="font-mono text-[8px] leading-none tracking-[0.08em] text-[var(--terminal-muted)]">
                  PERSONAL WORKSPACE
                </small>
              </span>
              <ChevronRight
                size={14}
                className="shrink-0 text-[var(--terminal-faint)] group-data-[collapsible=icon]:hidden"
              />
            </div>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup className="p-3">
            <SidebarGroupLabel className="h-auto px-2 pb-2 font-mono text-[9px]! font-normal tracking-[0.16em] text-[var(--terminal-muted)]">
              NAVIGATION
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {navItems.map(({ label, to, icon: Icon }) => {
                  const isActive = location.pathname === to

                  return (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton
                        render={
                          <Link
                            to={to}
                            aria-current={isActive ? "page" : undefined}
                          />
                        }
                        isActive={isActive}
                        tooltip={label}
                        className="rounded-none border-l-2 border-transparent px-2.5 font-mono text-[11px] text-[var(--terminal-muted)] hover:bg-[#0d161a] hover:text-[var(--terminal-text)] data-active:border-[var(--terminal-cyan)] data-active:bg-[#101a1e] data-active:text-[var(--terminal-text)]"
                      >
                        <Icon />
                        <span>{label}</span>
                        {label === "Repositories" && (
                          <SidebarMenuBadge className="font-mono text-[10px] text-[var(--terminal-faint)]">
                            12
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-2 p-3 group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="flex h-auto items-center px-2 pb-2 font-mono text-[9px]! font-normal tracking-[0.16em] text-[var(--terminal-muted)]">
              INDEX QUEUE
              <span className="ml-auto size-1.5 rounded-full bg-[var(--terminal-amber)] shadow-[0_0_0_4px_#e3b75b15]" />
            </SidebarGroupLabel>
            <SidebarGroupContent className="border border-[var(--terminal-rule)] bg-[#0b1215] p-2 font-mono">
              <div className="flex items-center justify-between border-b border-[var(--terminal-rule-soft)] pb-2 text-[10px]">
                <span>
                  <strong className="block font-medium text-[var(--terminal-text)]">
                    sdk-python
                  </strong>
                  <small className="text-[9px] text-[var(--terminal-muted)]">
                    42% · 03:18 remaining
                  </small>
                </span>
                <span className="size-[7px] rounded-full bg-[var(--terminal-amber)] shadow-[0_0_0_4px_#e3b75b15]" />
              </div>
              <div className="flex items-center justify-between pt-2 text-[10px]">
                <span>
                  <strong className="block font-medium text-[var(--terminal-text)]">
                    auth-service
                  </strong>
                  <small className="text-[9px] text-[var(--terminal-muted)]">
                    failed · 14m ago
                  </small>
                </span>
                <span className="size-1.5 rounded-full bg-[var(--terminal-red)]" />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="gap-2 border-t border-[var(--terminal-rule)] p-3">
          <div className="flex items-center gap-2 px-2 font-mono text-[9px] leading-none tracking-[0.1em] text-[var(--terminal-muted)] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <span className="size-1.5 shrink-0 rounded-full bg-[var(--terminal-green)] shadow-[0_0_0_3px_#76d69d16]" />
            <span className="group-data-[collapsible=icon]:hidden">
              API CONNECTED
            </span>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                type="button"
                tooltip="Sign out"
                className="rounded-none font-mono text-[11px] text-[var(--terminal-muted)] hover:bg-[#0d161a] hover:text-[var(--terminal-text)]"
                onClick={onLogoutHandler}
              >
                <LogOut />
                <span>
                  Sign out
                </span>
                  
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="terminal-main bg-[var(--terminal-bg)]">
        <header className="terminal-header">
          <div className="flex min-w-0 items-center">
            <SidebarTrigger className="mr-2 text-[var(--terminal-muted)] hover:bg-[var(--terminal-surface-raised)] hover:text-[var(--terminal-text)]" />
            <div className="breadcrumb-line">
              <span className="breadcrumb-root">WIKI//RAG</span>
              <ChevronRight size={13} />
              <span>{pageLabel}</span>
              {pageMeta && (
                <>
                  <ChevronRight size={13} />
                  <span className="muted-text">{pageMeta}</span>
                </>
              )}
            </div>
          </div>
          <div className="header-tools">
            <button className="command-trigger" type="button">
              <Command size={14} />
              <span>Jump to</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="header-icon-button"
              type="button"
              aria-label="Messages"
            >
              <MessageSquareText size={16} />
              <span className="notification-dot" />
            </button>
            <div className="header-user">
              <span className="user-initials">PA</span>
              <span className="header-user-copy">
                <strong>pasdigital</strong>
                <small>GITHUB</small>
              </span>
            </div>
          </div>
        </header>

        <div className="page-header">
          <div>
            <span className="eyebrow">{pageLabel}</span>
            <h1>{pageTitle}</h1>
          </div>
          {headerActions && <div className="page-actions">{headerActions}</div>}
        </div>

        <div className="terminal-content">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
