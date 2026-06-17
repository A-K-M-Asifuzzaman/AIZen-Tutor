"use client"
import { useState } from "react"
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      if (!auth) { setError("Firebase not configured."); setLoading(false); return }
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/learn")
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
        setError("Invalid email or password")
      } else {
        setError("Sign in failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    try {
      if (!auth) { setError("Firebase not configured."); return }
      await signInWithPopup(auth, new GoogleAuthProvider())
      router.push("/learn")
    } catch {
      setError("Google sign in failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>A</div>
            <span className="text-lg font-black text-white tracking-tight">AIZen Tutor</span>
          </Link>
          <h1 className="text-2xl font-black text-white mb-1">Welcome back</h1>
          <p className="text-zinc-500 text-sm">Sign in to sync your progress across devices</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: "var(--surface)", border: "1px solid rgba(255,255,255,0.07)" }}>

          {/* Google */}
          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-xs text-zinc-600">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          <form onSubmit={handleCredentials} className="space-y-3">
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="you@example.com"
                className="w-full text-sm text-white placeholder-zinc-600 rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-violet-500"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full text-sm text-white placeholder-zinc-600 rounded-xl px-3.5 py-2.5 outline-none focus:ring-1 focus:ring-violet-500"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>

            {error && (
              <div className="text-xs px-3 py-2 rounded-lg"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-5">
          No account?{" "}
          <Link href="/register" className="text-violet-400 hover:text-violet-300 font-medium">
            Create one free
          </Link>
        </p>
        <p className="text-center text-xs text-zinc-700 mt-3">
          <Link href="/learn" className="text-zinc-600 hover:text-zinc-500 underline">
            Continue without signing in
          </Link>
        </p>
      </div>
    </div>
  )
}
