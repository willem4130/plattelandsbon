import { Business } from '../entities/Business'
import { BusinessStatus } from '../value-objects/BusinessStatus'
import type { TransactionContext, PaginationOptions } from '../types'

export interface IBusinessRepository {
  findById(id: string, tx?: TransactionContext): Promise<Business | null>
  findByUserId(userId: string, tx?: TransactionContext): Promise<Business | null>
  findByStatus(status: BusinessStatus, options?: PaginationOptions, tx?: TransactionContext): Promise<Business[]>
  findAll(options?: PaginationOptions, tx?: TransactionContext): Promise<Business[]>
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
  }, tx?: TransactionContext): Promise<Business>
  updateStatus(
    id: string,
    status: BusinessStatus,
    notes?: string,
    tx?: TransactionContext,
  ): Promise<Business>
  findByIds(ids: string[], tx?: TransactionContext): Promise<Business[]>
}
