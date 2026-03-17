'use client'

import type { Dossier, Tracking, Produit, Message, Notification, User } from './types'

const STORAGE_KEYS = {
  dossiers: 'karamel_dossiers',
  tracking: 'karamel_tracking',
  produits: 'karamel_produits',
  messages: 'karamel_messages',
  notifications: 'karamel_notifications',
  user: 'karamel_user',
}

// Helpers for localStorage
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

// Dossiers
export function getDossiers(): Dossier[] {
  return getItem<Dossier[]>(STORAGE_KEYS.dossiers, [])
}

export function saveDossier(dossier: Dossier): void {
  const dossiers = getDossiers()
  const index = dossiers.findIndex(d => d.id === dossier.id)
  if (index >= 0) {
    dossiers[index] = dossier
  } else {
    dossiers.push(dossier)
  }
  setItem(STORAGE_KEYS.dossiers, dossiers)
}

export function deleteDossier(id: string): void {
  const dossiers = getDossiers().filter(d => d.id !== id)
  setItem(STORAGE_KEYS.dossiers, dossiers)
}

// Tracking
export function getTracking(): Tracking[] {
  return getItem<Tracking[]>(STORAGE_KEYS.tracking, [])
}

export function saveTracking(tracking: Tracking): void {
  const items = getTracking()
  const index = items.findIndex(t => t.id === tracking.id)
  if (index >= 0) {
    items[index] = tracking
  } else {
    items.push(tracking)
  }
  setItem(STORAGE_KEYS.tracking, items)
}

export function deleteTracking(id: string): void {
  const items = getTracking().filter(t => t.id !== id)
  setItem(STORAGE_KEYS.tracking, items)
}

// Produits
export function getProduits(): Produit[] {
  return getItem<Produit[]>(STORAGE_KEYS.produits, [])
}

export function saveProduit(produit: Produit): void {
  const produits = getProduits()
  const index = produits.findIndex(p => p.id === produit.id)
  if (index >= 0) {
    produits[index] = produit
  } else {
    produits.push(produit)
  }
  setItem(STORAGE_KEYS.produits, produits)
}

export function deleteProduit(id: string): void {
  const produits = getProduits().filter(p => p.id !== id)
  setItem(STORAGE_KEYS.produits, produits)
}

// Messages IA
export function getMessages(): Message[] {
  return getItem<Message[]>(STORAGE_KEYS.messages, [])
}

export function saveMessage(message: Message): void {
  const messages = getMessages()
  messages.push(message)
  setItem(STORAGE_KEYS.messages, messages)
}

export function clearMessages(): void {
  setItem(STORAGE_KEYS.messages, [])
}

// Notifications
export function getNotifications(): Notification[] {
  return getItem<Notification[]>(STORAGE_KEYS.notifications, [])
}

export function addNotification(notification: Notification): void {
  const notifications = getNotifications()
  notifications.unshift(notification)
  setItem(STORAGE_KEYS.notifications, notifications)
}

export function markNotificationRead(id: string): void {
  const notifications = getNotifications().map(n =>
    n.id === id ? { ...n, read: true } : n
  )
  setItem(STORAGE_KEYS.notifications, notifications)
}

export function clearNotifications(): void {
  setItem(STORAGE_KEYS.notifications, [])
}

// User
export function getUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.user, null)
}

export function saveUser(user: User): void {
  setItem(STORAGE_KEYS.user, user)
}

export function logout(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.user)
}

// Sample data for demo
export function initSampleData(): void {
  if (getDossiers().length === 0) {
    const sampleDossiers: Dossier[] = [
      {
        id: '1',
        numero: 'DOS-2026-001',
        client: 'SARL Pacific Import',
        statut: 'pret',
        documents: ['Facture', 'BL', 'Packing List'],
        eta: '2026-03-20',
        navire: 'ARANUI 5',
        bl: 'BL-PPT-2026-1234',
        type: 'maritime',
        createdAt: '2026-03-10',
        updatedAt: '2026-03-15',
      },
      {
        id: '2',
        numero: 'DOS-2026-002',
        client: 'Tahiti Import SARL',
        statut: 'attente',
        documents: ['Facture'],
        eta: '2026-03-22',
        navire: 'TAPORO IX',
        bl: 'BL-PPT-2026-1235',
        type: 'maritime',
        createdAt: '2026-03-12',
        updatedAt: '2026-03-14',
      },
      {
        id: '3',
        numero: 'DOS-2026-003',
        client: 'Moorea Distribution',
        statut: 'alerte',
        documents: ['LTA'],
        eta: '2026-03-18',
        vol: 'TN102',
        type: 'aerien',
        createdAt: '2026-03-15',
        updatedAt: '2026-03-16',
      },
    ]
    setItem(STORAGE_KEYS.dossiers, sampleDossiers)
  }

  if (getTracking().length === 0) {
    const sampleTracking: Tracking[] = [
      {
        id: '1',
        type: 'maritime',
        reference: 'BL-PPT-2026-1234',
        navire: 'ARANUI 5',
        compagnie: 'Aranui Cruises',
        eta: '2026-03-20',
        position: 'En mer - 150km de Papeete',
        statut: 'en_route',
        conteneurs: ['MSCU1234567', 'MSCU1234568'],
      },
      {
        id: '2',
        type: 'maritime',
        reference: 'BL-PPT-2026-1235',
        navire: 'TAPORO IX',
        compagnie: 'SNC Taporo',
        eta: '2026-03-22',
        position: 'Quai 3 - Port de Papeete',
        statut: 'arrive',
        conteneurs: ['TCLU9876543'],
      },
      {
        id: '3',
        type: 'aerien',
        reference: 'LTA-PPT-2026-789',
        vol: 'TN102',
        compagnie: 'Air Tahiti Nui',
        eta: '2026-03-18',
        position: 'LAX - En escale',
        statut: 'en_route',
        poids: '450 kg',
      },
    ]
    setItem(STORAGE_KEYS.tracking, sampleTracking)
  }

  if (getNotifications().length === 0) {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'eta',
        title: 'ARANUI 5 - Arrivée prévue',
        message: 'Le navire ARANUI 5 arrivera dans 3 jours au port de Papeete.',
        read: false,
        createdAt: '2026-03-17T08:00:00',
      },
      {
        id: '2',
        type: 'reglementation',
        title: 'Nouvelle circulaire DGAE',
        message: 'Publication d\'une nouvelle circulaire sur les produits alimentaires.',
        read: false,
        createdAt: '2026-03-16T14:30:00',
        link: 'https://lexpol.cloud.pf',
      },
    ]
    setItem(STORAGE_KEYS.notifications, sampleNotifications)
  }
}
