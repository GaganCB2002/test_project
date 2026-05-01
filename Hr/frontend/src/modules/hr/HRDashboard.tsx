import React from 'react'
import { DashboardPage } from '../../pages/DashboardPage'
import type { PlatformData, ActivityItem } from '../../types'

export function HRDashboard({ data, feed, onRefresh }: { data: any, feed: ActivityItem[], onRefresh: () => Promise<void> }) {
  return (
    <div className="hr-module-container">
      <DashboardPage data={data} feed={feed} onRefresh={onRefresh} />
    </div>
  )
}
