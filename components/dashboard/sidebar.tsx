'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Bot,
  FileText,
  Ship,
  FolderOpen,
  Calculator,
  Briefcase,
  Search,
  Settings,
  Home,
  Bell,
  X,
  Wrench,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const modules = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'IA Classification', href: '/ia', icon: Bot },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Tracking', href: '/tracking', icon: Ship },
  { name: 'Dossiers', href: '/dossiers', icon: FolderOpen },
  { name: 'Calcul Droits', href: '/calcul', icon: Calculator },
  { name: 'Office', href: '/office', icon: Briefcase },
  { name: 'Boîte à outils', href: '/outils', icon: Wrench },
  { name: 'Recherche', href: '/recherche', icon: Search },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
  notificationCount?: number
}

export function Sidebar({ open, onClose, notificationCount = 0 }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sidebar-border p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
                <span className="text-lg font-bold text-sidebar-primary-foreground">K</span>
              </div>
              <div>
                <h1 className="text-lg font-bold">KARAMEL SH</h1>
                <p className="text-xs text-sidebar-foreground/70">Douane PF</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {modules.map((module) => {
                const isActive = pathname === module.href
                return (
                  <li key={module.href}>
                    <Link
                      href={module.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent'
                      )}
                    >
                      <module.icon className="h-5 w-5" />
                      {module.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center justify-between">
              <Link
                href="/notifications"
                className="flex items-center gap-2 text-sm text-sidebar-foreground hover:text-sidebar-primary-foreground"
              >
                <Bell className="h-5 w-5" />
                Notifications
                {notificationCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-5 px-1.5">
                    {notificationCount}
                  </Badge>
                )}
              </Link>
              <Link href="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Polynesian Flag indicator */}
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-sidebar-accent p-2">
              <div className="flex h-6 w-9 overflow-hidden rounded">
                <div className="w-1/3 bg-red-600" />
                <div className="w-1/3 bg-white" />
                <div className="w-1/3 bg-red-600" />
              </div>
              <span className="text-xs text-sidebar-foreground/80">Polynésie Française</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
