import React from 'react'
import { Route } from 'react-router-dom'
import { HRDashboard } from './HRDashboard'
import HRLeavePortal from '../../pages/HRLeavePortal'
import { HumanResourcesPage } from '../../pages/HumanResourcesPage'
import { RecruitmentPage } from '../../pages/RecruitmentPage'
import { AllocationPage } from '../../pages/AllocationPage'
import { PayrollPage } from '../../pages/PayrollPage'

export const hrRoutes = (user: any, platform: any, feed: any, token: string, refresh: any) => [
  <Route key="hr-dash" path="/hr/dashboard" element={<HRDashboard data={platform?.dashboard} feed={feed} onRefresh={refresh} />} />,
  <Route key="hr-leave" path="/hr/leave" element={<HRLeavePortal token={token} />} />,
  <Route key="hr-recruitment" path="/hr/recruitment" element={<RecruitmentPage platform={platform} token={token} role={user.role} onRefresh={refresh} />} />,
  <Route key="hr-allocation" path="/hr/allocation" element={<AllocationPage platform={platform} token={token} onRefresh={refresh} />} />,
  <Route key="hr-payroll" path="/hr/payroll" element={<PayrollPage platform={platform} token={token} onRefresh={refresh} />} />
]
