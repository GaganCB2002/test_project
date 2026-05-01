import { db } from './db.service'
import { io } from '../server'
import type { ActivityItem } from '../data/types'
import { v4 as uuidv4 } from 'uuid'

export const activityService = {
  log(activity: Omit<ActivityItem, 'id' | 'timestamp'>, metadata?: { ip?: string; device?: string; location?: string }) {
    const item: ActivityItem = {
      ...activity,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString()
    }

    if (metadata) {
      item.detail = `${item.detail} | Device: ${metadata.device || 'Unknown'} | IP: ${metadata.ip || '127.0.0.1'} | Location: ${metadata.location || 'Local Node'}`
    }

    db.update((data) => {
      data.activities.unshift(item)
      if (data.activities.length > 200) {
        data.activities.pop()
      }
    })

    io.emit('new_activity', item)
    return item
  }
}
