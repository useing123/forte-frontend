"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FileText, Plus } from "lucide-react"

export default function ReportsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reportType, setReportType] = useState("recurring")
  const [reports] = useState<any[]>([])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Reports</h1>
      </div>

      {/* Empty State or Report List */}
      <Card className="bg-card border-border p-16">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">Create your first report</h3>
            <p className="text-sm text-muted-foreground mb-4">{"Let's tell your data's story together!"}</p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Create Report
            </Button>
          </div>
        ) : (
          <div>Reports list will go here</div>
        )}
      </Card>

      {/* Create Report Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Select Report Type</DialogTitle>
          </DialogHeader>

          <RadioGroup value={reportType} onValueChange={setReportType} className="space-y-4">
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="recurring" id="recurring" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="recurring" className="text-sm font-medium text-foreground cursor-pointer">
                  Recurring
                </Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  The report will be generated at the cadence you select and will run repeatedly
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <RadioGroupItem value="on-demand" id="on-demand" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="on-demand" className="text-sm font-medium text-foreground cursor-pointer">
                  On-Demand
                </Label>
                <p className="text-sm text-muted-foreground mt-0.5">
                  The report will be generated for the date range you select and will run once
                </p>
              </div>
            </div>
          </RadioGroup>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setIsModalOpen(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
