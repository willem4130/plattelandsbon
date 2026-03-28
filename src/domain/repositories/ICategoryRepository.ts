import { Category } from '../entities/Category'
import type { TransactionContext } from '../types'

export interface ICategoryRepository {
  findAll(tx?: TransactionContext): Promise<Category[]>
  findById(id: string, tx?: TransactionContext): Promise<Category | null>
  findBySlug(slug: string, tx?: TransactionContext): Promise<Category | null>
}
