"use client"
import { useEffect, useRef } from "react"
import { loadFromMongoDB, syncToMongoDB } from "@/lib/progress"

// Mounts once in the root layout.
// 1. On mount:  pulls progress from MongoDB and merges into localStorage.
// 2. Every 60s: syncs localStorage → MongoDB in the background.
// 3. On unload: final sync before the tab closes.
// All operations are fire-and-forget — if MongoDB is unavailable the app
// continues to work entirely from localStorage.
export default function ProgressSync() {
  const synced = useRef(false)

  useEffect(() => {
    if (synced.current) return
    synced.current = true

    // Pull from DB on first mount
    loadFromMongoDB()

    // Push to DB periodically
    const interval = setInterval(() => { syncToMongoDB() }, 60_000)

    // Push on tab close / navigation away
    const handleUnload = () => { syncToMongoDB() }
    window.addEventListener("beforeunload", handleUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener("beforeunload", handleUnload)
    }
  }, [])

  return null
}
