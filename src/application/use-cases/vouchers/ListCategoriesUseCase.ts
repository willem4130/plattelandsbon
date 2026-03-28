import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import { CategoryMapper } from '../../mappers/CategoryMapper'
import type { CategoryDTO } from '../../dtos/CategoryDTO'

export class ListCategoriesUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepo.findAll()
    return categories.map(CategoryMapper.toDTO)
  }
}
