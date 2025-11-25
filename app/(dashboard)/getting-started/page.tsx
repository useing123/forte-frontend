"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Check, Circle, FileText, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChecklistItem {
  id: string
  title: string
  description?: string
  completed: boolean
  expanded?: boolean
  subItems?: {
    title: string
    description: string
    href?: string
  }[]
}

const initialChecklist: ChecklistItem[] = [
  {
    id: "try-free",
    title: "Try ReviewAI for free",
    completed: true,
    expanded: false,
  },
  {
    id: "first-review",
    title: "Checkout your first ReviewAI review",
    description: "Select a Repository and PR to see ReviewAI in action",
    completed: true,
    expanded: false,
  },
  {
    id: "personalize",
    title: "Personalize ReviewAI",
    completed: false,
    expanded: true,
    subItems: [
      {
        title: "Set your review profile",
        description: "Chill vs Assertive. Assertive provides more detailed feedback that may be considered nitpicky.",
        href: "/settings/configuration",
      },
      {
        title: "Let ReviewAI request changes on your PR",
        description: "Approve reviews once comments are resolved and all checks pass.",
        href: "/settings/configuration",
      },
      {
        title: "Summarize your PR",
        description: "Auto-generate a high-level summary in the PR/MR description.",
        href: "/settings/configuration",
      },
      {
        title: "Customize review with your own guides",
        description: "Add file path specific review guidelines.",
        href: "/settings/configuration",
      },
      {
        title: "Include or exclude files from review",
        description: "Use glob patterns to filter files (e.g., !dist/**, src/**).",
        href: "/settings/configuration",
      },
    ],
  },
]

const optimizeWorkflowChecklist: ChecklistItem[] = [
  {
    id: "integrate-issues",
    title: "Integrate with issue trackers",
    completed: false,
    expanded: false,
  },
  {
    id: "setup-notifications",
    title: "Setup notifications",
    completed: false,
    expanded: false,
  },
  {
    id: "invite-team",
    title: "Invite your team",
    completed: false,
    expanded: false,
  },
]

export default function GettingStartedPage() {
  const [quickStart, setQuickStart] = useState(initialChecklist)
  const [optimizeWorkflow, setOptimizeWorkflow] = useState(optimizeWorkflowChecklist)
  const [quickStartExpanded, setQuickStartExpanded] = useState(true)
  const [optimizeExpanded, setOptimizeExpanded] = useState(false)

  const quickStartCompleted = quickStart.filter((item) => item.completed).length
  const optimizeCompleted = optimizeWorkflow.filter((item) => item.completed).length
  const totalCompleted = quickStartCompleted + optimizeCompleted
  const totalItems = quickStart.length + optimizeWorkflow.length
  const progressPercent = Math.round((totalCompleted / totalItems) * 100)

  const toggleExpand = (id: string, list: "quickStart" | "optimize") => {
    if (list === "quickStart") {
      setQuickStart((items) => items.map((item) => (item.id === id ? { ...item, expanded: !item.expanded } : item)))
    } else {
      setOptimizeWorkflow((items) =>
        items.map((item) => (item.id === id ? { ...item, expanded: !item.expanded } : item)),
      )
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Getting started with ReviewAI</h1>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Sparkles className="h-4 w-4" />
          Skip onboarding
        </Button>
      </div>

      {/* Progress Card */}
      <Card className="p-6 mb-8 bg-card border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg className="w-16 h-16 -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${progressPercent * 1.76} 176`}
                  className="text-primary"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-foreground">
                {progressPercent}%
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {progressPercent < 50 ? "Great start!" : progressPercent < 100 ? "Good going!" : "All done!"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Learn more about ReviewAI features to supercharge your workflows.
              </p>
            </div>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <FileText className="h-4 w-4" />
            View Documentation
          </Button>
        </div>
      </Card>

      {/* Quick Start Section */}
      <div className="mb-6">
        <button
          onClick={() => setQuickStartExpanded(!quickStartExpanded)}
          className="flex items-center justify-between w-full py-3"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Quick Start</span>
            {quickStartExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {quickStartCompleted} / {quickStart.length} done
          </span>
        </button>

        {quickStartExpanded && (
          <div className="space-y-2">
            {quickStart.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "border transition-colors",
                  item.completed ? "bg-primary/5 border-primary/20" : "bg-card border-border",
                )}
              >
                <button
                  onClick={() => toggleExpand(item.id, "quickStart")}
                  className="flex items-center gap-3 w-full p-4 text-left"
                >
                  {item.completed ? (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className={cn("flex-1 font-medium", item.completed ? "text-foreground" : "text-foreground")}>
                    {item.title}
                  </span>
                  {item.subItems &&
                    (item.expanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ))}
                </button>

                {item.expanded && item.subItems && (
                  <div className="px-4 pb-4 pl-12 space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Fine-tune the way ReviewAI integrates into your workflow.
                    </p>
                    {item.subItems.map((subItem, idx) => (
                      <div key={idx}>
                        <a
                          href={subItem.href}
                          className="text-sm font-medium text-foreground underline hover:text-primary"
                        >
                          {subItem.title}
                        </a>
                        <p className="text-sm text-muted-foreground mt-0.5">{subItem.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Optimize Workflow Section */}
      <div>
        <button
          onClick={() => setOptimizeExpanded(!optimizeExpanded)}
          className="flex items-center justify-between w-full py-3"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">Optimize Workflow</span>
            {optimizeExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {optimizeCompleted} / {optimizeWorkflow.length} done
          </span>
        </button>

        {optimizeExpanded && (
          <div className="space-y-2">
            {optimizeWorkflow.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "border transition-colors",
                  item.completed ? "bg-primary/5 border-primary/20" : "bg-card border-border",
                )}
              >
                <button
                  onClick={() => toggleExpand(item.id, "optimize")}
                  className="flex items-center gap-3 w-full p-4 text-left"
                >
                  {item.completed ? (
                    <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span className="flex-1 font-medium text-foreground">{item.title}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
