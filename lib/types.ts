// Types pour KARAMEL SH

export interface Dossier {
  id: string
  numero: string
  client: string
  statut: 'pret' | 'attente' | 'alerte'
  documents: string[]
  eta: string
  navire?: string
  bl?: string
  type: 'maritime' | 'aerien'
  createdAt: string
  updatedAt: string
}

export interface Tracking {
  id: string
  type: 'maritime' | 'aerien'
  reference: string // BL ou LTA
  navire?: string
  vol?: string
  compagnie: string
  eta: string
  position?: string
  statut: 'en_route' | 'arrive' | 'decharge' | 'livrer'
  poids?: string
  conteneurs?: string[]
}

export interface Produit {
  id: string
  designation: string
  codeSH: string
  motsCles: string[]
  notes?: string
  source: string
  validated: boolean
  createdAt: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sources?: string[]
}

export interface Notification {
  id: string
  type: 'eta' | 'alerte' | 'info' | 'reglementation'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}

export interface TaxCalculation {
  devise: string
  tauxChange: number
  valeurFOB: number
  fret: number
  assurance: number
  valeurCAF: number
  codeSH: string
  tauxDroit: number
  droitDouane: number
  tva: number
  total: number
}

export interface User {
  id: string
  email?: string
  phone?: string
  name: string
  isAdmin: boolean
  createdAt: string
}
