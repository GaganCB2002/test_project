import { db } from './db.service'
import { io } from '../server'
import { notificationService } from './notification.service'
import type { ChatMessage } from '../data/types'

export const chatService = {
  getMessages(userId: string, otherId?: string, groupId?: string) {
    return db.get().messages.filter(m => {
      if (groupId) return m.groupId === groupId
      if (otherId) {
        return (m.senderId === userId && m.receiverId === otherId) || 
               (m.senderId === otherId && m.receiverId === userId)
      }
      return false
    })
  },

  sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>) {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    }

    db.update((data) => {
      data.messages.push(newMessage)
    })

    // Emit to specific receiver or group
    if (newMessage.groupId) {
      io.to(newMessage.groupId).emit('new_message', newMessage)
    } else if (newMessage.receiverId) {
      io.emit(`new_message_${newMessage.receiverId}`, newMessage)
      io.emit(`new_message_${newMessage.senderId}`, newMessage)
      
      // Trigger Notification
      notificationService.notify(newMessage.receiverId, {
        type: 'message',
        priority: 'medium',
        title: `New message from ${newMessage.senderName || 'User'}`,
        content: newMessage.content.substring(0, 50),
        link: '/chat'
      })
    }

    return newMessage
  }
}
