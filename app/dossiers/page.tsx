'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  FolderOpen,
  Search,
  Plus,
  Upload,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Ship,
  Plane,
  Download,
} from 'lucide-react'
import { getDossiers, saveDossier, deleteDossier } from '@/lib/store'
import type { Dossier } from '@/lib/types'

const STATUT_CONFIG = {
  pret: { label: 'Prêt', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200' },
  attente: { label: 'En attente', icon: Clock, color: 'bg-orange-100 text-orange-700 border-orange-200' },
  alerte: { label: 'Alerte', icon: AlertTriangle, color: 'bg-red-100 text-red-700 border-red-200' },
}

export default function DossiersPage() {
  const [dossiers, setDossiers] = useState<Dossier[]>([])
  const [filter, setFilter] = useState<'all' | 'pret' | 'attente' | 'alerte'>('all')
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newDossier, setNewDossier] = useState<Partial<Dossier>>({
    statut: 'attente',
    type: 'maritime',
    documents: [],
  })

  useEffect(() => {
    setDossiers(getDossiers())
  }, [])

  const filteredDossiers = dossiers.filter(d => {
    const matchesStatus = filter === 'all' || d.statut === filter
    const matchesSearch =
      search === '' ||
      d.numero.toLowerCase().includes(search.toLowerCase()) ||
      d.client.toLowerCase().includes(search.toLowerCase()) ||
      d.navire?.toLowerCase().includes(search.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleAddDossier = () => {
    if (!newDossier.numero || !newDossier.client || !newDossier.eta) return

    const dossier: Dossier = {
      id: Date.now().toString(),
      numero: newDossier.numero,
      client: newDossier.client,
      statut: newDossier.statut as Dossier['statut'],
      documents: newDossier.documents || [],
      eta: newDossier.eta,
      navire: newDossier.navire,
      bl: newDossier.bl,
      type: newDossier.type as 'maritime' | 'aerien',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveDossier(dossier)
    setDossiers(getDossiers())
    setIsAddOpen(false)
    setNewDossier({ statut: 'attente', type: 'maritime', documents: [] })
  }

  const handleImportXLS = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Simulate XLS import with sample data
      const sampleImport: Dossier[] = [
        {
          id: Date.now().toString(),
          numero: `DOS-2026-${Math.floor(Math.random() * 1000)}`,
          client: 'Import XLS - Client',
          statut: 'attente',
          documents: ['Facture'],
          eta: '2026-03-25',
          navire: 'HAWAIKI NUI',
          bl: `BL-${Math.floor(Math.random() * 10000)}`,
          type: 'maritime',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]
      sampleImport.forEach(d => saveDossier(d))
      setDossiers(getDossiers())
      alert(`Fichier ${file.name} importé avec succès!`)
    }
  }

  const calculateDaysUntilETA = (eta: string) => {
    const today = new Date()
    const etaDate = new Date(eta)
    const diffTime = etaDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const updateStatus = (id: string, statut: Dossier['statut']) => {
    const dossier = dossiers.find(d => d.id === id)
    if (dossier) {
      saveDossier({ ...dossier, statut, updatedAt: new Date().toISOString() })
      setDossiers(getDossiers())
    }
  }

  const stats = {
    total: dossiers.length,
    pret: dossiers.filter(d => d.statut === 'pret').length,
    attente: dossiers.filter(d => d.statut === 'attente').length,
    alerte: dossiers.filter(d => d.statut === 'alerte').length,
  }

  return (
    <DashboardLayout title="Suivi des Dossiers">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer" onClick={() => setFilter('all')}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total dossiers</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer" onClick={() => setFilter('pret')}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pret}</p>
                <p className="text-sm text-muted-foreground">Prêts</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer" onClick={() => setFilter('attente')}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.attente}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer" onClick={() => setFilter('alerte')}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.alerte}</p>
                <p className="text-sm text-muted-foreground">Alertes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher dossier, client..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={(v: 'all' | 'pret' | 'attente' | 'alerte') => setFilter(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pret">Prêts</SelectItem>
                <SelectItem value="attente">En attente</SelectItem>
                <SelectItem value="alerte">Alertes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportXLS}
              accept=".xls,.xlsx"
              className="hidden"
            />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Import XLS
            </Button>

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau dossier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouveau dossier</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Numéro de dossier</Label>
                      <Input
                        value={newDossier.numero || ''}
                        onChange={e => setNewDossier({ ...newDossier, numero: e.target.value })}
                        placeholder="DOS-2026-XXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={newDossier.type}
                        onValueChange={v => setNewDossier({ ...newDossier, type: v as 'maritime' | 'aerien' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maritime">Maritime</SelectItem>
                          <SelectItem value="aerien">Aérien</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Input
                      value={newDossier.client || ''}
                      onChange={e => setNewDossier({ ...newDossier, client: e.target.value })}
                      placeholder="Nom du client"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>ETA</Label>
                      <Input
                        type="date"
                        value={newDossier.eta || ''}
                        onChange={e => setNewDossier({ ...newDossier, eta: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Statut</Label>
                      <Select
                        value={newDossier.statut}
                        onValueChange={v => setNewDossier({ ...newDossier, statut: v as Dossier['statut'] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pret">Prêt</SelectItem>
                          <SelectItem value="attente">En attente</SelectItem>
                          <SelectItem value="alerte">Alerte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{newDossier.type === 'maritime' ? 'Navire' : 'Vol'}</Label>
                    <Input
                      value={newDossier.navire || ''}
                      onChange={e => setNewDossier({ ...newDossier, navire: e.target.value })}
                      placeholder={newDossier.type === 'maritime' ? 'Nom du navire' : 'Numéro de vol'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>BL/LTA</Label>
                    <Input
                      value={newDossier.bl || ''}
                      onChange={e => setNewDossier({ ...newDossier, bl: e.target.value })}
                      placeholder="Référence BL ou LTA"
                    />
                  </div>
                  <Button onClick={handleAddDossier} className="w-full">
                    Créer le dossier
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dossier</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Navire/Vol</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Jours</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDossiers.map(dossier => {
                  const daysUntil = calculateDaysUntilETA(dossier.eta)
                  const StatusIcon = STATUT_CONFIG[dossier.statut].icon
                  return (
                    <TableRow key={dossier.id}>
                      <TableCell className="font-medium">{dossier.numero}</TableCell>
                      <TableCell>{dossier.client}</TableCell>
                      <TableCell>
                        {dossier.type === 'maritime' ? (
                          <Ship className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Plane className="h-5 w-5 text-sky-600" />
                        )}
                      </TableCell>
                      <TableCell>{dossier.navire || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(dossier.eta).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={daysUntil <= 1 ? 'destructive' : daysUntil <= 3 ? 'default' : 'secondary'}
                        >
                          {daysUntil > 0 ? `J-${daysUntil}` : daysUntil === 0 ? "Aujourd'hui" : 'Passé'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{dossier.documents.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                            STATUT_CONFIG[dossier.statut].color
                          }`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {STATUT_CONFIG[dossier.statut].label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={dossier.statut}
                          onValueChange={(v: Dossier['statut']) => updateStatus(dossier.id, v)}
                        >
                          <SelectTrigger className="h-8 w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pret">Prêt</SelectItem>
                            <SelectItem value="attente">En attente</SelectItem>
                            <SelectItem value="alerte">Alerte</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
