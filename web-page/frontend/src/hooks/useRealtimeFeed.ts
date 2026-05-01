import { useEffect, useEffectEvent } from 'react'
import { API_URL } from '../api/client'
import type { ActivityItem } from '../types'

export function useRealtimeFeed(token: string | null, onEvent: (item: ActivityItem) => void) {
  const handleEvent = useEffectEvent((payload: string) => {
    const item = JSON.parse(payload) as ActivityItem
    onEvent(item)
  })

  useEffect(() => {
    if (!token) {
      return
    }

    const source = new EventSource(`${API_URL}/api/events?token=${encodeURIComponent(token)}`)
    source.onmessage = (event) => handleEvent(event.data)

    return () => source.close()
  }, [token, handleEvent])
}
