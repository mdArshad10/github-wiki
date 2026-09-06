import { useParams } from "@tanstack/react-router"

import { ChatWorkspace } from "@/features/repos/pages/repo-chat-page"

export function RepoSessionPage() {
  const { repoId, sessionId } = useParams({from:"/protected/repo/$repoId/session/$sessionId"})
  return <ChatWorkspace repoId={repoId} sessionId={sessionId} />
}
