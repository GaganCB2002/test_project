import { db } from './db.service'
import { activityService } from './activity.service'
import { io } from '../server'
import type { ResourceAllocation, Asset, AssetAllocation } from '../data/types'

export const allocationService = {
  getAll() {
    return db.get().allocations
  },

  create(allocation: Omit<ResourceAllocation, 'id'>) {
    const newAllocation: ResourceAllocation = {
      ...allocation,
      id: `all-${Date.now()}`
    }

    db.update((data) => {
      data.allocations.push(newAllocation)
    })

    activityService.log({
      title: 'Resource Allocated',
      detail: `${allocation.employeeName} assigned to ${allocation.projectName} (${allocation.hoursPerWeek}h/week)`,
      category: 'Project',
      actor: 'System'
    })

    io.emit('allocation_updated', newAllocation)
    return newAllocation
  },

  update(id: string, updates: Partial<ResourceAllocation>) {
    let updated: ResourceAllocation | null = null
    db.update((data) => {
      const index = data.allocations.findIndex(a => a.id === id)
      if (index !== -1) {
        data.allocations[index] = { ...data.allocations[index], ...updates }
        updated = data.allocations[index]
      }
    })

    if (updated) {
      io.emit('allocation_updated', updated)
    }
    return updated
  },

  delete(id: string) {
    db.update((data) => {
      data.allocations = data.allocations.filter(a => a.id !== id)
    })
    io.emit('allocation_deleted', id)
  },

  // Asset Management
  getAssets() {
    return db.get().assets
  },

  getAssetAllocations() {
    return db.get().assetAllocations
  },

  addAsset(asset: Omit<Asset, 'id'>) {
    const newAsset: Asset = {
      ...asset,
      id: `as-${Date.now()}`
    }
    db.update((data) => {
      data.assets.push(newAsset)
    })
    return newAsset
  },

  allocateAsset(input: Omit<AssetAllocation, 'id' | 'status' | 'allocatedAt'>) {
    const allocation: AssetAllocation = {
      ...input,
      id: `al-${Date.now()}`,
      status: 'Active',
      allocatedAt: new Date().toISOString()
    }

    db.update((data) => {
      data.assetAllocations.push(allocation)
      const asset = data.assets.find(a => a.id === input.assetId)
      if (asset) asset.status = 'Allocated'
    })

    activityService.log({
      title: 'Asset Allocated',
      detail: `${input.assetName} handed over to ${input.employeeName}`,
      category: 'System',
      actor: 'Admin'
    })

    io.emit('asset_allocation_updated', allocation)
    return allocation
  },

  revokeAsset(id: string) {
    let affectedAssetId: string | null = null
    db.update((data) => {
      const index = data.assetAllocations.findIndex(a => a.id === id)
      if (index !== -1) {
        data.assetAllocations[index].status = 'Revoked'
        data.assetAllocations[index].returnedAt = new Date().toISOString()
        affectedAssetId = data.assetAllocations[index].assetId
        
        const asset = data.assets.find(a => a.id === affectedAssetId)
        if (asset) asset.status = 'Available'
      }
    })

    if (affectedAssetId) {
      io.emit('asset_allocation_revoked', id)
    }
  }
}
