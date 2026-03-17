'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Upload, Bot, User, ExternalLink, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getMessages, saveMessage, getProduits, saveProduit } from '@/lib/store'
import type { Message, Produit } from '@/lib/types'

const SOURCES = [
  { name: 'TAPAS 2026', url: 'https://service-public.pf/douane' },
  { name: 'LEXPOL', url: 'https://lexpol.cloud.pf' },
  { name: 'DGAE', url: 'https://service-public.pf/dgae' },
  { name: 'Biosécurité', url: 'https://service-public.pf/biosecurite' },
  { name: 'NESH', url: 'https://service-public.pf/douane' },
]

// Simulated AI responses for demo
function getAIResponse(question: string): { content: string; sources: string[] } {
  const lowerQ = question.toLowerCase()
  
  if (lowerQ.includes('chocolat') || lowerQ.includes('cacao')) {
    return {
      content: `**Code SH: 1806.32.00** - Chocolat et autres préparations alimentaires contenant du cacao

**Classification:**
- Chapitre 18: Cacao et ses préparations
- Position 1806: Chocolat et autres préparations alimentaires contenant du cacao
- Sous-position 1806.32: En tablettes, barres ou bâtons, fourrés

**Notes de chapitre:**
- Note 1: Ce chapitre ne comprend pas les préparations des n° 0403, 1901, 1904, 1905, 2105, 2202, 2208, 3003 ou 3004.
- Note 2: La position 1806 comprend les sucreries contenant du cacao et les autres préparations alimentaires contenant du cacao.

**Réglementation applicable:**
- DGAE: Contrôle sanitaire des produits alimentaires
- Biosécurité: Pas de restriction particulière si produit transformé

**Droits et taxes (TAPAS 2026):**
- Droit de douane: 10%
- TVA: 16%`,
      sources: ['TAPAS 2026', 'DGAE', 'Biosécurité'],
    }
  }
  
  if (lowerQ.includes('voiture') || lowerQ.includes('véhicule') || lowerQ.includes('automobile')) {
    return {
      content: `**Code SH: 8703.23.90** - Voitures de tourisme et autres véhicules automobiles

**Classification:**
- Chapitre 87: Véhicules automobiles, tracteurs, cycles et autres véhicules terrestres
- Position 8703: Voitures de tourisme et autres véhicules automobiles principalement conçus pour le transport de personnes
- Sous-position 8703.23: Cylindrée > 1500 cm³ mais ≤ 3000 cm³

**Notes de chapitre:**
- Note 2: On entend par "tracteurs" les véhicules à moteur essentiellement destinés à tirer ou pousser d'autres engins.
- Note 3: Les châssis comportant une cabine relèvent des positions 8702 à 8704.

**Réglementation applicable:**
- DGAE: Homologation véhicule requise
- Douane: Certificat de conformité, contrôle technique
- Documents requis: Facture, certificat d'origine, certificat de conformité

**Droits et taxes (TAPAS 2026):**
- Droit de douane: 17%
- Taxe de mise en circulation: selon puissance
- TVA: 16%`,
      sources: ['TAPAS 2026', 'DGAE', 'Douane PF'],
    }
  }
  
  if (lowerQ.includes('téléphone') || lowerQ.includes('smartphone') || lowerQ.includes('iphone')) {
    return {
      content: `**Code SH: 8517.13.00** - Téléphones portables (téléphones pour réseaux cellulaires)

**Classification:**
- Chapitre 85: Machines, appareils et matériels électriques
- Position 8517: Appareils électriques pour la téléphonie ou la télégraphie
- Sous-position 8517.13: Smartphones et téléphones portables

**Notes de section:**
- Note 3 du Chapitre 85: Les machines à fonctions multiples sont classées selon leur fonction principale.

**Réglementation applicable:**
- ANFR: Conformité des équipements radioélectriques
- DGAE: Garantie légale, information consommateur
- Pas de restriction Biosécurité

**Droits et taxes (TAPAS 2026):**
- Droit de douane: 0% (accord de libre-échange)
- TVA: 16%
- Éco-participation: applicable`,
      sources: ['TAPAS 2026', 'ANFR', 'DGAE'],
    }
  }

  // Default response
  return {
    content: `Je comprends votre demande concernant "${question}".

Pour vous fournir le code SH exact, j'aurais besoin de plus de détails sur:
- La nature exacte du produit
- Sa composition/matériaux
- Son utilisation prévue
- Son conditionnement

**Sources disponibles pour la recherche:**
- TAPAS 2026 (nomenclature douanière PF)
- LEXPOL (législation locale)
- NESH (notes explicatives du SH)
- Réglementations DGAE, Biosécurité, ARASS

N'hésitez pas à me donner plus de précisions ou à importer une facture pour analyse.`,
    sources: ['TAPAS 2026', 'LEXPOL'],
  }
}

export function IAChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = getMessages()
    if (stored.length > 0) {
      setMessages(stored)
    } else {
      // Welcome message
      const welcome: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Ia ora na! Je suis l'assistant IA de KARAMEL SH.

Je peux vous aider à:
- **Trouver le code SH** d'un produit
- **Expliquer les règles de classement** avec les notes de chapitre et NESH
- **Identifier les réglementations** applicables (DGAE, Biosécurité, ARASS, Douane)
- **Analyser vos factures** pour classification automatique

Posez-moi votre question ou importez un document pour commencer.`,
        timestamp: new Date().toISOString(),
        sources: ['TAPAS 2026', 'LEXPOL', 'NESH'],
      }
      setMessages([welcome])
    }
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages(prev => [...prev, userMessage])
    saveMessage(userMessage)
    setInput('')
    setIsLoading(true)

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    const response = getAIResponse(input)
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date().toISOString(),
      sources: response.sources,
    }

    setMessages(prev => [...prev, assistantMessage])
    saveMessage(assistantMessage)
    setIsLoading(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: `[Document importé: ${file.name}]`,
        timestamp: new Date().toISOString(),
      }
      setMessages(prev => [...prev, userMessage])
      saveMessage(userMessage)

      // Simulate analysis
      setIsLoading(true)
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `J'ai analysé le document **${file.name}**.

**Produits identifiés:**
1. Articles textiles - Code SH: 6204.62.00
2. Accessoires - Code SH: 4202.22.00

**Réglementations:**
- Étiquetage obligatoire (composition, origine)
- Contrôle DGAE applicable

Voulez-vous que je détaille le classement d'un produit spécifique?`,
          timestamp: new Date().toISOString(),
          sources: ['TAPAS 2026', 'DGAE'],
        }
        setMessages(prev => [...prev, assistantMessage])
        saveMessage(assistantMessage)
        setIsLoading(false)
      }, 2000)
    }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      {/* Sources bar */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SOURCES.map(source => (
          <a
            key={source.name}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            {source.name}
            <ExternalLink className="h-3 w-3" />
          </a>
        ))}
      </div>

      {/* Messages */}
      <Card className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {message.content.split('**').map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i}>{part}</strong>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </div>
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.sources.map(source => (
                        <Badge key={source} variant="outline" className="text-xs">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Analyse en cours...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf,.xls,.xlsx,.jpg,.jpeg,.png"
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Posez votre question sur un code SH, un produit..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
