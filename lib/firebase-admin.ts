import { getApps, initializeApp, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

function getAdminAuth() {
  const projectId   = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")

  if (!projectId || !clientEmail || !privateKey) return null

  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
  }

  return getAuth()
}

export const adminAuth = getAdminAuth()
