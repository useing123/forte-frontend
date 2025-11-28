"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2, XCircle, ExternalLink, Trash2, Edit2, Plus } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface JiraConfig {
    id?: string
    name: string
    url: string
    email: string
    project_keys: string[]
    max_issues: number
    search_window: string
}

interface JiraConfigsResponse {
    configs: JiraConfig[]
    configured: boolean
}

export default function IntegrationsPage() {
    const [configs, setConfigs] = useState<JiraConfig[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingConfig, setEditingConfig] = useState<JiraConfig | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [showAdvanced, setShowAdvanced] = useState(false)
    const { toast } = useToast()

    const [formData, setFormData] = useState({
        name: "",
        url: "",
        email: "",
        api_token: "",
        project_keys: "",
        max_issues: "5",
        search_window: "-30d"
    })

    useEffect(() => {
        loadConfigs()
    }, [])

    async function loadConfigs() {
        setLoading(true)
        try {
            const response = await fetch('/api/integrations/jira')
            if (response.ok) {
                const data: JiraConfigsResponse = await response.json()
                if (Array.isArray(data.configs)) {
                    setConfigs(data.configs)
                } else if (data.configured) {
                    setConfigs([data as any])
                } else {
                    setConfigs([])
                }
            }
        } catch (error) {
            console.error('Failed to load Jira configs:', error)
            toast({
                title: "Error",
                description: "Failed to load Jira configurations.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    function openAddDialog() {
        setEditingConfig(null)
        setFormData({
            name: "",
            url: "",
            email: "",
            api_token: "",
            project_keys: "",
            max_issues: "5",
            search_window: "-30d"
        })
        setShowAdvanced(false)
        setIsDialogOpen(true)
    }

    function openEditDialog(config: JiraConfig) {
        setEditingConfig(config)
        setFormData({
            name: config.name || "",
            url: config.url || "",
            email: config.email || "",
            api_token: "",
            project_keys: config.project_keys?.join(", ") || "",
            max_issues: String(config.max_issues || 5),
            search_window: config.search_window || "-30d"
        })
        setShowAdvanced(false)
        setIsDialogOpen(true)
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setIsSaving(true)

        try {
            const payload: any = {
                id: editingConfig?.id,
                name: formData.name.trim(),
                url: formData.url.trim(),
                email: formData.email.trim(),
                project_keys: formData.project_keys.split(',').map(k => k.trim()).filter(k => k),
                max_issues: parseInt(formData.max_issues),
                search_window: formData.search_window.trim()
            }

            if (formData.api_token.trim()) {
                payload.api_token = formData.api_token.trim()
            }

            const response = await fetch('/api/integrations/jira', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to save configuration')
            }

            toast({
                title: "Success",
                description: editingConfig
                    ? "Jira integration updated successfully."
                    : "Jira integration added successfully.",
            })

            setIsDialogOpen(false)
            await loadConfigs()
        } catch (error) {
            console.error('Failed to save Jira config:', error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to save configuration.",
                variant: "destructive",
            })
        } finally {
            setIsSaving(false)
        }
    }

    async function handleDelete(config: JiraConfig) {
        const configId = config.id || config.url
        if (!confirm(`Are you sure you want to disconnect "${config.name || config.url}"?`)) {
            return
        }

        setDeletingId(configId)
        try {
            const response = await fetch(`/api/integrations/jira${config.id ? `?id=${config.id}` : ''}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to disconnect')
            }

            toast({
                title: "Success",
                description: "Jira integration disconnected.",
            })

            await loadConfigs()
        } catch (error) {
            console.error('Failed to disconnect Jira:', error)
            toast({
                title: "Error",
                description: "Failed to disconnect Jira integration.",
                variant: "destructive",
            })
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Integrations</h1>
                    <p className="text-sm text-muted-foreground">Connect external services to enhance your workflow.</p>
                </div>
                <Button onClick={openAddDialog} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Jira Integration
                </Button>
            </div>

            <div className="max-w-4xl space-y-4">
                {configs.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Jira Integrations</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Connect your Jira instance to track issues and link them to code reviews.
                            </p>
                            <Button onClick={openAddDialog} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Your First Integration
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    configs.map((config) => {
                        const configId = config.id || config.url
                        return (
                            <Card key={configId}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="flex items-center gap-2">
                                                {config.name || config.url}
                                                <Badge variant="outline" className="gap-1.5 text-green-600 border-green-200 bg-green-50">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Connected
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription>{config.url}</CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => window.open(config.url, '_blank')}
                                                className="gap-2"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Open Jira
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openEditDialog(config)}
                                                className="gap-2"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(config)}
                                                disabled={deletingId === configId}
                                                className="gap-2"
                                            >
                                                {deletingId === configId ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Removing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="h-4 w-4" />
                                                        Remove
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-muted-foreground">Email:</span>
                                            <p className="mt-1">{config.email}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-muted-foreground">Project Keys:</span>
                                            <p className="mt-1">{config.project_keys.join(", ")}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-muted-foreground">Max Issues:</span>
                                            <p className="mt-1">{config.max_issues}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-muted-foreground">Search Window:</span>
                                            <p className="mt-1">{config.search_window}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingConfig ? "Edit Jira Integration" : "Add Jira Integration"}
                        </DialogTitle>
                        <DialogDescription>
                            Connect your Jira instance to track issues. Generate an API token at{" "}
                            <a
                                href="https://id.atlassian.com/manage-profile/security/api-tokens"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary hover:underline"
                            >
                                Atlassian Security Settings
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Configuration Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g. Main Jira, Team Project"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">Jira URL *</Label>
                            <Input
                                id="url"
                                placeholder="https://your-company.atlassian.net"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="api_token">API Token *</Label>
                            <Input
                                id="api_token"
                                type="password"
                                placeholder="Enter your Jira API token"
                                value={formData.api_token}
                                onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
                                required={!editingConfig}
                            />
                            {editingConfig && (
                                <p className="text-xs text-muted-foreground">
                                    Leave blank to keep existing token
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="project_keys">Project Keys *</Label>
                            <Input
                                id="project_keys"
                                placeholder="e.g. PROJ, TEAM, DEV"
                                value={formData.project_keys}
                                onChange={(e) => setFormData({ ...formData, project_keys: e.target.value })}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Comma-separated list of Jira project keys
                            </p>
                        </div>

                        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" type="button">
                                    Advanced Settings
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="max_issues">Max Issues</Label>
                                    <Input
                                        id="max_issues"
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={formData.max_issues}
                                        onChange={(e) => setFormData({ ...formData, max_issues: e.target.value })}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Maximum number of issues to fetch per request
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="search_window">Search Window</Label>
                                    <Input
                                        id="search_window"
                                        placeholder="-30d"
                                        value={formData.search_window}
                                        onChange={(e) => setFormData({ ...formData, search_window: e.target.value })}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Time window for searching issues (e.g., -30d)
                                    </p>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving} className="gap-2">
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-4 w-4" />
                                        {editingConfig ? "Update" : "Add Integration"}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
