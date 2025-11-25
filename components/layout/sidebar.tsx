"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import {
  LayoutDashboard,
  GitBranch,
  Plug,
  FileText,
  Brain,
  Settings,
  CreditCard,
  ChevronDown,
  ChevronUp,
  FileCode,
  HelpCircle,
  Rocket,
  Bell,
  LogOut,
  PanelLeftClose,
} from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const mainNavItems = [
  { name: "Repositories", href: "/repositories", icon: GitBranch },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Integrations", href: "/integrations", icon: Plug },
  { name: "Reports", href: "/reports", icon: FileText },
]

const settingsNavItems = [
  { name: "Configuration", href: "/settings/configuration" },
  { name: "API Keys", href: "/settings/api-keys" },
]

interface SidebarProps {
  collapsed?: boolean
  onCollapse?: (collapsed: boolean) => void
}

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [settingsOpen, setSettingsOpen] = useState(pathname.startsWith("/settings"))

  const handleLogout = async () => {
    try {
      await api.logout()
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Organization Header */}
      <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/github-logo.png" />
          <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-xs">GH</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-sidebar-foreground truncate">myorg</p>
            <p className="text-xs text-muted-foreground">Switch Organization</p>
          </div>
        )}
        {!collapsed && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-sidebar-accent text-sidebar-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}

      </nav>


      {/* Footer Links */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Link
          href="/docs"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <FileCode className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Docs</span>}
        </Link>
        <Link
          href="/support"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <HelpCircle className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Support</span>}
        </Link>
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback className="bg-primary/20 text-primary text-xs">U</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">user123</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-sidebar-foreground"
                >
                  <Bell className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-sidebar-foreground"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
        {/* Collapse/Expand Toggle Button - Always visible */}
        <Button
          variant="ghost"
          onClick={() => onCollapse?.(!collapsed)}
          className={cn(
            "mt-2 text-muted-foreground hover:text-sidebar-foreground transition-all",
            collapsed
              ? "w-full justify-center px-0"
              : "w-full justify-start gap-3 px-3"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeftClose
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span>Collapse</span>}
        </Button>
      </div>
    </aside>
  )
}
