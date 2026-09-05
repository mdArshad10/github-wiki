import { Link } from "@tanstack/react-router"
import {
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  CircleCheck,
  Code2,
  GitBranch,
  LockKeyhole,
  Radar,
  ScanSearch,
  Terminal,
} from "lucide-react"

const workflowSteps = [
  {
    index: "01",
    title: "Connect GitHub",
    description: "Bring the repositories you already understand best.",
    icon: GitBranch,
  },
  {
    index: "02",
    title: "Index deliberately",
    description: "Choose what enters your workspace and when it refreshes.",
    icon: ScanSearch,
  },
  {
    index: "03",
    title: "Ask with context",
    description: "Open a thread and follow every answer back to the source.",
    icon: Radar,
  },
]

const actionClass =
  "inline-flex min-h-[42px] items-center gap-[9px] px-[13px] font-mono text-[9px] leading-none tracking-[.1em] no-underline transition-colors"

export function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--terminal-bg)] text-[var(--terminal-text)] after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:top-[110px] after:w-px after:bg-[#20303855] after:content-[''] max-[760px]:after:hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(#1b313811_1px,transparent_1px),linear-gradient(90deg,#1b313811_1px,transparent_1px)] bg-[length:46px_46px] opacity-[.28] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />

      <header className="relative z-10 flex h-[72px] items-center justify-between border-b border-[var(--terminal-rule)] px-[42px] max-[760px]:px-[18px]">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 no-underline"
          aria-label="Wiki RAG home"
        >
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
        </Link>

        <nav
          className="flex items-center gap-[25px] max-[760px]:gap-0"
          aria-label="Landing page navigation"
        >
          <a
            href="#workflow"
            className="font-mono text-[9px] leading-none tracking-[.11em] text-[var(--terminal-muted)] no-underline hover:text-[var(--terminal-text)] max-[760px]:hidden"
          >
            WORKFLOW
          </a>
          <a
            href="#signals"
            className="font-mono text-[9px] leading-none tracking-[.11em] text-[var(--terminal-muted)] no-underline hover:text-[var(--terminal-text)] max-[760px]:hidden"
          >
            SIGNALS
          </a>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 border border-[var(--terminal-rule)] bg-[#0b1316] px-[11px] py-2.5 font-mono text-[9px] leading-none tracking-[.11em] text-[var(--terminal-cyan)] no-underline hover:border-[var(--terminal-cyan)] hover:bg-[#0e1b1f]"
          >
            ENTER WORKSPACE <ChevronRight size={14} />
          </Link>
        </nav>
      </header>

      <main className="relative z-10">
        <section className="mx-auto grid min-h-[610px] max-w-[1230px] grid-cols-[minmax(0,1fr)_445px] items-center gap-[90px] px-[52px] py-[83px] max-[1060px]:grid-cols-[minmax(0,1fr)_390px] max-[1060px]:gap-12 max-[760px]:flex max-[760px]:min-h-0 max-[760px]:flex-col max-[760px]:items-stretch max-[760px]:gap-[58px] max-[760px]:px-[22px] max-[760px]:py-[62px]">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 font-mono text-[9px] leading-none tracking-[.14em] text-[var(--terminal-cyan)]">
              <span className="text-[var(--terminal-amber)]">00</span>
              <span className="h-px w-[45px] bg-[var(--terminal-cyan)]" />
              <span>REPOSITORY INTELLIGENCE / BETA</span>
            </div>

            <h1 className="my-[28px] mb-[26px] font-mono text-[clamp(42px,5vw,70px)] font-medium leading-[.98] tracking-[-.075em] text-[#e5f0ef]">
              Read your code
              <br />
              <em className="not-italic text-[var(--terminal-cyan)]">at system speed.</em>
            </h1>

            <p className="m-0 max-w-[510px] font-mono text-[13px] leading-[1.75] text-[#86999d] max-[760px]:text-[11px]">
              WIKI//RAG turns your repositories into a grounded workspace for
              asking better questions, tracing decisions, and moving through
              unfamiliar systems with confidence.
            </p>

            <div className="mt-[35px] flex flex-wrap items-center gap-[13px]">
              <Link
                to="/login"
                className={`${actionClass} border border-[var(--terminal-amber)] bg-[var(--terminal-amber)] text-[#0b1112] hover:bg-[#f1ca73]`}
              >
                <GitBranch size={17} />
                START WITH GITHUB
                <ArrowUpRight size={15} />
              </Link>
              <a
                href="#workflow"
                className={`${actionClass} border border-[var(--terminal-rule)] text-[var(--terminal-cyan)] hover:border-[var(--terminal-cyan)] hover:bg-[#0d1b1e]`}
              >
                SEE THE WORKFLOW
                <ChevronRight size={15} />
              </a>
            </div>

            <div className="mt-[31px] flex flex-wrap gap-[21px] font-mono text-[8px] leading-none tracking-[.09em] text-[var(--terminal-faint)] max-[760px]:flex-col max-[760px]:gap-3">
              <span className="inline-flex items-center gap-[7px]">
                <CircleCheck size={14} className="text-[var(--terminal-green)]" />
                SOURCE-ANCHORED ANSWERS
              </span>
              <span className="inline-flex items-center gap-[7px]">
                <LockKeyhole size={14} className="text-[var(--terminal-cyan)]" />
                PRIVATE BY DEFAULT
              </span>
            </div>
          </div>

          <div className="border border-[#2a444b] bg-[#0b1215] p-5 shadow-[12px_12px_0_#050708] max-[760px]:shadow-[8px_8px_0_#050708]">
            <div className="flex items-center justify-between border-b border-[var(--terminal-rule)] pb-[18px] font-mono text-[8px] leading-none tracking-[.13em] text-[var(--terminal-faint)]">
              <span>WORKSPACE / PREVIEW</span>
              <span className="inline-flex items-center gap-[7px] text-[var(--terminal-green)]">
                <span className="size-1.5 rounded-full bg-[var(--terminal-green)] shadow-[0_0_0_3px_#76d69d16]" />
                LIVE TRACE
              </span>
            </div>

            <div className="my-[22px] flex items-center gap-3">
              <span className="grid size-10 place-items-center border border-[#37666d] bg-[#0d2024] text-[var(--terminal-cyan)]">
                <Terminal size={20} />
              </span>
              <div>
                <span className="block font-mono text-[9px] leading-[1.2] tracking-[.16em] text-[var(--terminal-muted)]">
                  ACTIVE REPOSITORY
                </span>
                <strong className="mt-[7px] block font-mono text-[12px] leading-none text-[var(--terminal-text)]">
                  atlas-core / architecture
                </strong>
              </div>
            </div>

            <div className="border border-[var(--terminal-rule)] bg-[#080e10]">
              <div className="flex items-center justify-between border-b border-[var(--terminal-rule)] px-[13px] py-3 font-mono text-[8px] leading-none tracking-[.1em] text-[var(--terminal-muted)]">
                <span className="inline-flex items-center gap-[7px] text-[var(--terminal-cyan)]">
                  <Code2 size={14} /> TRACE / 0042
                </span>
                <span>3 SOURCES</span>
              </div>
              <div className="flex min-h-[45px] items-center gap-[13px] border-b border-[var(--terminal-rule-soft)] px-[13px]">
                <span className="font-mono text-[9px] leading-none text-[var(--terminal-faint)]">01</span>
                <code className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[10px] leading-[1.3] text-[#9fb0b2]">
                  How does auth reach the repo service?
                </code>
              </div>
              <div className="flex min-h-[45px] items-center gap-[13px] border-b border-[var(--terminal-rule-soft)] px-[13px]">
                <span className="font-mono text-[9px] leading-none text-[var(--terminal-faint)]">02</span>
                <code className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[10px] leading-[1.3] text-[var(--terminal-cyan)]">
                  session-context.ts → repository-service.ts
                </code>
              </div>
              <div className="flex min-h-[45px] items-center gap-[13px] px-[13px]">
                <span className="font-mono text-[9px] leading-none text-[var(--terminal-faint)]">03</span>
                <code className="overflow-hidden text-ellipsis whitespace-nowrap font-mono text-[10px] leading-[1.3] text-[var(--terminal-faint)]">
                  grounded in 8 files · 42 lines
                </code>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between font-mono text-[8px] leading-none tracking-[.09em] text-[var(--terminal-muted)]">
              <span className="inline-flex items-center gap-[7px]">
                <BookOpen size={13} className="text-[var(--terminal-amber)]" /> INDEXED CONTEXT
              </span>
              <span>92% COVERAGE</span>
            </div>
            <div className="mt-[11px] h-[3px] bg-[#1b2a30]">
              <span className="block h-full w-[92%] bg-[var(--terminal-cyan)]" />
            </div>
          </div>
        </section>

        <section id="signals" className="mx-auto max-w-[1230px] px-[52px] pb-[85px] max-[760px]:px-[22px] max-[760px]:pb-[66px]">
          <div className="flex items-center gap-2.5 font-mono text-[9px] leading-none tracking-[.14em] text-[var(--terminal-cyan)]">
            <span className="text-[var(--terminal-amber)]">01</span>
            <span>THE SIGNAL</span>
          </div>
          <div className="mt-[18px] grid grid-cols-3 border-y border-[var(--terminal-rule)] max-[760px]:grid-cols-1">
            {[
              ["A1", "Context before confidence", "Answers stay close to the files, symbols, and decisions that support them."],
              ["A2", "Control the index", "Choose which repositories become part of your working knowledge base."],
              ["A3", "Keep the thread", "Turn one answer into a durable conversation about how your system works."],
            ].map(([index, title, description], itemIndex) => (
              <article
                className={`min-h-[163px] py-[22px] pr-[22px] ${itemIndex > 0 ? "border-l border-[var(--terminal-rule)] pl-[22px] max-[760px]:border-l-0 max-[760px]:border-t max-[760px]:border-[var(--terminal-rule-soft)]" : ""} max-[760px]:min-h-0 max-[760px]:px-0 max-[760px]:py-5`}
                key={index}
              >
                <span className="block font-mono text-[9px] leading-none text-[var(--terminal-amber)]">{index}</span>
                <strong className="mt-[26px] block font-mono text-[12px] leading-none text-[var(--terminal-text)] max-[760px]:mt-[13px]">
                  {title}
                </strong>
                <p className="mt-2.5 max-w-[280px] font-mono text-[10px] leading-[1.5] text-[var(--terminal-muted)]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto max-w-[1230px] border-t border-[var(--terminal-rule)] px-[52px] pb-[92px] pt-[72px] max-[760px]:px-[22px] max-[760px]:pb-[70px] max-[760px]:pt-[59px]">
          <div className="flex items-end justify-between gap-[30px] max-[760px]:flex-col max-[760px]:items-start">
            <div>
              <div className="flex items-center gap-2.5 font-mono text-[9px] leading-none tracking-[.14em] text-[var(--terminal-cyan)]">
                <span className="text-[var(--terminal-amber)]">02</span>
                <span>THE WORKFLOW</span>
              </div>
              <h2 className="mt-6 font-mono text-[clamp(30px,4vw,52px)] font-medium leading-[.98] tracking-[-.075em] text-[#e5f0ef]">
                From repository
                <br />
                <em className="not-italic text-[var(--terminal-cyan)]">to reasoning.</em>
              </h2>
            </div>
            <p className="m-0 mb-[3px] max-w-[325px] font-mono text-[11px] leading-[1.6] text-[var(--terminal-muted)] max-[760px]:mt-[22px]">
              A smaller surface for the questions that matter when you inherit,
              extend, or debug a living codebase.
            </p>
          </div>

          <div className="mt-[49px] grid grid-cols-3 gap-3 max-[760px]:mt-[34px] max-[760px]:grid-cols-1">
            {workflowSteps.map(({ index, title, description, icon: Icon }) => (
              <article
                className="relative min-h-[205px] border border-[var(--terminal-rule)] bg-[var(--terminal-surface)] p-[19px] hover:border-[#38515a] hover:bg-[#0d171a]"
                key={index}
              >
                <div className="flex items-center justify-between font-mono text-[9px] leading-none text-[var(--terminal-faint)]">
                  <span>{index}</span>
                  <Icon size={17} className="text-[var(--terminal-cyan)]" />
                </div>
                <h3 className="mt-10 mb-2.5 font-mono text-[13px] leading-none text-[var(--terminal-text)]">{title}</h3>
                <p className="m-0 max-w-[240px] font-mono text-[10px] leading-[1.55] text-[var(--terminal-muted)]">{description}</p>
                <span className="absolute bottom-[18px] right-[19px] text-[var(--terminal-amber)]">
                  <ArrowUpRight size={15} />
                </span>
              </article>
            ))}
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
