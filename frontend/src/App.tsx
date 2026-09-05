import { RouterProvider } from "@tanstack/react-router"
import { ErrorBoundary } from "react-error-boundary"

import { router } from "@/app/router"
import { AppErrorFallback } from "@/components/app-error-boundary"

export function App() {
  return (
    <ErrorBoundary
      FallbackComponent={AppErrorFallback}
      onReset={() => window.location.reload()}
    >
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}

export default App
