import { User } from '../entities/User'
import { UserRole } from '../value-objects/UserRole'
import type { TransactionContext, PaginationOptions } from '../types'

export interface UserSearchFilters {
  role?: UserRole
  search?: string
}

export interface IUserRepository {
  findById(id: string, tx?: TransactionContext): Promise<User | null>
  findByEmail(email: string, tx?: TransactionContext): Promise<User | null>
  findAll(
    filters?: UserSearchFilters,
    options?: PaginationOptions,
    tx?: TransactionContext,
  ): Promise<{ users: User[]; total: number }>
  findByEmailWithPassword(email: string, tx?: TransactionContext): Promise<User | null>
  create(
    data: { email: string; name: string; role: UserRole; hashedPassword?: string },
    tx?: TransactionContext,
  ): Promise<User>
  countByRole(
    tx?: TransactionContext,
  ): Promise<{ total: number; admins: number; businesses: number; consumers: number }>
  countRecent(days: number, tx?: TransactionContext): Promise<number>
}
