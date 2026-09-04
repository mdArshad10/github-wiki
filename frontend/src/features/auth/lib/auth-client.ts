import { VITE_BACKEND_URL } from "@/config/constant"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: VITE_BACKEND_URL ?? "http://localhost:3000",
});
