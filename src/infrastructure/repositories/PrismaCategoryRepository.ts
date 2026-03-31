import type { PrismaClient, Category as PrismaCategoryRecord } from '@prisma/client'
import { Category } from '@/domain/entities/Category'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'
import type { TransactionContext } from '@/domain/types'
import { BaseRepository } from './BaseRepository'

export class PrismaCategoryRepository
  extends BaseRepository<Category, PrismaCategoryRecord>
  implements ICategoryRepository
{
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  protected toDomain(record: PrismaCategoryRecord): Category {
    return Category.fromProps({
      id: record.id,
      name: record.name,
      slug: record.slug,
      description: record.description,
      icon: record.icon,
      sortOrder: record.sortOrder,
    })
  }

  async findAll(tx?: TransactionContext): Promise<Category[]> {
    const client = this.getClient(tx)
    const records = await client.category.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return this.mapMany(records)
  }

  async findById(id: string, tx?: TransactionContext): Promise<Category | null> {
    const client = this.getClient(tx)
    const record = await client.category.findUnique({ where: { id } })
    return this.mapOrNull(record)
  }

  async findBySlug(slug: string, tx?: TransactionContext): Promise<Category | null> {
    const client = this.getClient(tx)
    const record = await client.category.findUnique({ where: { slug } })
    return this.mapOrNull(record)
  }
}
