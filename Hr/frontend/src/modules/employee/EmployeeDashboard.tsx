import React from 'react'
import { EmployeeDashboardPage } from '../../pages/EmployeeDashboardPage'
import type { PlatformData, User } from '../../types'

export function EmployeeDashboard({ platform, user, token }: { platform: any, user: User, token: string }) {
  return <EmployeeDashboardPage platform={platform} user={user} token={token} />
}
