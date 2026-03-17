'use client'

import { Menu, Search, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  onMenuClick: () => void
  title?: string
  notificationCount?: number
}

export function Header({ onMenuClick, title = 'KARAMEL SH', notificationCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      {/* Menu button mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Title */}
      <h1 className="text-lg font-semibold text-foreground lg:hidden">{title}</h1>

      {/* Search bar */}
      <div className="relative ml-auto flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher code SH, dossier, navire..."
          className="w-full pl-10 bg-secondary"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <span className="font-medium">ARANUI 5 - Arrivée prévue</span>
                <span className="text-xs text-muted-foreground">
                  Le navire arrivera dans 3 jours
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <span className="font-medium">Nouvelle circulaire DGAE</span>
                <span className="text-xs text-muted-foreground">
                  Publication sur les produits alimentaires
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary">
              Voir toutes les notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
