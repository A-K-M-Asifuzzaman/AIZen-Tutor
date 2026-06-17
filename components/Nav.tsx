"use client"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "./AuthProvider"

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

function Avatar({ name, photo }: { name?: string | null; photo?: string | null }) {
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt={name ?? "User"} className="w-7 h-7 rounded-full object-cover" />
  }
  const initials = (name ?? "U").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
      style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
      {initials}
    </div>
  )
}

export default function Nav() {
  const [open, setOpen]           = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const path                      = usePathname()
  const router                    = useRouter()
  const { user, loading }         = useAuth()
  const menuRef                   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSignOut = async () => {
    setMenuOpen(false)
    setOpen(false)
    if (auth) await signOut(auth)
    router.push("/")
  }

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
                  path === l.href ? "text-white font-medium" : "text-zinc-500 hover:text-zinc-300"
                }`}
                style={path === l.href ? { background: "rgba(124,58,237,0.15)" } : {}}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop right: auth area */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {!loading && user ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors hover:bg-white/5">
                  <Avatar name={user.displayName} photo={user.photoURL} />
                  <span className="text-xs text-zinc-300 max-w-[120px] truncate">
                    {user.displayName ?? user.email}
                  </span>
                  <svg className="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden shadow-2xl py-1"
                    style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="px-3 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                      <p className="text-xs font-medium text-white truncate">{user.displayName ?? "User"}</p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                      📊 Dashboard
                    </Link>
                    <button onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : !loading ? (
              <>
                <Link href="/login"
                  className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                  Sign In
                </Link>
                <Link href="/register"
                  className="text-xs font-semibold text-white px-3.5 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                  Sign Up Free
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile: current page label */}
          <span className="lg:hidden flex-1 text-sm text-zinc-400 font-medium truncate">
            {LINKS.find((l) => l.href === path)?.label ?? ""}
          </span>

          {/* Mobile: avatar tap → dashboard, hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            {!loading && user && (
              <button onClick={() => router.push("/dashboard")}>
                <Avatar name={user.displayName} photo={user.photoURL} />
              </button>
            )}
            <button onClick={() => setOpen((v) => !v)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
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
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                    path === l.href ? "text-white font-medium" : "text-zinc-400 hover:text-white"
                  }`}
                  style={path === l.href ? { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" } : {}}>
                  <span className="text-base">{l.icon}</span>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="px-3 pb-3 space-y-2">
              {!loading && user ? (
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                  style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={user.displayName} photo={user.photoURL} />
                    <span className="text-xs text-zinc-300 truncate">
                      {user.displayName ?? user.email}
                    </span>
                  </div>
                  <button onClick={handleSignOut}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors shrink-0 ml-2">
                    Sign Out
                  </button>
                </div>
              ) : !loading ? (
                <div className="flex gap-2">
                  <Link href="/login" onClick={() => setOpen(false)}
                    className="flex-1 text-center text-sm text-zinc-400 border px-4 py-2.5 rounded-xl transition-colors hover:text-white"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)}
                    className="flex-1 text-center text-sm font-semibold text-white px-4 py-2.5 rounded-xl transition-opacity hover:opacity-80"
                    style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
                    Sign Up
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
