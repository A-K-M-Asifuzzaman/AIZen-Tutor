import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "AIZen Tutor — Master AI/ML. Earn XP. Level Up.",
  description: "The most gamified AI/ML learning platform. 62 in-depth lessons across Machine Learning, Deep Learning, NLP, LLMs, RAG, Computer Vision and MLOps. Earn XP and level up as you learn.",
  keywords: ["machine learning", "deep learning", "NLP", "LLM", "AI tutor", "earn XP"],
  openGraph: {
    title: "AIZen Tutor — Master AI/ML. Earn XP. Level Up.",
    description: "62 in-depth lessons. Earn XP. Track progress. No signup required.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>{children}</body>
    </html>
  )
}
