"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

// Supported integrations
const supportedIntegrations = [
  {
    id: "gitlab",
    name: "GitLab",
    description: "Connect your GitLab repositories for automated code reviews on merge requests.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="m23.6 9.593-.033-.086L20.3.98a.851.851 0 0 0-.336-.405.87.87 0 0 0-.52-.144.87.87 0 0 0-.52.152.86.86 0 0 0-.324.413l-2.205 6.748H7.605L5.4.997a.86.86 0 0 0-.324-.413.87.87 0 0 0-.52-.152.87.87 0 0 0-.52.144.85.85 0 0 0-.337.405L.433 9.507l-.032.086a6.066 6.066 0 0 0 2.012 7.01l.01.009.027.02 4.987 3.737 2.467 1.868 1.503 1.136a1.01 1.01 0 0 0 1.22 0l1.503-1.136 2.467-1.868 5.014-3.756.012-.01a6.07 6.07 0 0 0 2.009-7.01" />
      </svg>
    ),
    connected: false,
    status: "Not connected",
  },
  {
    id: "jira",
    name: "Jira",
    description: "Link code reviews to Jira issues for seamless project management integration.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.005 1.005 0 0 0 23.013 0z" />
      </svg>
    ),
    connected: false,
    status: "Not connected",
  },
]

// Upcoming integrations that can be requested
const upcomingIntegrations = [
  {
    id: "github",
    name: "GitHub",
    description: "Connect your GitHub repositories for automated code reviews on pull requests.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    id: "bitbucket",
    name: "Bitbucket",
    description: "Connect your Bitbucket repositories for automated code reviews on pull requests.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.778 1.211a.768.768 0 0 0-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.77.77 0 0 0 .77-.646l3.27-20.03a.768.768 0 0 0-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z" />
      </svg>
    ),
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notified in Slack when ReviewAI completes reviews or needs attention.",
    icon: (
      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
      </svg>
    ),
  },
]

export default function IntegrationsPage() {
  const [connectionStates, setConnectionStates] = useState(
    supportedIntegrations.reduce((acc, int) => ({ ...acc, [int.id]: int.connected }), {} as Record<string, boolean>),
  )

  const toggleConnection = (id: string) => {
    setConnectionStates((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Integrations</h1>
        <p className="text-sm text-muted-foreground mt-1">Connect ReviewAI to your favorite tools and services.</p>
      </div>

      {/* Supported Integration Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-foreground mb-4">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supportedIntegrations.map((integration) => (
            <Card key={integration.id} className="p-6 bg-card border-border">
              <div className="flex items-start gap-4">
                <div className="text-foreground">{integration.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{integration.name}</h3>
                    {connectionStates[integration.id] && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                        <Check className="h-3 w-3" />
                        Connected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                  <Button
                    variant={connectionStates[integration.id] ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleConnection(integration.id)}
                    className={
                      connectionStates[integration.id] ? "" : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }
                  >
                    {connectionStates[integration.id] ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Integrations */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-medium text-foreground">Request an Integration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            These integrations are coming soon. Let us know if you'd like to see them sooner!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingIntegrations.map((integration) => (
            <Card key={integration.id} className="p-6 bg-card border-border opacity-75">
              <div className="flex items-start gap-4">
                <div className="text-muted-foreground">{integration.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground">{integration.name}</h3>
                    <Badge variant="outline" className="text-muted-foreground">
                      Coming Soon
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>
                  <Button variant="outline" size="sm" disabled>
                    Request
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
