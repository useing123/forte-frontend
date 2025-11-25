"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function ConfigurationPage() {
  const [reviewStyle, setReviewStyle] = useState("balanced")
  const [autoSummarize, setAutoSummarize] = useState(true)
  const [requestChanges, setRequestChanges] = useState(false)
  const [customInstructions, setCustomInstructions] = useState("")

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Configuration</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize how ReviewAI reviews your code.</p>
      </div>

      <div className="space-y-6">
        {/* Review Style */}
        <Card className="p-6 bg-card border-border">
          <h3 className="font-medium text-foreground mb-4">Review Style</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">How thorough should ReviewAI be?</Label>
              <Select value={reviewStyle} onValueChange={setReviewStyle}>
                <SelectTrigger className="w-full bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chill">Chill - Focus on major issues only</SelectItem>
                  <SelectItem value="balanced">Balanced - Standard review depth</SelectItem>
                  <SelectItem value="assertive">Assertive - Detailed, nitpicky feedback</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Features */}
        <Card className="p-6 bg-card border-border">
          <h3 className="font-medium text-foreground mb-4">Features</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Auto-summarize PRs</Label>
                <p className="text-sm text-muted-foreground">Generate a high-level summary in the PR description</p>
              </div>
              <Switch checked={autoSummarize} onCheckedChange={setAutoSummarize} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Request changes</Label>
                <p className="text-sm text-muted-foreground">Allow ReviewAI to request changes on PRs</p>
              </div>
              <Switch checked={requestChanges} onCheckedChange={setRequestChanges} />
            </div>
          </div>
        </Card>

        {/* Custom Instructions */}
        <Card className="p-6 bg-card border-border">
          <h3 className="font-medium text-foreground mb-4">Custom Instructions</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">
                Add custom review guidelines for your team
              </Label>
              <Textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g., Always check for proper error handling, enforce consistent naming conventions..."
                className="min-h-[120px] bg-secondary border-border"
              />
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
