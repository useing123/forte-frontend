"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info, RefreshCw, ZoomOut, Clock } from "lucide-react"
import { api, type DashboardMetrics, type LeaderboardEntry } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30days")
  const [repoFilter, setRepoFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [teamFilter, setTeamFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [timeRange])

  async function loadDashboardData() {
    setLoading(true)
    try {
      const [metricsData, leaderboardData] = await Promise.all([
        api.getMetrics(timeRange),
        api.getLeaderboard()
      ])
      setMetrics(metricsData)
      setLeaderboard(leaderboardData.data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="adoption" className="mb-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="adoption">Adoption</TabsTrigger>
          <TabsTrigger value="breakdown">Suggestion Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="adoption" className="mt-6">
          {/* Filters Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Repository Name</span>
                <Select value={repoFilter} onValueChange={setRepoFilter}>
                  <SelectTrigger className="w-24 h-8 bg-secondary border-border">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="frontend">frontend</SelectItem>
                    <SelectItem value="backend">backend</SelectItem>
                    <SelectItem value="api">api</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Username</span>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-24 h-8 bg-secondary border-border">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="alice">Alice</SelectItem>
                    <SelectItem value="bob">Bob</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Team</span>
                <Select value={teamFilter} onValueChange={setTeamFilter}>
                  <SelectTrigger className="w-24 h-8 bg-secondary border-border">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="platform">Platform</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Last 30 days</span>
                <span className="text-primary font-medium">UTC</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* PRs Reviewed */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">PRs Reviewed</h3>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-10 bg-secondary rounded animate-pulse" />
                  <div className="h-10 bg-secondary rounded animate-pulse" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Total</p>
                    <p className="text-3xl font-bold text-primary">{metrics?.prsReviewed.total || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Incremental</p>
                    <p className="text-3xl font-bold text-chart-3">{metrics?.prsReviewed.incremental || 0}</p>
                  </div>
                </div>
              )}
            </Card>

            {/* ReviewAI Suggestions */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">ReviewAI Suggestions</h3>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-10 bg-secondary rounded animate-pulse" />
                  <div className="h-10 bg-secondary rounded animate-pulse" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Review Comments</p>
                    <p className="text-3xl font-bold text-foreground">{metrics?.suggestions.reviewComments || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Accepted</p>
                    <p className="text-3xl font-bold text-foreground">{metrics?.suggestions.accepted || 0}</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Learnings */}
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">Learnings</h3>
                <Info className="h-4 w-4 text-muted-foreground" />
              </div>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-10 bg-secondary rounded animate-pulse" />
                  <div className="h-10 bg-secondary rounded animate-pulse" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Used</p>
                    <p className="text-3xl font-bold text-primary">{metrics?.learnings.used || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-1">Created</p>
                    <p className="text-3xl font-bold text-chart-3">{metrics?.learnings.created || 0}</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Leaderboard */}
          <Card className="bg-card border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-medium text-foreground">Developer Adoption Leaderboard</h3>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>

            {loading ? (
              <div className="divide-y divide-border">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-4 px-4 py-3 items-center">
                    <div className="h-4 bg-secondary rounded animate-pulse" />
                    <div className="h-4 bg-secondary rounded animate-pulse" />
                    <div className="h-4 bg-secondary rounded animate-pulse" />
                    <div className="h-4 bg-secondary rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : leaderboard.length > 0 ? (
              <div className="divide-y divide-border">
                {/* Table Header */}
                <div className="grid grid-cols-4 px-4 py-3 text-xs font-medium text-muted-foreground uppercase">
                  <div>Rank</div>
                  <div>Developer</div>
                  <div className="text-right">PRs Reviewed</div>
                  <div className="text-right">Suggestions Accepted</div>
                </div>
                {/* Table Rows */}
                {leaderboard.map((dev) => (
                  <div
                    key={dev.rank}
                    className="grid grid-cols-4 px-4 py-3 items-center hover:bg-secondary/50 transition-colors"
                  >
                    <div className="text-sm font-medium text-foreground">#{dev.rank}</div>
                    <div className="flex items-center gap-3">
                      {dev.user.avatar_url ? (
                        <img
                          src={dev.user.avatar_url}
                          alt={dev.user.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                          {dev.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm text-foreground">{dev.user.name}</span>
                    </div>
                    <div className="text-right text-sm text-foreground">{dev.prs_reviewed}</div>
                    <div className="text-right text-sm text-foreground">{dev.suggestions_accepted}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center text-muted-foreground">No data available</div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="mt-6">
          <Card className="p-16 bg-card border-border">
            <div className="text-center text-muted-foreground">
              <p>Suggestion breakdown analytics coming soon</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
