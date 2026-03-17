'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  ExternalLink,
  Globe,
  FileText,
  Scale,
  Shield,
  Building,
  Leaf,
  BookOpen,
} from 'lucide-react'

const SITES_OFFICIELS = [
  {
    name: 'Direction des Douanes PF',
    url: 'https://service-public.pf/douane',
    description: 'Site officiel de la Direction des Douanes de Polynésie Française',
    icon: Building,
    category: 'douane',
  },
  {
    name: 'LEXPOL',
    url: 'https://lexpol.cloud.pf',
    description: 'Législation de la Polynésie Française',
    icon: Scale,
    category: 'legislation',
  },
  {
    name: 'DGAE',
    url: 'https://service-public.pf/dgae',
    description: 'Direction Générale des Affaires Économiques',
    icon: Building,
    category: 'reglementation',
  },
  {
    name: 'Biosécurité PF',
    url: 'https://service-public.pf/biosecurite',
    description: 'Service de la Biosécurité de Polynésie Française',
    icon: Leaf,
    category: 'reglementation',
  },
  {
    name: 'ARASS',
    url: 'https://service-public.pf/arass',
    description: 'Agence de Régulation de l\'Action Sanitaire et Sociale',
    icon: Shield,
    category: 'reglementation',
  },
  {
    name: 'JOUE - EUR-Lex',
    url: 'https://eur-lex.europa.eu',
    description: 'Journal Officiel de l\'Union Européenne',
    icon: BookOpen,
    category: 'europe',
  },
  {
    name: 'WCO - OMD',
    url: 'https://www.wcoomd.org',
    description: 'Organisation Mondiale des Douanes - Système Harmonisé',
    icon: Globe,
    category: 'international',
  },
  {
    name: 'ANFR',
    url: 'https://www.anfr.fr',
    description: 'Agence Nationale des Fréquences (équipements radio)',
    icon: Shield,
    category: 'reglementation',
  },
]

const RECHERCHES_RAPIDES = [
  { label: 'TAPAS 2026', query: 'TAPAS nomenclature douanière Polynésie 2026' },
  { label: 'Notes explicatives SH', query: 'NESH notes explicatives système harmonisé' },
  { label: 'Circulaires douane', query: 'circulaires douane Polynésie française' },
  { label: 'Franchise douanière', query: 'franchise douanière Polynésie importation' },
  { label: 'Produits prohibés', query: 'produits prohibés importation Polynésie' },
  { label: 'Biosécurité végétaux', query: 'biosécurité importation végétaux Polynésie' },
]

export default function RecherchePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredSites = SITES_OFFICIELS.filter(
    site => activeCategory === 'all' || site.category === activeCategory
  )

  const handleSearch = (query: string) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' site:pf OR site:gouv.fr')}`
    window.open(searchUrl, '_blank')
  }

  const handleSiteSearch = (siteUrl: string, query: string) => {
    const domain = new URL(siteUrl).hostname
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' site:' + domain)}`
    window.open(searchUrl, '_blank')
  }

  return (
    <DashboardLayout title="Recherche Web">
      <div className="space-y-6">
        {/* Search bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch(searchQuery)}
                  placeholder="Rechercher sur les sites officiels douaniers..."
                  className="h-12 pl-12 text-lg"
                />
              </div>
              <Button
                size="lg"
                className="h-12"
                onClick={() => handleSearch(searchQuery)}
                disabled={!searchQuery.trim()}
              >
                <Search className="mr-2 h-5 w-5" />
                Rechercher
              </Button>
            </div>

            {/* Quick searches */}
            <div className="mt-4">
              <p className="mb-2 text-sm text-muted-foreground">Recherches rapides:</p>
              <div className="flex flex-wrap gap-2">
                {RECHERCHES_RAPIDES.map(item => (
                  <Button
                    key={item.label}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSearch(item.query)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sites officiels */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Sites officiels</h2>

          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="douane">Douane</TabsTrigger>
              <TabsTrigger value="legislation">Législation</TabsTrigger>
              <TabsTrigger value="reglementation">Réglementation</TabsTrigger>
              <TabsTrigger value="europe">Europe</TabsTrigger>
              <TabsTrigger value="international">International</TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory} className="mt-0">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSites.map(site => (
                  <Card key={site.name} className="transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <site.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{site.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {site.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visiter
                          </Button>
                        </a>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            const query = prompt('Rechercher sur ce site:')
                            if (query) handleSiteSearch(site.url, query)
                          }}
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Info cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-5 w-5" />
                Textes de référence
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>
                  <strong>TAPAS 2026</strong> - Tarif des Douanes de Polynésie Française
                </li>
                <li>
                  <strong>NESH</strong> - Notes Explicatives du Système Harmonisé
                </li>
                <li>
                  <strong>RGI</strong> - Règles Générales d'Interprétation
                </li>
                <li>
                  <strong>Code des douanes</strong> - Législation douanière PF
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-5 w-5" />
                Réglementations principales
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>
                  <strong>DGAE</strong> - Autorisations commerciales, étiquetage
                </li>
                <li>
                  <strong>Biosécurité</strong> - Contrôle sanitaire et phytosanitaire
                </li>
                <li>
                  <strong>ARASS</strong> - Produits de santé, médicaments
                </li>
                <li>
                  <strong>ANFR</strong> - Équipements radioélectriques
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
