import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ThemePreference = "light" | "dark" | "system"

type UiStore = {
  theme: ThemePreference
  sidebarCollapsed: boolean
  activeSessionId: string | null
  setTheme: (theme: ThemePreference) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setActiveSessionId: (sessionId: string | null) => void
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      theme: "system",
      sidebarCollapsed: false,
      activeSessionId: null,
      setTheme: (theme) => set({ theme }),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setActiveSessionId: (activeSessionId) => set({ activeSessionId }),
    }),
    {
      name: "github-wiki-ui",
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
)
