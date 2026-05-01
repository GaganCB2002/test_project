import { db } from './db.service'
import { io } from '../server'

export type NotificationType = 'message' | 'email' | 'meeting' | 'system' | 'task'
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical'

export interface AppNotification {
  id: string
  userId: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  content: string
  link?: string
  read: boolean
  timestamp: string
  metadata?: any
}

export const notificationService = {
  getNotifications(userId: string) {
    return db.get().notifications.filter(n => n.userId === userId)
  },

  async notify(userId: string, data: Omit<AppNotification, 'id' | 'timestamp' | 'read' | 'userId'>) {
    const notification: AppNotification = {
      ...data,
      id: `ntf-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId,
      read: false,
      timestamp: new Date().toISOString()
    }

    db.update((data) => {
      data.notifications.unshift(notification)
      // Keep only last 100
      if (data.notifications.length > 1000) data.notifications.pop()
    })

    // 1. Real-time Socket Push
    io.emit(`notification_${userId}`, notification)

    // 2. Mock Email Push if High/Critical
    if (notification.priority === 'high' || notification.priority === 'critical') {
       console.log(`[EMAIL ALERT] To: ${userId} | Subject: ${notification.title}`)
    }

    return notification
  },

  markAsRead(id: string) {
    db.update((data) => {
      const ntf = data.notifications.find(n => n.id === id)
      if (ntf) ntf.read = true
    })
  },

  markAllRead(userId: string) {
    db.update((data) => {
      data.notifications.forEach(n => {
        if (n.userId === userId) n.read = true
      })
    })
  }
}
