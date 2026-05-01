import React from 'react'
import { Route } from 'react-router-dom'
import { EmployeeDashboard } from './EmployeeDashboard'
import LeaveDashboard from '../../pages/LeaveDashboard'
import ApplyLeave from '../../pages/ApplyLeave'

export const employeeRoutes = (user: any, platform: any, token: string) => [
  <Route key="emp-dash" path="/employee/dashboard" element={<EmployeeDashboard platform={platform} user={user} token={token} />} />,
  <Route key="emp-leave" path="/employee/leave" element={<LeaveDashboard user={user} token={token} />} />,
  <Route key="emp-leave-apply" path="/employee/leave/apply" element={<ApplyLeave user={user} token={token} />} />
]
