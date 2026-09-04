import { Link } from "@tanstack/react-router"
import { GitBranch, Moon, ShieldCheck, Sun, UserRound } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { useTheme } from "@/components/theme-provider"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <AppShell
      pageLabel="SYSTEM"
      pageTitle="Settings"
      pageMeta="workspace / pasdigital"
    >
      <div className="settings-grid">
        <section className="settings-main">
          <div className="settings-section">
            <div className="settings-section-heading">
              <span className="eyebrow">ACCOUNT</span>
              <h2>GitHub connection</h2>
              <p>Identity and repository access for this workspace.</p>
            </div>
            <div className="account-row">
              <span className="account-avatar">PA</span>
              <div>
                <strong>pasdigital</strong>
                <small>
                  <GitBranch size={12} /> GitHub account connected
                </small>
              </div>
              <span className="connected-label">
                <ShieldCheck size={14} /> CONNECTED
              </span>
            </div>
            <button className="outline-button" type="button">
              <GitBranch size={15} /> DISCONNECT GITHUB
            </button>
          </div>
          <div className="settings-section">
            <div className="settings-section-heading">
              <span className="eyebrow">APPEARANCE</span>
              <h2>Theme preference</h2>
              <p>Choose the surface used across your workspace.</p>
            </div>
            <div className="theme-options">
              {(["system", "light", "dark"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  className={
                    theme === option ? "theme-option is-active" : "theme-option"
                  }
                  onClick={() => setTheme(option)}
                >
                  {option === "system" ? (
                    <UserRound size={15} />
                  ) : option === "light" ? (
                    <Sun size={15} />
                  ) : (
                    <Moon size={15} />
                  )}
                  <span>{option.toUpperCase()}</span>
                  {theme === option && <span className="theme-check">●</span>}
                </button>
              ))}
            </div>
          </div>
        </section>
        <aside className="usage-panel">
          <div className="settings-section-heading">
            <span className="eyebrow">USAGE / CURRENT PERIOD</span>
            <h2>Workspace limits</h2>
          </div>
          <div className="usage-stat">
            <div>
              <span>INDEXED REPOSITORIES</span>
              <strong>
                07 <small>/ 12</small>
              </strong>
            </div>
            <div className="usage-bar">
              <span style={{ width: "58%" }} />
            </div>
          </div>
          <div className="usage-stat">
            <div>
              <span>AI REQUESTS</span>
              <strong>
                1,284 <small>/ 5,000</small>
              </strong>
            </div>
            <div className="usage-bar">
              <span style={{ width: "25%" }} />
            </div>
          </div>
          <div className="usage-foot">
            <span>RESETS IN 12 DAYS</span>
            <Link to="/dashboard">VIEW ACTIVITY ↗</Link>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}
