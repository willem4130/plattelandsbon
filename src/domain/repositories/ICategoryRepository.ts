import { Category } from '../entities/Category'

export interface ICategoryRepository {
  findAll(): Promise<Category[]>
  findById(id: string): Promise<Category | null>
  findBySlug(slug: string): Promise<Category | null>
}
