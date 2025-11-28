"use client"

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { FloatingElements } from "@/components/floating-elements"
import { Code, GitBranch, MessageSquare, Sparkles, Zap, CheckCircle } from "lucide-react"

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
      }
    }
    checkOnboarding()
  }, [router])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-violet-600 via-purple-500 to-cyan-400">
      <FloatingElements />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="text-center text-white space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">ReviewAI</h1>
          <p className="text-xl text-white/80">Redirecting to your dashboard...</p>
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/30 border-t-white"></div>
          </div>
        </div>
      </div>
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
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-violet-600 via-purple-500 to-cyan-400">

          {/* Floating Elements */}
          <FloatingElements />

          {/* Hero Section */}
          <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-16 md:pt-24">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight text-balance leading-tight">
                What will you{" "}
                <span className="relative">
                  review
                  <Sparkles className="absolute -top-4 -right-8 h-8 w-8 text-yellow-300 animate-pulse" />
                </span>{" "}
                today?
              </h1>
              <p className="mt-6 text-xl md:text-2xl text-white/90 max-w-2xl mx-auto text-pretty">
                Senior AI reviews in your gitlab repositories
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <SignInButton mode="modal">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-white/90 text-lg px-8 py-6 rounded-full shadow-xl shadow-purple-900/30"
                  >
                    Start for free
                  </Button>
                </SignInButton>
              </div>
              <p className="mt-4 text-sm text-white/70">Connect your GitLab account to enable automated code reviews</p>
            </div>

            {/* Feature Pills */}
            <div className="mt-16 flex flex-wrap justify-center gap-3 max-w-3xl">
              {[
                { icon: Zap, text: "Instant Analysis" },
                { icon: MessageSquare, text: "Smart Comments" },
                { icon: GitBranch, text: "GitLab Integration" },
                { icon: CheckCircle, text: "Best Practices" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-white"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Globe/Visual Section */}
            <div className="relative mt-12 w-full max-w-5xl">
              <div className="relative mx-auto aspect-[16/10] w-full max-w-3xl">
                {/* Gradient Globe */}
                <div className="absolute inset-x-0 bottom-0 h-[80%] rounded-t-full bg-gradient-to-t from-teal-400/80 via-cyan-300/60 to-transparent blur-sm" />
                <div className="absolute inset-x-4 bottom-0 h-[75%] rounded-t-full bg-gradient-to-t from-emerald-400/60 via-teal-300/40 to-transparent" />

                {/* Code Window Preview */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-md">
                  <div className="rounded-2xl bg-slate-900/90 backdrop-blur-xl shadow-2xl overflow-hidden border border-white/10">
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50">
                      <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500" />
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                      </div>
                      <span className="text-xs text-slate-400 ml-2">merge_request.py</span>
                    </div>
                    <div className="p-4 text-sm font-mono">
                      <div className="text-emerald-400">+ def calculate_total(items):</div>
                      <div className="text-slate-400">+ return sum(i.price for i in items)</div>
                      <div className="mt-3 rounded-lg bg-purple-500/20 border border-purple-400/30 p-3">
                        <div className="flex items-start gap-2">
                          <Sparkles className="h-4 w-4 text-purple-300 mt-0.5 shrink-0" />
                          <div className="text-purple-200 text-xs">
                            <span className="font-semibold">ReviewAI:</span> Consider adding type hints and handling
                            empty lists to improve code robustness.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SignedOut>
    </>
  )
}
