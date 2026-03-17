'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { ModuleCard } from '@/components/dashboard/module-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Bot,
  FileText,
  Ship,
  FolderOpen,
  Calculator,
  Briefcase,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench,
} from 'lucide-react'
import { getDossiers, getTracking, getNotifications } from '@/lib/store'
import type { Dossier, Tracking, Notification } from '@/lib/types'

export default function HomePage() {
  const [dossiers, setDossiers] = useState<Dossier[]>([])
  const [tracking, setTracking] = useState<Tracking[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    setDossiers(getDossiers())
    setTracking(getTracking())
    setNotifications(getNotifications())
  }, [])

  const dossiersStats = {
    pret: dossiers.filter(d => d.statut === 'pret').length,
    attente: dossiers.filter(d => d.statut === 'attente').length,
    alerte: dossiers.filter(d => d.statut === 'alerte').length,
  }

  const trackingStats = {
    maritime: tracking.filter(t => t.type === 'maritime').length,
    aerien: tracking.filter(t => t.type === 'aerien').length,
  }

  return (
    <DashboardLayout title="Tableau de bord">
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-6">
          <h1 className="text-2xl font-bold text-foreground">
            Bienvenue sur KARAMEL SH
          </h1>
          <p className="mt-1 text-muted-foreground">
            Application de gestion douanière pour la Polynésie Française
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dossiersStats.pret}</p>
                <p className="text-sm text-muted-foreground">Dossiers prêts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dossiersStats.attente}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{dossiersStats.alerte}</p>
                <p className="text-sm text-muted-foreground">Alertes</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Ship className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{trackingStats.maritime + trackingStats.aerien}</p>
                <p className="text-sm text-muted-foreground">Colis en cours</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Modules</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ModuleCard
              title="IA Classification"
              description="Agent IA pour classification douanière et codes SH"
              icon={Bot}
              href="/ia"
              badge="TAPAS 2026"
              stats={[
                { label: 'Sources', value: 5 },
              ]}
            />

            <ModuleCard
              title="Documents"
              description="Import et analyse de documents PDF, XLS, images"
              icon={FileText}
              href="/documents"
            />

            <ModuleCard
              title="Tracking"
              description="Suivi maritime et aérien avec carte en temps réel"
              icon={Ship}
              href="/tracking"
              stats={[
                { label: 'Maritime', value: trackingStats.maritime },
                { label: 'Aérien', value: trackingStats.aerien },
              ]}
            />

            <ModuleCard
              title="Dossiers"
              description="Tableau de suivi des dossiers avec statuts"
              icon={FolderOpen}
              href="/dossiers"
              badge={dossiersStats.alerte > 0 ? `${dossiersStats.alerte} alerte(s)` : undefined}
              badgeVariant={dossiersStats.alerte > 0 ? 'destructive' : 'secondary'}
              stats={[
                { label: 'Total', value: dossiers.length },
              ]}
            />

            <ModuleCard
              title="Calcul Droits"
              description="Calculateur de droits, taxes et valeur CAF"
              icon={Calculator}
              href="/calcul"
            />

            <ModuleCard
              title="Office"
              description="Bureau: mails, notes, formulaires"
              icon={Briefcase}
              href="/office"
            />

            <ModuleCard
              title="Boîte à outils"
              description="Conversion de fichiers XLS, PDF, images"
              icon={Wrench}
              href="/outils"
            />

            <ModuleCard
              title="Recherche Web"
              description="Recherche sur les sites officiels douaniers"
              icon={Search}
              href="/recherche"
            />
          </div>
        </div>

        {/* Recent activity and upcoming */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upcoming ETAs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="h-5 w-5" />
                Prochaines arrivées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tracking.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      item.type === 'maritime' ? 'bg-blue-100' : 'bg-sky-100'
                    }`}>
                      <Ship className={`h-5 w-5 ${
                        item.type === 'maritime' ? 'text-blue-600' : 'text-sky-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{item.navire || item.vol}</p>
                      <p className="text-sm text-muted-foreground">{item.compagnie}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{new Date(item.eta).toLocaleDateString('fr-FR')}</p>
                    <Badge variant={item.statut === 'arrive' ? 'default' : 'secondary'}>
                      {item.statut === 'arrive' ? 'Arrivé' : 'En route'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-5 w-5" />
                Notifications récentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className={`rounded-lg border p-3 ${
                    notif.read ? 'border-border' : 'border-primary/50 bg-primary/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{notif.title}</p>
                      <p className="text-sm text-muted-foreground">{notif.message}</p>
                    </div>
                    <Badge variant={notif.type === 'alerte' ? 'destructive' : 'outline'}>
                      {notif.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
