"use client"

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

function SignedInRedirect() {
  const router = useRouter()

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const status = await api.getOnboardingStatus()
        if (!status.completed || !status.has_tokens) {
          router.push("/onboarding")
        } else {
          router.push("/repositories")
        }
      } catch (error) {
        console.error("Failed to check onboarding:", error)
        // Handle error, maybe redirect to an error page or show a message
      }
    }
    checkOnboarding()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">ReviewAI</h1>
          <p className="text-muted-foreground">
            AI-powered code review assistant for GitLab
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="ml-4">Redirecting...</p>
        </div>
      </Card>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <SignedIn>
        <SignedInRedirect />
      </SignedIn>
      <SignedOut>
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
                  Automated code reviews, intelligent suggestions, and
                  continuous learning
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <SignInButton mode="modal">
                  <Button>Sign In</Button>
                </SignInButton>
              </div>
              <p className="text-xs text-muted-foreground">
                By signing in, you'll connect your GitLab account to enable
                automated code reviews
              </p>
            </div>
          </Card>
        </div>
      </SignedOut>
    </>
  )
}
