import { ChevronDown, ChevronRight, LoaderCircle, MapPin, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { HierarchyNode } from '../types'

interface HierarchyExplorerProps {
  token: string
}

export function HierarchyExplorer({ token }: HierarchyExplorerProps) {
  const [root, setRoot] = useState<HierarchyNode | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [children, setChildren] = useState<Record<string, HierarchyNode[]>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    api.getHierarchyRoot(token).then(setRoot)
  }, [token])

  const toggleNode = async (node: HierarchyNode) => {
    if (expanded[node.id]) {
      setExpanded((current) => ({ ...current, [node.id]: false }))
      return
    }

    setExpanded((current) => ({ ...current, [node.id]: true }))

    if (children[node.id] || node.reportCount === 0) {
      return
    }

    setLoading((current) => ({ ...current, [node.id]: true }))

    try {
      const result = await api.getHierarchyChildren(node.id, token)
      setChildren((current) => ({ ...current, [node.id]: result }))
    } finally {
      setLoading((current) => ({ ...current, [node.id]: false }))
    }
  }

  const renderNode = (node: HierarchyNode, depth = 0) => {
    const nodeChildren = children[node.id] ?? []
    const isExpanded = expanded[node.id]
    const isLoading = loading[node.id]

    return (
      <div key={node.id} className={depth > 0 ? 'org-connector mt-4 pl-6' : ''}>
        <button
          type="button"
          onClick={() => toggleNode(node)}
          className="w-full rounded-[24px] border border-slate-200 bg-white p-5 text-left transition hover:border-brand/40 hover:shadow-lg"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                {node.reportCount > 0 ? (
                  isExpanded ? <ChevronDown className="h-4 w-4 text-brand" /> : <ChevronRight className="h-4 w-4 text-brand" />
                ) : (
                  <span className="h-4 w-4 rounded-full bg-slate-200" />
                )}
                <p className="font-display text-xl font-bold text-slate-900">{node.name}</p>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500">{node.title}</p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{node.level}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{node.department}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4" />
              {node.reportCount} direct reports
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {node.location}
            </span>
          </div>
        </button>

        {isExpanded ? (
          <div className="mt-4">
            {isLoading ? (
              <div className="flex items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-500">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading next layer...
              </div>
            ) : null}
            {nodeChildren.map((child) => renderNode(child, depth + 1))}
          </div>
        ) : null}
      </div>
    )
  }

  return root ? renderNode(root) : <div className="text-sm text-slate-500">Loading organization hierarchy...</div>
}
