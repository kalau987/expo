'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Ship,
  Plane,
  Search,
  Plus,
  MapPin,
  Calendar,
  Package,
  ExternalLink,
  Anchor,
} from 'lucide-react'
import { getTracking, saveTracking } from '@/lib/store'
import type { Tracking } from '@/lib/types'

const STATUT_LABELS = {
  en_route: { label: 'En route', color: 'bg-blue-100 text-blue-700' },
  arrive: { label: 'Arrivé', color: 'bg-green-100 text-green-700' },
  decharge: { label: 'Déchargé', color: 'bg-orange-100 text-orange-700' },
  livrer: { label: 'Livré', color: 'bg-gray-100 text-gray-700' },
}

export default function TrackingPage() {
  const [items, setItems] = useState<Tracking[]>([])
  const [filter, setFilter] = useState<'all' | 'maritime' | 'aerien'>('all')
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newItem, setNewItem] = useState<Partial<Tracking>>({
    type: 'maritime',
    statut: 'en_route',
  })

  useEffect(() => {
    setItems(getTracking())
  }, [])

  const filteredItems = items.filter(item => {
    const matchesType = filter === 'all' || item.type === filter
    const matchesSearch =
      search === '' ||
      item.reference.toLowerCase().includes(search.toLowerCase()) ||
      item.navire?.toLowerCase().includes(search.toLowerCase()) ||
      item.vol?.toLowerCase().includes(search.toLowerCase()) ||
      item.compagnie.toLowerCase().includes(search.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleAddItem = () => {
    if (!newItem.reference || !newItem.compagnie || !newItem.eta) return

    const item: Tracking = {
      id: Date.now().toString(),
      type: newItem.type as 'maritime' | 'aerien',
      reference: newItem.reference,
      navire: newItem.navire,
      vol: newItem.vol,
      compagnie: newItem.compagnie,
      eta: newItem.eta,
      position: newItem.position,
      statut: newItem.statut as Tracking['statut'],
      poids: newItem.poids,
      conteneurs: newItem.conteneurs,
    }

    saveTracking(item)
    setItems(getTracking())
    setIsAddOpen(false)
    setNewItem({ type: 'maritime', statut: 'en_route' })
  }

  const calculateDaysUntilETA = (eta: string) => {
    const today = new Date()
    const etaDate = new Date(eta)
    const diffTime = etaDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <DashboardLayout title="Tracking Maritime/Aérien">
      <div className="space-y-6">
        {/* Filters and actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher BL, LTA, navire..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={(v: 'all' | 'maritime' | 'aerien') => setFilter(v)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="maritime">Maritime</SelectItem>
                <SelectItem value="aerien">Aérien</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau suivi</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={newItem.type}
                      onValueChange={v => setNewItem({ ...newItem, type: v as 'maritime' | 'aerien' })}
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
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select
                      value={newItem.statut}
                      onValueChange={v => setNewItem({ ...newItem, statut: v as Tracking['statut'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en_route">En route</SelectItem>
                        <SelectItem value="arrive">Arrivé</SelectItem>
                        <SelectItem value="decharge">Déchargé</SelectItem>
                        <SelectItem value="livrer">Livré</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Référence (BL/LTA)</Label>
                  <Input
                    value={newItem.reference || ''}
                    onChange={e => setNewItem({ ...newItem, reference: e.target.value })}
                    placeholder="BL-PPT-2026-XXXX"
                  />
                </div>
                {newItem.type === 'maritime' ? (
                  <div className="space-y-2">
                    <Label>Navire</Label>
                    <Input
                      value={newItem.navire || ''}
                      onChange={e => setNewItem({ ...newItem, navire: e.target.value })}
                      placeholder="Nom du navire"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Vol</Label>
                    <Input
                      value={newItem.vol || ''}
                      onChange={e => setNewItem({ ...newItem, vol: e.target.value })}
                      placeholder="Numéro de vol"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Compagnie</Label>
                  <Input
                    value={newItem.compagnie || ''}
                    onChange={e => setNewItem({ ...newItem, compagnie: e.target.value })}
                    placeholder="Nom de la compagnie"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ETA</Label>
                    <Input
                      type="date"
                      value={newItem.eta || ''}
                      onChange={e => setNewItem({ ...newItem, eta: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Poids</Label>
                    <Input
                      value={newItem.poids || ''}
                      onChange={e => setNewItem({ ...newItem, poids: e.target.value })}
                      placeholder="Ex: 450 kg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={newItem.position || ''}
                    onChange={e => setNewItem({ ...newItem, position: e.target.value })}
                    placeholder="Position actuelle"
                  />
                </div>
                <Button onClick={handleAddItem} className="w-full">
                  Ajouter le suivi
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Ship className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {items.filter(i => i.type === 'maritime').length}
                </p>
                <p className="text-sm text-muted-foreground">Maritime</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
                <Plane className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {items.filter(i => i.type === 'aerien').length}
                </p>
                <p className="text-sm text-muted-foreground">Aérien</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Anchor className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {items.filter(i => i.statut === 'arrive').length}
                </p>
                <p className="text-sm text-muted-foreground">Arrivés</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {items.filter(i => i.statut === 'en_route').length}
                </p>
                <p className="text-sm text-muted-foreground">En route</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Liste</TabsTrigger>
            <TabsTrigger value="map">Carte Port Papeete</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Navire/Vol</TableHead>
                      <TableHead>Compagnie</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Jours</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map(item => {
                      const daysUntil = calculateDaysUntilETA(item.eta)
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.type === 'maritime' ? (
                              <Ship className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Plane className="h-5 w-5 text-sky-600" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{item.reference}</TableCell>
                          <TableCell>{item.navire || item.vol}</TableCell>
                          <TableCell>{item.compagnie}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {new Date(item.eta).toLocaleDateString('fr-FR')}
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
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{item.position || '-'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                STATUT_LABELS[item.statut].color
                              }`}
                            >
                              {STATUT_LABELS[item.statut].label}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Port de Papeete - Temps réel
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="https://www.marinetraffic.com/en/ais/home/centerx:-149.5/centery:-17.5/zoom:12"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        MarineTraffic
                      </Button>
                    </a>
                    <a
                      href="https://www.vesselfinder.com/?imo=0&lat=-17.5&lon=-149.5&zoom=12"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        VesselFinder
                      </Button>
                    </a>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                  <iframe
                    src="https://www.marinetraffic.com/en/ais/embed/zoom:12/centery:-17.537/centerx:-149.566/maptype:1/shownames:true/mmsi:0/shipid:0/fleet:/fleet_id:/vtypes:/showmenu:/remember:false"
                    className="absolute inset-0 h-full w-full"
                    style={{ border: 'none' }}
                    title="Port de Papeete - MarineTraffic"
                  />
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Carte en temps réel du port de Papeete. Cliquez sur un navire pour voir ses détails.
                  Utilisez les liens ci-dessus pour accéder aux sites complets MarineTraffic ou VesselFinder.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
