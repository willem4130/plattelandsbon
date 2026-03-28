import type { PrismaClient } from '@prisma/client'
import { Category } from '@/domain/entities/Category'
import type { ICategoryRepository } from '@/domain/repositories/ICategoryRepository'

function toDomain(
  record: NonNullable<Awaited<ReturnType<PrismaClient['category']['findFirst']>>>,
): Category {
  return new Category({
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    icon: record.icon,
    sortOrder: record.sortOrder,
  })
}

export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Category[]> {
    const records = await this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return records.map(toDomain)
  }

  async findById(id: string): Promise<Category | null> {
    const record = await this.prisma.category.findUnique({ where: { id } })
    return record ? toDomain(record) : null
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const record = await this.prisma.category.findUnique({ where: { slug } })
    return record ? toDomain(record) : null
  }
}
