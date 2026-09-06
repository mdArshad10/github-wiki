import { RouterProvider } from "@tanstack/react-router"
import { ErrorBoundary } from "react-error-boundary"

import { router } from "@/app/router"
import { AppErrorFallback } from "@/components/app-error-boundary"
import { useUserStore } from "./stores/user.store"

export function App() {
  const authState = useUserStore();
  return (
    <ErrorBoundary
      FallbackComponent={AppErrorFallback}
      onReset={() => window.location.reload()}
    >
      <RouterProvider 
        router={router}
        context={{auth:authState}}
        />
    </ErrorBoundary>
  )
}

export default App
