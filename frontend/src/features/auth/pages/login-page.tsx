import { useState } from "react"
import {
  ArrowUpRight,
  ChevronRight,
  CircleCheck,
  GitBranch,
  LockKeyhole,
  Radar,
  ScanSearch,
  Terminal,
} from "lucide-react"

import { authClient } from "@/features/auth/lib/auth-client"

export function LoginPage() {
  const [isSigningIn, setIsSigningIn] = useState(false)

  async function handleGithubLogin() {
    setIsSigningIn(true)
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      })
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <div className="landing-page">
      <div className="landing-grid" />
      <header className="landing-header">
        <div className="brand-lockup">
          <span className="brand-mark">W/</span>
          <span className="brand-copy">
            <strong>WIKI//RAG</strong>
            <small>CODE INTELLIGENCE</small>
          </span>
        </div>
        <div className="landing-header-meta">
          <span>
            <span className="status-dot is-green" /> SYSTEM OPERATIONAL
          </span>
          <span>BUILD 0.1.0-ALPHA</span>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-intro">
          <div className="landing-kicker">
            <span>01</span>
            <span className="landing-kicker-line" />
            <span>REPOSITORY INTELLIGENCE</span>
          </div>
          <h1>
            Ask your code
            <br />
            <em>better questions.</em>
          </h1>
          <p className="landing-description">
            A focused workspace for understanding the systems you already own.
            Index a repository, open a thread, and get answers anchored to the
            exact files and lines that matter.
          </p>

          <div className="landing-spec-list">
            <div className="landing-spec">
              <span className="spec-index">A1</span>
              <div>
                <strong>Grounded answers</strong>
                <small>Every response maps back to repository context.</small>
              </div>
              <CircleCheck size={15} />
            </div>
            <div className="landing-spec">
              <span className="spec-index">A2</span>
              <div>
                <strong>Manual indexing</strong>
                <small>You decide what enters the knowledge base.</small>
              </div>
              <CircleCheck size={15} />
            </div>
            <div className="landing-spec">
              <span className="spec-index">A3</span>
              <div>
                <strong>Streaming by default</strong>
                <small>
                  Follow the reasoning as it arrives, token by token.
                </small>
              </div>
              <CircleCheck size={15} />
            </div>
          </div>

          <div className="landing-footnote">
            <span>DATA STAYS SCOPED TO YOUR GITHUB ACCOUNT</span>
            <ArrowUpRight size={14} />
          </div>
        </section>

        <section className="login-console" aria-label="Sign in console">
          <div className="console-topline">
            <span>AUTH / 001</span>
            <span>SECURE ENTRY</span>
          </div>
          <div className="console-icon">
            <Terminal size={22} />
          </div>
          <span className="console-eyebrow">WELCOME BACK, OPERATOR</span>
          <h2>
            Connect your
            <br />
            GitHub workspace.
          </h2>
          <p>
            Sign in to browse repositories, control indexing, and open grounded
            conversations with your codebase.
          </p>

          <button
            className="github-login-button"
            type="button"
            onClick={() => void handleGithubLogin()}
            disabled={isSigningIn}
          >
            <GitBranch size={18} />
            <span>
              {isSigningIn ? "CONNECTING..." : "CONTINUE WITH GITHUB"}
            </span>
            <ChevronRight size={16} />
          </button>

          <div className="console-security">
            <LockKeyhole size={13} />
            <span>OAuth · READ-ONLY UNTIL YOU INDEX</span>
          </div>
          <div className="console-divider">
            <span>CAPABILITIES</span>
          </div>
          <div className="console-capabilities">
            <span>
              <ScanSearch size={14} /> SEARCH REPOS
            </span>
            <span>
              <Radar size={14} /> TRACE CITATIONS
            </span>
          </div>
          <div className="console-footer">
            <span>NO CREDIT CARD</span>
            <span>PRIVATE REPOS SUPPORTED</span>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <span>© 2026 WIKI//RAG</span>
        <span>DESIGNED FOR ENGINEERS WHO READ THE SOURCE</span>
        <span>v0.1 / BETA</span>
      </footer>
    </div>
  )
}
