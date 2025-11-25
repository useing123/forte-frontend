"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { api, type Repository } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState("10")
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    loadRepositories()
  }, [searchQuery, currentPage, rowsPerPage])

  async function loadRepositories() {
    setLoading(true)
    try {
      const data = await api.getRepositories({
        search: searchQuery,
        page: currentPage,
        per_page: parseInt(rowsPerPage)
      })
      setRepositories(data.data)
      if (data.pagination) {
        setTotalPages(Math.ceil(data.pagination.total / data.pagination.per_page))
      }
    } catch (error) {
      console.error('Failed to load repositories:', error)
      toast({
        title: "Error",
        description: "Failed to load repositories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSync() {
    setSyncing(true)
    try {
      await api.syncRepositories()
      await loadRepositories()
      toast({
        title: "Success",
        description: "Repositories synced successfully",
      })
    } catch (error) {
      console.error('Failed to sync repositories:', error)
      toast({
        title: "Error",
        description: "Failed to sync repositories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  const formatLastReview = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    return 'Less than an hour ago'
  }

  const filteredRepos = repositories

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Repositories</h1>
          <p className="text-sm text-muted-foreground">List of repositories from your GitLab account.</p>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncing}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync from GitLab'}
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Repo not found? Search here..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-secondary border-border"
        />
      </div>

      {/* Table */}
      <Card className="bg-card border-border">
        <div className="border-b border-border">
          <div className="grid grid-cols-3 px-4 py-3">
            <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary">
              Repository
              <ArrowUpDown className="h-3 w-3" />
            </button>
            <div className="text-sm font-medium text-foreground">Visibility</div>
            <div className="text-sm font-medium text-foreground">Last Review</div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-3 px-4 py-3 items-center">
                <div className="h-4 bg-secondary rounded animate-pulse" />
                <div className="h-6 w-20 bg-secondary rounded animate-pulse" />
                <div className="h-4 w-24 bg-secondary rounded animate-pulse" />
              </div>
            ))
          ) : filteredRepos.length === 0 ? (
            <div className="p-16 text-center text-muted-foreground">
              {searchQuery ? 'No repositories found matching your search.' : 'No repositories found. Click "Sync from GitLab" to fetch your repositories.'}
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className="grid grid-cols-3 px-4 py-3 items-center hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <span className="text-sm font-medium text-foreground">{repo.name}</span>
                <div>
                  <Badge
                    variant="secondary"
                    className={
                      repo.visibility === "public"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-secondary text-muted-foreground"
                    }
                  >
                    {repo.visibility.charAt(0).toUpperCase() + repo.visibility.slice(1)}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{formatLastReview(repo.last_review_at)}</span>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
              <SelectTrigger className="w-16 h-8 bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
