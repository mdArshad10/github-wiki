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

import { VITE_FRONTEND_URL } from "@/config/constant"
import { authClient } from "@/features/auth/lib/auth-client"

const actionClass =
  "inline-flex min-h-[44px] w-full items-center gap-2.5 px-[13px] font-mono text-[10px] leading-none tracking-[.08em] transition-colors"

export function LoginPage() {
  const [isSigningIn, setIsSigningIn] = useState(false)

  async function handleGithubLogin() {
    setIsSigningIn(true)
    try {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: `${VITE_FRONTEND_URL}/dashboard`,
      })
    } finally {
      setIsSigningIn(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--terminal-bg)] text-[var(--terminal-text)] after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:top-[110px] after:w-px after:bg-[#20303855] after:content-[''] max-[760px]:after:hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(#1b313811_1px,transparent_1px),linear-gradient(90deg,#1b313811_1px,transparent_1px)] bg-[length:46px_46px] opacity-[.28] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />

      <header className="relative z-10 flex h-[72px] items-center justify-between border-b border-[var(--terminal-rule)] px-[42px] max-[760px]:px-[18px]">
        <div className="inline-flex items-center gap-2.5">
          <span className="grid size-[29px] place-items-center border border-[var(--terminal-cyan)] font-mono text-[12px] font-bold leading-none tracking-[-1px] text-[var(--terminal-cyan)]">
            W/
          </span>
          <span className="flex flex-col gap-[3px] whitespace-nowrap">
            <strong className="font-mono text-[12px] font-bold leading-none tracking-[.08em] text-[var(--terminal-text)]">
              WIKI//RAG
            </strong>
            <small className="font-mono text-[8px] leading-none tracking-[.14em] text-[var(--terminal-muted)]">
              CODE INTELLIGENCE
            </small>
          </span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[9px] leading-none tracking-[.1em] text-[var(--terminal-muted)]">
          <span className="inline-flex items-center gap-2 text-[var(--terminal-green)]">
            <span className="size-1.5 rounded-full bg-[var(--terminal-green)] shadow-[0_0_0_3px_#76d69d16]" />
            SYSTEM OPERATIONAL
          </span>
          <span className="max-[760px]:hidden">BUILD 0.1.0-ALPHA</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-120px)] max-w-[1230px] grid-cols-[minmax(0,1fr)_420px] items-center gap-[100px] px-[52px] py-[88px] max-[1060px]:grid-cols-[minmax(0,1fr)_380px] max-[1060px]:gap-12 max-[760px]:flex max-[760px]:min-h-0 max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-[58px] max-[760px]:px-[22px] max-[760px]:py-[62px]">
        <section>
          <div className="flex items-center gap-2.5 font-mono text-[9px] leading-none tracking-[.14em] text-[var(--terminal-cyan)]">
            <span className="text-[var(--terminal-amber)]">01</span>
            <span className="h-px w-[45px] bg-[var(--terminal-cyan)]" />
            <span>REPOSITORY INTELLIGENCE</span>
          </div>

          <h1 className="my-7 mb-5 font-mono text-[clamp(42px,5vw,70px)] font-medium leading-[.98] tracking-[-.075em] text-[#e5f0ef] max-[760px]:text-[43px]">
            Ask your code
            <br />
            <em className="not-italic text-[var(--terminal-cyan)]">better questions.</em>
          </h1>

          <p className="m-0 max-w-[540px] font-mono text-[13px] leading-[1.7] text-[#86999d] max-[760px]:text-[11px]">
            A focused workspace for understanding the systems you already own.
            Index a repository, open a thread, and get answers anchored to the
            exact files and lines that matter.
          </p>

          <div className="mt-[39px] max-w-[560px] border-t border-[var(--terminal-rule)]">
            {[
              ["A1", "Grounded answers", "Every response maps back to repository context."],
              ["A2", "Manual indexing", "You decide what enters the knowledge base."],
              ["A3", "Streaming by default", "Follow the reasoning as it arrives, token by token."],
            ].map(([index, title, description]) => (
              <div className="flex min-h-[58px] items-center gap-3 border-b border-[var(--terminal-rule-soft)]" key={index}>
                <span className="w-[25px] shrink-0 font-mono text-[9px] leading-none text-[var(--terminal-amber)]">{index}</span>
                <span className="flex flex-1 flex-col gap-[5px]">
                  <strong className="font-mono text-[11px] leading-none text-[#bac9ca]">{title}</strong>
                  <small className="font-mono text-[10px] leading-none text-[var(--terminal-muted)]">{description}</small>
                </span>
                <CircleCheck size={15} className="text-[var(--terminal-green)]" />
              </div>
            ))}
          </div>

          <div className="mt-[21px] flex items-center gap-2 font-mono text-[8px] leading-none tracking-[.1em] text-[var(--terminal-faint)]">
            <span>DATA STAYS SCOPED TO YOUR GITHUB ACCOUNT</span>
            <ArrowUpRight size={14} className="text-[var(--terminal-cyan)]" />
          </div>
        </section>

        <section className="relative border border-[#2a444b] bg-[#0b1215] p-6 shadow-[12px_12px_0_#050708] max-[760px]:shadow-[8px_8px_0_#050708]" aria-label="Sign in console">
          <div className="flex justify-between border-b border-[var(--terminal-rule)] pb-[19px] font-mono text-[9px] leading-none tracking-[.1em] text-[var(--terminal-faint)]">
            <span>AUTH / 001</span>
            <span>SECURE ENTRY</span>
          </div>

          <div className="mt-[27px] grid size-[43px] place-items-center border border-[#37666d] bg-[#0d2024] text-[var(--terminal-cyan)]">
            <Terminal size={22} />
          </div>
          <span className="mt-[21px] block font-mono text-[9px] leading-[1.2] tracking-[.16em] text-[var(--terminal-muted)]">WELCOME BACK, OPERATOR</span>
          <h2 className="my-[11px] mb-[13px] font-mono text-[27px] font-medium leading-[1.05] tracking-[-.05em] text-[#e6efef]">
            Connect your
            <br />
            GitHub workspace.
          </h2>
          <p className="m-0 font-mono text-[11px] leading-[1.6] text-[#829497]">
            Sign in to browse repositories, control indexing, and open grounded
            conversations with your codebase.
          </p>

          <button
            className={`${actionClass} mt-6 border border-[var(--terminal-amber)] bg-[var(--terminal-amber)] text-[#0b1112] hover:bg-[#f1ca73] disabled:cursor-not-allowed disabled:opacity-55`}
            type="button"
            onClick={() => void handleGithubLogin()}
            disabled={isSigningIn}
          >
            <GitBranch size={18} />
            <span className="flex-1 text-left">
              {isSigningIn ? "CONNECTING..." : "CONTINUE WITH GITHUB"}
            </span>
            <ChevronRight size={16} />
          </button>

          <div className="mt-[13px] flex items-center gap-[7px] font-mono text-[8px] leading-none text-[var(--terminal-muted)]">
            <LockKeyhole size={13} className="text-[var(--terminal-green)]" />
            <span>OAuth · READ-ONLY UNTIL YOU INDEX</span>
          </div>
          <div className="my-[30px] flex items-center gap-2.5 font-mono text-[8px] leading-none tracking-[.13em] text-[var(--terminal-faint)] after:h-px after:flex-1 after:bg-[var(--terminal-rule)] after:content-['']">
            <span>CAPABILITIES</span>
          </div>
          <div className="flex gap-[17px] font-mono text-[9px] leading-none text-[var(--terminal-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <ScanSearch size={14} className="text-[var(--terminal-cyan)]" /> SEARCH REPOS
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Radar size={14} className="text-[var(--terminal-cyan)]" /> TRACE CITATIONS
            </span>
          </div>
          <div className="mt-[23px] flex justify-between border-t border-[var(--terminal-rule-soft)] pt-[13px] font-mono text-[8px] leading-none text-[var(--terminal-faint)]">
            <span>NO CREDIT CARD</span>
            <span>PRIVATE REPOS SUPPORTED</span>
          </div>
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex max-w-[1230px] items-center justify-between gap-6 px-[52px] pb-5 font-mono text-[8px] leading-none tracking-[.1em] text-[var(--terminal-muted)] max-[760px]:flex-wrap max-[760px]:gap-2.5 max-[760px]:px-[22px] max-[760px]:pb-[18px]">
        <span>© 2026 WIKI//RAG</span>
        <span className="max-[760px]:hidden">DESIGNED FOR ENGINEERS WHO READ THE SOURCE</span>
        <span>v0.1 / BETA</span>
      </footer>
    </div>
  )
}
