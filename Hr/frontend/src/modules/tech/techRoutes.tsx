import React from 'react'
import { Route } from 'react-router-dom'
import { TechDashboard } from './TechDashboard'
import { ProjectsPage } from '../../pages/ModulePages'
import ProjectDetails from '../../pages/ProjectDetails'

export const techRoutes = (user: any, token: string) => [
  <Route key="tech-dash" path="/tech/dashboard" element={<TechDashboard user={user} />} />,
  <Route key="tech-projects" path="/tech/projects" element={<ProjectsPage token={token} />} />,
  <Route key="tech-project-details" path="/tech/projects/:id" element={<ProjectDetails token={token} user={user} />} />
]
