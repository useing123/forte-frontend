"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "./sidebar"

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <main className="flex-1 overflow-y-auto bg-background">{children}</main>
    </div>
  )
}
