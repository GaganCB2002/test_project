import { db } from './db.service'
import { notificationService } from './notification.service'
import type { InternalEmail } from '../data/types'

export const mailService = {
  getInbox(userId: string) {
    return db.get().emails.filter(m => m.receiverId === userId || m.senderId === userId)
  },

  sendMail(email: Omit<InternalEmail, 'id' | 'timestamp' | 'read' | 'folder'>) {
    const newMail: InternalEmail = {
      ...email,
      id: `mail-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
      folder: 'sent'
    }

    db.update((data) => {
      data.emails.unshift(newMail)
    })

    // Trigger Notification for recipient
    notificationService.notify(newMail.receiverId, {
      type: 'email',
      priority: 'high',
      title: `New Email: ${newMail.subject}`,
      content: `From: ${newMail.senderName}`,
      link: '/mail'
    })

    return newMail
  },

  deleteMail(id: string) {
    db.update((data) => {
      const mail = data.emails.find(m => m.id === id)
      if (mail) mail.folder = 'trash'
    })
  }
}
