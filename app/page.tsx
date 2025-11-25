"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

export default function Home() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true'
  const router = useRouter()
  const [checking, setChecking] = useState(DEV_MODE)

  // In dev mode, check onboarding status
  useEffect(() => {
    if (DEV_MODE) {
      checkOnboarding()
    }
  }, [])

  async function checkOnboarding() {
    try {
      const status = await api.getOnboardingStatus()
      if (!status.completed || !status.has_tokens) {
        // Redirect to onboarding if not completed
        router.push('/onboarding')
      } else {
        // Already onboarded, go to dashboard
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to check onboarding:', error)
      setChecking(false)
    }
  }

  // In dev mode, show loading while checking
  if (DEV_MODE && checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">ReviewAI</h1>
            <p className="text-muted-foreground">AI-powered code review assistant for GitLab</p>
            <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950 p-2 rounded">
              🛠️ Development Mode Active
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Card>
      </div>
    )
  }

  // In dev mode, manually navigate if needed
  if (DEV_MODE) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">ReviewAI</h1>
            <p className="text-muted-foreground">AI-powered code review assistant for GitLab</p>
            <p className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950 p-2 rounded">
              🛠️ Development Mode Active
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/onboarding">
              <Button size="lg" className="w-full">
                Start Onboarding
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">ReviewAI</h1>
          <p className="text-muted-foreground">
            AI-powered code review assistant for GitLab
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Automated code reviews, intelligent suggestions, and continuous learning
            </p>
          </div>

          <a href={`${API_URL}/auth/login`}>
            <Button size="lg" className="w-full gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="m23.6 9.593-.033-.086L20.3.98a.851.851 0 0 0-.336-.405.87.87 0 0 0-.52-.144.87.87 0 0 0-.52.152.86.86 0 0 0-.324.413l-2.205 6.748H7.605L5.4.997a.86.86 0 0 0-.324-.413.87.87 0 0 0-.52-.152.87.87 0 0 0-.52.144.85.85 0 0 0-.337.405L.433 9.507l-.032.086a6.066 6.066 0 0 0 2.012 7.01l.01.009.027.02 4.987 3.737 2.467 1.868 1.503 1.136a1.01 1.01 0 0 0 1.22 0l1.503-1.136 2.467-1.868 5.014-3.756.012-.01a6.07 6.07 0 0 0 2.009-7.01" />
              </svg>
              Sign in with GitLab
            </Button>
          </a>

          <p className="text-xs text-muted-foreground">
            By signing in, you'll connect your GitLab account to enable automated code reviews
          </p>
        </div>
      </Card>
    </div>
  )
}
