import { Category } from '@/domain/entities/Category'
import type { CategoryDTO } from '../dtos/CategoryDTO'

export class CategoryMapper {
  static toDTO(entity: Category): CategoryDTO {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      icon: entity.icon,
      sortOrder: entity.sortOrder,
    }
  }
}
