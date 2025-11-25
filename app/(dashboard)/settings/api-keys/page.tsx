"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { api, type ApiKey } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showKey, setShowKey] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadApiKeys()
  }, [])

  async function loadApiKeys() {
    setLoading(true)
    try {
      const data = await api.getApiKeys()
      setApiKeys(data.data)
    } catch (error) {
      console.error('Failed to load API keys:', error)
      toast({
        title: "Error",
        description: "Failed to load API keys. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    })
  }

  async function deleteKey(id: string) {
    try {
      await api.deleteApiKey(id)
      setApiKeys((keys) => keys.filter((k) => k.id !== id))
      toast({
        title: "Success",
        description: "API key deleted successfully",
      })
    } catch (error) {
      console.error('Failed to delete API key:', error)
      toast({
        title: "Error",
        description: "Failed to delete API key. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function createKey() {
    if (!newKeyName.trim()) return

    try {
      const newKey = await api.createApiKey(newKeyName)
      setApiKeys((keys) => [...keys, newKey])
      setNewlyCreatedKey(newKey.key || null) // Save the full key to display (only shown once)
      setNewKeyName("")
      toast({
        title: "Success",
        description: "API key created successfully. Make sure to copy it now!",
      })
    } catch (error) {
      console.error('Failed to create API key:', error)
      toast({
        title: "Error",
        description: "Failed to create API key. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">API Keys</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage API keys for programmatic access to ReviewAI.</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Key
        </Button>
      </div>

      {/* API Keys List */}
      <Card className="bg-card border-border">
        {loading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
                  <div className="h-4 w-64 bg-secondary rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            No API keys found. Create your first API key to get started.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{apiKey.key_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm text-muted-foreground font-mono">
                      {showKey === apiKey.id && apiKey.key ? apiKey.key : `${apiKey.key_prefix}${"*".repeat(24)}`}
                    </code>
                    {apiKey.key && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                      >
                        {showKey === apiKey.id ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(apiKey.key || `${apiKey.key_prefix}${"*".repeat(24)}`)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Created {formatDate(apiKey.created_at)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteKey(apiKey.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Show newly created key warning */}
        {newlyCreatedKey && (
          <div className="p-4 bg-primary/10 border-t border-primary/20">
            <p className="text-sm font-medium text-primary mb-2">⚠️ Save your API key now!</p>
            <p className="text-xs text-muted-foreground mb-2">
              This is the only time you'll see the full key. Copy it now and store it securely.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-background p-2 rounded border">{newlyCreatedKey}</code>
              <Button size="sm" onClick={() => {
                copyToClipboard(newlyCreatedKey)
                setNewlyCreatedKey(null)
                setIsCreateModalOpen(false)
              }}>
                Copy & Close
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Key Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create API Key</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Give your API key a name to help you remember what it{"'"}s used for.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-foreground">Key Name</Label>
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API Key"
                className="mt-2 bg-secondary border-border"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createKey} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Create Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
