'use client'

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { IAChat } from '@/components/modules/ia-chat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, BookOpen, AlertCircle, FileSearch } from 'lucide-react'

export default function IAPage() {
  return (
    <DashboardLayout title="IA Classification">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Main chat area */}
        <div className="lg:col-span-3">
          <IAChat />
        </div>

        {/* Sidebar with info */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Bot className="h-4 w-4" />
                Agent IA
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                L'agent IA analyse vos demandes et fournit le code SH avec
                justifications basées sur:
              </p>
              <ul className="mt-2 space-y-1">
                <li>- TAPAS 2026</li>
                <li>- Notes de chapitre</li>
                <li>- NESH</li>
                <li>- Textes LEXPOL</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4" />
                Sources officielles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="https://service-public.pf/douane"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary hover:underline"
              >
                Douane PF
              </a>
              <a
                href="https://lexpol.cloud.pf"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary hover:underline"
              >
                LEXPOL
              </a>
              <a
                href="https://service-public.pf/dgae"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary hover:underline"
              >
                DGAE
              </a>
              <a
                href="https://service-public.pf/biosecurite"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary hover:underline"
              >
                Biosécurité
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                Réglementations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">PROHIBÉ</Badge>
                <span className="text-xs text-muted-foreground">Certaines espèces</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">AUTORISATION</Badge>
                <span className="text-xs text-muted-foreground">DGAE requise</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-green-500 text-green-600">PHYTO</Badge>
                <span className="text-xs text-muted-foreground">Biosécurité</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileSearch className="h-4 w-4" />
                Exemples de requêtes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="cursor-pointer hover:text-foreground">
                "Code SH pour chocolat en tablette"
              </p>
              <p className="cursor-pointer hover:text-foreground">
                "Classification véhicule occasion"
              </p>
              <p className="cursor-pointer hover:text-foreground">
                "iPhone neuf code douane"
              </p>
              <p className="cursor-pointer hover:text-foreground">
                "Réglementation produits alimentaires"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
