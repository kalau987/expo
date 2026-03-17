'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { getNotifications, initSampleData } from '@/lib/store'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    initSampleData()
    const notifications = getNotifications()
    setNotificationCount(notifications.filter(n => !n.read).length)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        notificationCount={notificationCount}
      />

      <div className="lg:pl-64">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
          notificationCount={notificationCount}
        />

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
