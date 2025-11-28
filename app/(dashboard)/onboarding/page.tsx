"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Copy, Check, Shield, Eye, EyeOff, ArrowRight, ChevronRight, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [token, setToken] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokens, setTokens] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [showToken, setShowToken] = useState(false)
    const [copiedItem, setCopiedItem] = useState<string | null>(null)

    useEffect(() => {
        loadTokens()
    }, [])

    const loadTokens = async () => {
        try {
            const response = await api.getTokens()
            setTokens(response.data)
        } catch (error) {
            console.error('Failed to load tokens:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!token.trim() || !tokenName.trim()) {
            toast({
                title: "Required fields missing",
                description: "Please enter both a token name and the token itself",
                variant: "destructive",
            })
            return
        }

        setLoading(true)
        try {
            await api.submitProjectToken(token, tokenName)
            toast({
                title: "Success",
                description: "Token added successfully",
            })
            router.push("/repositories?sync=true")
        } catch (error) {
            console.error('Failed to submit token:', error)
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
            toast({
                title: "Connection failed",
                description: `Failed to add token: ${errorMessage}. Please verify your token and try again.`,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteToken = async (id: string) => {
        try {
            await api.deleteToken(id)
            toast({
                title: "Success",
                description: "Token deleted successfully",
            })
            loadTokens()
        } catch (error) {
            console.error('Failed to delete token:', error)
            toast({
                title: "Error",
                description: "Failed to delete token",
                variant: "destructive",
            })
        }
    }

    const handleContinue = () => {
        router.push("/repositories")
    }

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        setCopiedItem(label)
        toast({
            title: "Copied",
            description: `${label} copied to clipboard`,
        })
        setTimeout(() => setCopiedItem(null), 2000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-8">
            <div className="w-full max-w-auto">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Connect Your GitLab Project</h1>
                        <p className="text-base text-muted-foreground">
                            Create a project access token in 3 simple steps
                        </p>
                    </div>
                </div>

                {/* Main Content: Side by Side */}
                <div className="grid lg:grid-cols-[1fr_400px] gap-6">
                    {/* Left: Instructions */}
                    <Card className="p-8 shadow-xl">
                        <div className="space-y-8">
                            {/* Step 1 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-base font-bold flex-shrink-0">
                                        1
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Navigate to Access Tokens</h3>
                                        <p className="text-sm text-muted-foreground">Go to your GitLab project settings</p>
                                    </div>
                                </div>

                                <div className="pl-13 space-y-4">
                                    <div className="bg-secondary/30 rounded-lg p-4 border">
                                        <p className="text-sm font-medium text-muted-foreground mb-3">Follow this path:</p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="secondary" className="font-mono text-xs">Repository</Badge>
                                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                            <Badge variant="secondary" className="font-mono text-xs">Settings</Badge>
                                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                            <Badge variant="secondary" className="font-mono text-xs">Access Tokens</Badge>
                                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                                            <Badge className="font-mono text-xs bg-primary">Add new token</Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Step 2 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-base font-bold flex-shrink-0">
                                        2
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Configure Token Settings</h3>
                                        <p className="text-sm text-muted-foreground">Set name and select required scopes</p>
                                    </div>
                                </div>

                                <div className="pl-13 space-y-4">
                                    {/* <div className="bg-secondary/30 rounded-lg p-4 border space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-semibold">Token name</Label>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard("ReviewAI", "Token name")}
                                                className="h-7 gap-1.5"
                                            >
                                                {copiedItem === "Token name" ? (
                                                    <>
                                                        <Check className="h-3.5 w-3.5" />
                                                        <span className="text-xs">Copied</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="h-3.5 w-3.5" />
                                                        <span className="text-xs">Copy</span>
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                        <code className="block text-sm bg-background px-3 py-2 rounded border font-mono">
                                            ReviewAI
                                        </code>
                                    </div> */}

                                    {/* Scopes */}
                                    <div className="bg-secondary/30 rounded-lg p-4 border space-y-3">
                                        <Label className="text-sm font-semibold">Select these 3 scopes</Label>
                                        <div className="space-y-2">
                                            {[
                                                { name: 'api', desc: 'Full API access' },
                                                { name: 'read_api', desc: 'Read-only API access' },
                                                { name: 'read_repository', desc: 'Read repository data' }
                                            ].map((scope) => (
                                                <div key={scope.name} className="flex items-start gap-2.5 bg-background px-3 py-2 rounded">
                                                    <div className="flex items-center justify-center w-4 h-4 rounded bg-primary text-primary-foreground flex-shrink-0 mt-0.5">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <code className="text-sm font-mono font-semibold">{scope.name}</code>
                                                        <p className="text-xs text-muted-foreground">{scope.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Step 3 */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-base font-bold flex-shrink-0">
                                        3
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Create & Copy Token</h3>
                                        <p className="text-sm text-muted-foreground">Generate and save your token</p>
                                    </div>
                                </div>

                                <div className="pl-13 space-y-3">
                                    <ul className="space-y-2 text-sm text-muted-foreground">
                                        <li className="flex items-start gap-2.5">
                                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Click <strong className="text-foreground">Create project access token</strong></span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>GitLab will generate your token (shown only once)</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span>Copy the token and paste it in the form</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Right: Token Input (Sticky) */}
                    <div className="lg:sticky lg:top-8 lg:self-start">
                        <Card className="p-6 shadow-xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="token" className="text-base font-semibold">
                                        Add New Token
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        Paste the token you created in GitLab
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="tokenName" className="text-sm font-medium">Token Name</Label>
                                    <Input
                                        id="tokenName"
                                        placeholder="e.g. Work Projects"
                                        value={tokenName}
                                        onChange={(e) => setTokenName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="token" className="text-sm font-medium">Access Token</Label>
                                    <div className="relative">
                                        <Input
                                            id="token"
                                            type={showToken ? "text" : "password"}
                                            placeholder="glpat-xxxxxxxxxxxxxxxxxxxx"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value)}
                                            className="pr-12 h-12 font-mono text-sm"
                                            required
                                            autoComplete="off"
                                            autoFocus
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowToken(!showToken)}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 p-0"
                                            tabIndex={-1}
                                        >
                                            {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Shield className="h-3.5 w-3.5" />
                                        Your token is encrypted and stored securely
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loading || !token.trim()}
                                    size="lg"
                                    className="w-full h-12 text-base font-semibold"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent mr-2" />
                                            Adding Token...
                                        </>
                                    ) : (
                                        <>
                                            Add Token
                                            <Plus className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>

                                {tokens.length > 0 && (
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">Connected Tokens ({tokens.length})</h3>
                                        </div>
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {tokens.map((t) => (
                                                <div key={t.id || t.project_id} className="flex items-center justify-between p-2 bg-secondary/50 rounded text-sm">
                                                    <span className="font-medium truncate max-w-[180px]">{t.name}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteToken(t.id || t.project_id)}
                                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            onClick={handleContinue}
                                        >
                                            Continue to Repositories
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                )}

                                <Separator />

                                <div className="space-y-3">
                                    <p className="text-xs font-medium text-muted-foreground">Need help?</p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="w-full"
                                    >
                                        <a
                                            href="https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2"
                                        >
                                            <span>View GitLab Documentation</span>
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
