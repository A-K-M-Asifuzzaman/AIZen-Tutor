"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
  user:    User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false })

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(!!auth) // only "loading" if Firebase is configured

  useEffect(() => {
    if (!auth) return  // Firebase not configured — skip auth, app works as guest-only
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
