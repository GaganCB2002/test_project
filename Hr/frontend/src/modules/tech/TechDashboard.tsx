import React from 'react'
import { TechLeadDashboard } from '../../pages/TechLeadDashboard'
import type { User } from '../../types'

export function TechDashboard({ user }: { user: User }) {
  return <TechLeadDashboard user={user} />
}
