"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const LINKS = [
  { href: "/learn",       label: "Learn",      icon: "📚" },
  { href: "/roadmap",     label: "Roadmap",    icon: "🗺️" },
  { href: "/skill-tree",  label: "Skill Tree", icon: "🌳" },
  { href: "/projects",    label: "Projects",   icon: "🏗️" },
  { href: "/research",    label: "Research",   icon: "📄" },
  { href: "/interview",   label: "Interview",  icon: "🎤" },
  { href: "/daily",       label: "Daily",      icon: "🔥" },
  { href: "/rag-tutor",   label: "RAG Tutor",  icon: "🤖" },
  { href: "/dashboard",   label: "Dashboard",  icon: "📊" },
  { href: "/about",       label: "About",      icon: "👤" },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const path = usePathname()

  return (
    <>
      <nav className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{ background: "rgba(5,5,10,0.92)", borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 max-w-7xl mx-auto">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>AZ</div>
            <span className="font-semibold text-white text-sm hidden sm:inline">AIZen Tutor</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                className={`shrink-0 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                  path === l.href
                    ? "text-white font-medium"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
                style={path === l.href ? { background: "rgba(124,58,237,0.15)" } : {}}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link href="/learn"
            className="hidden lg:flex shrink-0 text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
            Start Learning →
          </Link>

          {/* Mobile: current page label */}
          <span className="lg:hidden flex-1 text-sm text-zinc-400 font-medium truncate">
            {LINKS.find((l) => l.href === path)?.label ?? ""}
          </span>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {open
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            }
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} />
          <div className="absolute top-[52px] left-0 right-0 border-b shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="grid grid-cols-2 gap-1 p-3">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    path === l.href ? "text-white font-medium" : "text-zinc-400 hover:text-white"
                  }`}
                  style={path === l.href ? { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" } : {}}>
                  <span className="text-base">{l.icon}</span>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="px-3 pb-3">
              <Link href="/learn" onClick={() => setOpen(false)}
                className="flex items-center justify-center text-sm font-semibold text-white px-4 py-2.5 rounded-xl transition-opacity hover:opacity-80"
                style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                Start Learning Free ⚡
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
