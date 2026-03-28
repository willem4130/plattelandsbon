import { Business } from '../entities/Business'
import { BusinessStatus } from '../value-objects/BusinessStatus'

export interface IBusinessRepository {
  findById(id: string): Promise<Business | null>
  findByUserId(userId: string): Promise<Business | null>
  findByStatus(status: BusinessStatus): Promise<Business[]>
  findAll(): Promise<Business[]>
  create(data: {
    userId: string
    name: string
    description?: string
    address?: string
    city?: string
    postalCode?: string
    province?: string
    phone?: string
    website?: string
    categoryIds: string[]
  }): Promise<Business>
  updateStatus(
    id: string,
    status: BusinessStatus,
    notes?: string,
  ): Promise<Business>
}
